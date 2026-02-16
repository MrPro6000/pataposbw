import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Verify the user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { storagePath, type, omangNumber, idFrontPath, selfieAction } = await req.json();

    // --- Action: Cross-verify selfie against ID front photo ---
    if (selfieAction === "cross_verify") {
      if (!storagePath || !idFrontPath) {
        return new Response(JSON.stringify({ error: "storagePath and idFrontPath required for cross-verify" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      // Download both images in parallel
      const [selfieResult, idResult] = await Promise.all([
        adminClient.storage.from("kyc-documents").download(storagePath),
        adminClient.storage.from("kyc-documents").download(idFrontPath),
      ]);

      if (selfieResult.error || !selfieResult.data || idResult.error || !idResult.data) {
        return new Response(JSON.stringify({ error: "Failed to download images" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const [selfieBuffer, idBuffer] = await Promise.all([
        selfieResult.data.arrayBuffer(),
        idResult.data.arrayBuffer(),
      ]);

      const selfieBase64 = btoa(String.fromCharCode(...new Uint8Array(selfieBuffer)));
      const idBase64 = btoa(String.fromCharCode(...new Uint8Array(idBuffer)));
      const selfieMime = selfieResult.data.type || "image/jpeg";
      const idMime = idResult.data.type || "image/jpeg";

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Compare these two images. The first is a selfie photo. The second is a government-issued ID card with a photo on it. Do these appear to be the SAME PERSON? Consider facial features, face shape, and overall appearance. Minor differences due to age, lighting, or angle are acceptable. Reply with JSON only: {"is_match": true/false, "confidence": "high"/"medium"/"low", "reason": "brief explanation"}`
                },
                { type: "image_url", image_url: { url: `data:${selfieMime};base64,${selfieBase64}` } },
                { type: "image_url", image_url: { url: `data:${idMime};base64,${idBase64}` } },
              ],
            },
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error("AI gateway error:", aiResponse.status);
        return new Response(JSON.stringify({ is_match: true, confidence: "low", reason: "AI verification unavailable" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || "";

      let result = { is_match: true, confidence: "low", reason: "Unable to parse AI response" };
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to parse cross-verify response:", content);
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Standard single-image verification ---
    if (!storagePath || !type) {
      return new Response(JSON.stringify({ error: "storagePath and type required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("kyc-documents")
      .download(storagePath);

    if (downloadError || !fileData) {
      return new Response(JSON.stringify({ error: "Failed to download image" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const mimeType = fileData.type || "image/jpeg";

    // Build prompt based on type — for ID front, also extract the ID number if omangNumber provided
    let prompt: string;
    if (type === "selfie") {
      prompt = "Analyze this image. Is this a clear photo of a person's face (a selfie)? Reply with JSON only: {\"is_valid\": true/false, \"reason\": \"brief explanation\"}. A valid selfie shows a clear, well-lit face looking at the camera. Reject if it's not a person, is blurry, or is an object/document.";
    } else if (type === "front" && omangNumber) {
      prompt = `Analyze this image. 
1. Is this a photo of an official government-issued identification document (ID card, passport, national ID)?
2. Can you read any ID/document number on it? If so, does it match or contain the number "${omangNumber}"?

Reply with JSON only: {"is_valid": true/false, "id_number_match": true/false/null, "extracted_number": "the number you found or null", "reason": "brief explanation"}. 

A valid ID shows a card/document with text, a photo, and official formatting. Reject screenshots, random photos, non-ID documents. For id_number_match: true if the number matches, false if a different number is visible, null if you cannot read the number clearly.`;
    } else {
      prompt = "Analyze this image. Is this a photo of an official government-issued identification document (ID card, passport, national ID, driver's license)? Reply with JSON only: {\"is_valid\": true/false, \"reason\": \"brief explanation\"}. A valid ID shows a card/document with text, a photo, and official formatting. Reject screenshots, random photos, non-ID documents, or anything that is clearly not an identification card.";
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI gateway error:", aiResponse.status);
      return new Response(JSON.stringify({ is_valid: true, reason: "AI verification unavailable, manual review required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    let verification: any = { is_valid: true, reason: "Unable to parse AI response" };
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verification = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error("Failed to parse AI response:", content);
    }

    return new Response(JSON.stringify(verification), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-id error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
