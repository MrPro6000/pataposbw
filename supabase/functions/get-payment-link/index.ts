import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_link_id } = await req.json();

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!payment_link_id || !uuidRegex.test(payment_link_id)) {
      return new Response(JSON.stringify({ error: "Invalid payment link ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch payment link
    const { data: link, error: linkError } = await supabase
      .from("payment_links")
      .select("id, amount, customer_name, customer_phone, description, status, created_at, user_id, expires_at")
      .eq("id", payment_link_id)
      .single();

    if (linkError || !link) {
      return new Response(JSON.stringify({ error: "Payment link not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch merchant profile (only public-safe fields)
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, full_name")
      .eq("user_id", link.user_id)
      .single();

    return new Response(JSON.stringify({ link, merchant: profile }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching payment link:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch payment link" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
