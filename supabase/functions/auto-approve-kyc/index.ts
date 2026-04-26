import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { kycId, idFrontPath, idBackPath, selfiePath, omangNumber } = await req.json();

    if (!kycId || !idFrontPath || !idBackPath || !selfiePath) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Download all three images in parallel
    const [frontResult, backResult, selfieResult] = await Promise.all([
      adminClient.storage.from("kyc-documents").download(idFrontPath),
      adminClient.storage.from("kyc-documents").download(idBackPath),
      adminClient.storage.from("kyc-documents").download(selfiePath),
    ]);

    if (frontResult.error || backResult.error || selfieResult.error) {
      return new Response(
        JSON.stringify({ approved: false, reason: "Failed to download KYC documents for review." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [frontBuffer, backBuffer, selfieBuffer] = await Promise.all([
      frontResult.data!.arrayBuffer(),
      backResult.data!.arrayBuffer(),
      selfieResult.data!.arrayBuffer(),
    ]);

    const frontBase64 = arrayBufferToBase64(frontBuffer);
    const backBase64 = arrayBufferToBase64(backBuffer);
    const selfieBase64 = arrayBufferToBase64(selfieBuffer);

    const frontMime = frontResult.data!.type || "image/jpeg";
    const backMime = backResult.data!.type || "image/jpeg";
    const selfieMime = selfieResult.data!.type || "image/jpeg";

    // Single AI call to review the entire KYC submission at once
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
                text: `You are a KYC (Know Your Customer) verification AI. Review the following submission carefully.

The submitted ID number is: "${omangNumber}"

You are given 3 images in this order:
1. ID Front side (should show photo, name, ID number)
2. ID Back side (the reverse/back of the same ID)
3. Selfie (a live photo of the person)

Perform these checks:
A) Is Image 1 the FRONT of a government-issued ID card (Omang/national ID or passport)? Does it have a visible photo, name, and ID number?
B) Does the ID number on Image 1 match or contain "${omangNumber}"?
C) Is Image 2 the BACK/REVERSE side of a government-issued ID?
D) Is Image 3 a clear selfie of a real person's face?
E) Does the face in the selfie (Image 3) match the face on the ID front (Image 1)?

If ALL checks pass: approve.
If ANY check fails: reject and clearly state which specific check failed and why.

Respond with JSON only:
{
  "approved": true/false,
  "reason": "Brief human-readable explanation. If rejected, clearly state the specific problem (e.g., 'The ID number on the document (12345678) does not match the submitted number (987654321)' or 'Image 2 appears to be the front of the ID again, not the back' or 'The selfie face does not match the ID photo')."
}`,
              },
              { type: "image_url", image_url: { url: `data:${frontMime};base64,${frontBase64}` } },
              { type: "image_url", image_url: { url: `data:${backMime};base64,${backBase64}` } },
              { type: "image_url", image_url: { url: `data:${selfieMime};base64,${selfieBase64}` } },
            ],
          },
        ],
      }),
    });

    // Fail-closed: if AI verification is unavailable or unparseable, leave the
    // submission pending for manual admin review rather than auto-approving.
    let decision: { approved: boolean; reason: string } | null = null;

    if (aiResponse.ok) {
      const aiResult = await aiResponse.json();
      const content = aiResult.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) decision = JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to parse AI response:", content);
      }
    } else {
      console.error("AI gateway error:", aiResponse.status);
    }

    // If AI was unavailable or response unparseable, keep submission pending.
    if (!decision) {
      const { error: pendingErr } = await adminClient
        .from("kyc_submissions")
        .update({
          status: "pending",
          rejection_reason: "Verification service unavailable — pending manual review",
        })
        .eq("id", kycId);
      if (pendingErr) console.error("Failed to set pending status:", pendingErr);
      return new Response(
        JSON.stringify({ approved: false, pending: true, reason: "Verification service unavailable — pending manual review" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update KYC status in DB using service role
    const newStatus = decision.approved ? "approved" : "rejected";
    const { error: updateError } = await adminClient
      .from("kyc_submissions")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: null,
        rejection_reason: decision.approved ? null : decision.reason,
      })
      .eq("id", kycId);

    if (updateError) {
      console.error("Failed to update KYC status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update KYC status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If approved, insert a notification for the user
    if (decision.approved) {
      await adminClient.from("notifications").insert({
        title: "KYC Verified ✓",
        message: "Your identity has been successfully verified. You can now complete your business setup and access all features.",
        is_published: true,
        published_at: new Date().toISOString(),
        target_audience: user.id, // store user id as target so they know it's for them
        created_by: null,
      }).then(); // fire-and-forget
    }

    return new Response(JSON.stringify(decision), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-approve-kyc error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
