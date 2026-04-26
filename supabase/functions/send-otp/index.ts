import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    // Verify user is authenticated
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { phone_number } = await req.json();

    // Validate Botswana phone number
    const phoneRegex = /^\+267[78]\d{7}$/;
    if (!phone_number || !phoneRegex.test(phone_number)) {
      return new Response(JSON.stringify({ error: "Invalid Botswana phone number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limit: max 3 OTPs per phone per 10 minutes
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const { count } = await adminClient
      .from("otp_verifications")
      .select("*", { count: "exact", head: true })
      .eq("phone_number", phone_number)
      .gte("created_at", tenMinutesAgo);

    if (count && count >= 3) {
      return new Response(JSON.stringify({ error: "Too many OTP requests. Please wait 10 minutes." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hashOTP(otp);

    // Store hashed OTP in database
    const { error: insertError } = await adminClient.from("otp_verifications").insert({
      user_id: user.id,
      phone_number,
      otp_code: hashedOtp,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to create OTP" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TODO: In production, send OTP via SMS provider (e.g. Twilio, Africa's Talking)
    // OTP is only logged server-side for development; never returned in the response.
    console.log(`OTP for ${phone_number}: ${otp}`);

    return new Response(JSON.stringify({
      success: true,
      message: "OTP sent successfully",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
