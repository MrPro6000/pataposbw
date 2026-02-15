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

    const { storagePath, type } = await req.json();
    if (!storagePath || !type) {
      return new Response(JSON.stringify({ error: "storagePath and type required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download the image from storage using service role
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("kyc-documents")
      .download(storagePath);

    if (downloadError || !fileData) {
      return new Response(JSON.stringify({ error: "Failed to download image" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const mimeType = fileData.type || "image/jpeg";

    // Use Lovable AI (Gemini with vision) to verify if the image is an ID
    const prompt = type === "selfie"
      ? "Analyze this image. Is this a clear photo of a person's face (a selfie)? Reply with JSON only: {\"is_valid\": true/false, \"reason\": \"brief explanation\"}. A valid selfie shows a clear, well-lit face looking at the camera. Reject if it's not a person, is blurry, or is an object/document."
      : "Analyze this image. Is this a photo of an official government-issued identification document (ID card, passport, national ID, driver's license)? Reply with JSON only: {\"is_valid\": true/false, \"reason\": \"brief explanation\"}. A valid ID shows a card/document with text, a photo, and official formatting. Reject screenshots, random photos, non-ID documents, or anything that is clearly not an identification card.";

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
      // If AI fails, allow through (don't block KYC due to AI issues)
      return new Response(JSON.stringify({ is_valid: true, reason: "AI verification unavailable, manual review required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await aiResponse.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    // Parse the JSON from AI response
    let verification = { is_valid: true, reason: "Unable to parse AI response" };
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
