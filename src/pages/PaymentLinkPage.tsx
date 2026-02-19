import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Clock, XCircle, CreditCard, Smartphone, Banknote, QrCode, Link2, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import PataLogo from "@/components/PataLogo";

interface PaymentLink {
  id: string;
  amount: number;
  customer_name: string;
  customer_phone: string | null;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

interface MerchantProfile {
  business_name: string | null;
  full_name: string | null;
}

type PayView = "details" | "choose" | "processing" | "success" | "expired";

const PAYMENT_METHODS = [
  { id: "card", label: "Pay by Card", icon: CreditCard, color: "from-blue-500 to-blue-600" },
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone, color: "from-green-500 to-green-600" },
  { id: "cash", label: "Cash", icon: Banknote, color: "from-emerald-500 to-emerald-600" },
  { id: "qr", label: "QR Code", icon: QrCode, color: "from-purple-500 to-purple-600" },
];

const PaymentLinkPage = () => {
  const { id } = useParams<{ id: string }>();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<PayView>("details");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [receiptRef] = useState(`PAY-${Math.random().toString(36).toUpperCase().slice(2, 10)}`);

  useEffect(() => {
    const fetchLink = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setView("expired");
        setLoading(false);
        return;
      }

      setLink(data as PaymentLink);

      if (data.status === "paid" || data.status === "completed") {
        setView("success");
      } else if (data.status !== "pending") {
        setView("expired");
      }

      // Fetch merchant profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, full_name")
        .eq("user_id", data.user_id)
        .single();

      if (profile) setMerchant(profile);
      setLoading(false);
    };

    fetchLink();
  }, [id]);

  const handlePay = async () => {
    if (!selectedMethod || !link) return;
    setView("processing");

    // Animate steps
    const steps = ["Connecting...", "Verifying...", "Processing payment...", "Confirming..."];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep(i + 1);
    }

    // Mark as paid
    await supabase
      .from("payment_links")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", link.id);

    // Insert transaction for the merchant
    await supabase.from("transactions").insert({
      user_id: link.user_id,
      type: "sale",
      payment_method: selectedMethod,
      amount: link.amount,
      description: `Payment Link • ${link.customer_name}${link.description ? ` — ${link.description}` : ""}`,
      status: "completed",
    });

    setView("success");
  };

  const merchantName = merchant?.business_name || merchant?.full_name || "Merchant";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === "expired" || !link) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Link Unavailable</h1>
        <p className="text-muted-foreground">This payment link is invalid, expired, or has already been paid.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <PataLogo className="h-6" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Secure Payment
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-8">

        {/* DETAILS VIEW */}
        {view === "details" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Payment request from</p>
              <h1 className="text-2xl font-bold text-foreground">{merchantName}</h1>
            </div>

            <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
              <div className="text-center border-b border-border pb-4">
                <p className="text-sm text-muted-foreground mb-1">Amount Due</p>
                <p className="text-5xl font-bold text-foreground">P{link.amount.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">For</span>
                  <span className="text-foreground font-medium">{link.customer_name}</span>
                </div>
                {link.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-foreground font-medium text-right max-w-[60%]">{link.description}</span>
                  </div>
                )}
                {link.customer_phone && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="text-foreground font-medium">{link.customer_phone}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="text-foreground font-medium">{format(new Date(link.created_at), "d MMM yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={() => setView("choose")} className="w-full h-14 text-lg font-semibold rounded-2xl">
              Pay P{link.amount.toFixed(2)}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Powered by Pata · Secure & encrypted
            </p>
          </div>
        )}

        {/* CHOOSE PAYMENT METHOD */}
        {view === "choose" && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("details")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <h2 className="text-xl font-bold text-foreground">Choose payment method</h2>
            </div>

            <div className="bg-muted rounded-2xl px-4 py-3 flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-xl font-bold text-foreground">P{link.amount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-foreground text-lg">{method.label}</span>
                  {selectedMethod === method.id && (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handlePay}
              disabled={!selectedMethod}
              className="w-full h-14 text-lg font-semibold rounded-2xl"
            >
              Confirm Payment
            </Button>
          </div>
        )}

        {/* PROCESSING */}
        {view === "processing" && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center space-y-2">
              {["Connecting", "Verifying", "Processing payment", "Confirming"].map((step, i) => (
                <p
                  key={step}
                  className={`text-sm transition-all duration-300 ${
                    i < processingStep ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {i < processingStep ? "✓ " : ""}{step}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* SUCCESS RECEIPT */}
        {view === "success" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Payment Successful!</h1>
              <p className="text-muted-foreground text-center">Your payment has been confirmed.</p>
            </div>

            {/* Receipt Card */}
            <div id="receipt" className="bg-card rounded-3xl border border-border overflow-hidden">
              {/* Receipt Header */}
              <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-center">
                <PataLogo className="h-6 mx-auto mb-3 [&_*]:fill-white" />
                <p className="text-white/80 text-sm">Payment Receipt</p>
              </div>

              {/* Dashed divider */}
              <div className="relative py-2">
                <div className="border-t-2 border-dashed border-border mx-4" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-border" />
              </div>

              <div className="p-5 space-y-3">
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Paid to {merchantName}</p>
                </div>

                {[
                  { label: "Customer", value: link.customer_name },
                  { label: "Description", value: link.description || "Payment" },
                  { label: "Date", value: format(new Date(), "d MMM yyyy, h:mm a") },
                  { label: "Reference", value: receiptRef },
                  { label: "Status", value: "✓ Paid", green: true },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-medium ${green ? "text-green-600" : "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Dashed divider */}
              <div className="relative py-2">
                <div className="border-t-2 border-dashed border-border mx-4" />
              </div>

              <p className="text-center text-xs text-muted-foreground py-3 pb-5">
                Thank you for using Pata · pataposbw.lovable.app
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Save / Print Receipt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLinkPage;
