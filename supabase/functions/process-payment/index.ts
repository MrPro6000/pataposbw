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
    const { payment_link_id, payment_method } = await req.json();

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!payment_link_id || !uuidRegex.test(payment_link_id)) {
      return new Response(JSON.stringify({ error: "Invalid payment link ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Whitelist allowed payment methods
    const allowedMethods = ["card", "mobile_money", "cash", "qr", "orange_money", "myzaka", "smega"];
    if (!payment_method || !allowedMethods.includes(payment_method)) {
      return new Response(JSON.stringify({ error: "Invalid payment method" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch the payment link
    const { data: link, error: linkError } = await supabase
      .from("payment_links")
      .select("*")
      .eq("id", payment_link_id)
      .single();

    if (linkError || !link) {
      return new Response(JSON.stringify({ error: "Payment link not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (link.status !== "pending") {
      return new Response(JSON.stringify({ error: "Payment link already used or expired" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update the payment link to paid
    const { error: updateError } = await supabase
      .from("payment_links")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", payment_link_id);

    if (updateError) throw updateError;

    // Credit merchant's account via transactions table
    const { error: txError } = await supabase.from("transactions").insert({
      user_id: link.user_id,
      type: "sale",
      payment_method: payment_method,
      amount: link.amount,
      description: `Payment Link • ${link.customer_name}${link.description ? ` — ${link.description}` : ""}`,
      status: "completed",
    });

    if (txError) throw txError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    return new Response(JSON.stringify({ error: "Payment processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
