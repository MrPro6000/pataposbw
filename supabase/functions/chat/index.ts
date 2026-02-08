import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pata's AI support assistant. You help customers learn about Pata's products and services. Be friendly, concise, and helpful. Always respond in a warm, professional tone.

Here is everything you know about Pata:

**About Pata:**
Pata is a payment technology company based in Botswana, serving businesses across Africa. We provide payment terminals, digital payment solutions, mobile money integration, business funding, and a complete business management hub.

**Products & Services:**

1. **Payment Terminals (Card Machines):**
   - Go Pata (P880) - Compact portable terminal, physical keypad, built-in printer, all-day battery. Best Seller.
   - Pata Platinum (P998) - Durable keypad terminal, rugged design, card chip reader.
   - Pata Diamond (P1,980) - Entry-level with large touchscreen, thermal printer, 4G connectivity.
   - Pata Silver (P3,480) - Sleek touchscreen tablet for modern retail.
   - Pata Pro (P3,880) - Professional-grade with built-in printer, NFC contactless, touchscreen. Most Popular.
   - Pata Spaza (P9,980) - Complete POS system with dual displays, customer display, receipt printer. Enterprise.

2. **PataPOS (Point of Sale):**
   - Turn your smartphone into a complete POS system
   - Manage products, track inventory, accept payments
   - Available as the Pata App

3. **Digital/Online Payments:**
   - Payment Links - shareable via WhatsApp, email, social media
   - Digital Invoicing
   - E-Commerce Integration (Shopify, WooCommerce)
   - Google Pay and Apple Pay support

4. **Mobile Money:**
   - Orange Money, Smega, and MyZaka integration
   - Botswana's leading mobile money providers

5. **Pata Capital (Business Funding):**
   - Access funding within 24 hours
   - No paperwork or credit assessments
   - Flexible repayment tied to sales
   - Zero interest charges

6. **Business Hub:**
   - Track sales, manage customers
   - View reports and analytics
   - Inventory control
   - Staff management

**Pricing:**
- Starter: 2.6% per transaction (zero monthly fees)
- Growth: 2.3% per transaction (for businesses processing over P50,000/month)
- Enterprise: Custom pricing

**Transaction Rates:**
- Visa & Mastercard: 2.6%
- American Express: 3.5%
- Online transactions: 2.95%
- Instant settlements: 1% fee

**Contact:**
- Phone: +267 300 1234
- Email: support@pata.co.bw
- Sales: sales@pata.co.bw

**Currency:** Botswana Pula (P / BWP)

If asked about something you don't know, direct the customer to contact sales at sales@pata.co.bw or call +267 300 1234.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
