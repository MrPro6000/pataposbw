import { useState, useEffect } from "react";
import { CreditCard, Banknote, Smartphone, CheckCircle, Wifi, NfcIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import orangeMoneyLogo from "@/assets/mobile-money/orange-money.png";
import smegaLogo from "@/assets/mobile-money/smega.png";
import myzakaLogo from "@/assets/mobile-money/myzaka.png";

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "smega", name: "Smega", logo: smegaLogo },
  { id: "myzaka", name: "MyZaka", logo: myzakaLogo },
];

export type PaymentMethod = "card" | "cash" | "mobile-money";
export type PaymentStep = "select" | "card-tap" | "card-processing" | "cash-tendered" | "mobile-provider" | "mobile-sending" | "success";

interface PaymentFlowProps {
  total: number;
  itemCount: number;
  onComplete: () => void;
  onBack: () => void;
  className?: string;
}

const PaymentFlow = ({ total, itemCount, onComplete, onBack, className = "" }: PaymentFlowProps) => {
  const [step, setStep] = useState<PaymentStep>("select");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cashTendered, setCashTendered] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const cashChange = cashTendered ? parseFloat(cashTendered) - total : 0;

  // Card tap → processing → success animation
  useEffect(() => {
    if (step === "card-tap") {
      const timer = setTimeout(() => setStep("card-processing"), 3000);
      return () => clearTimeout(timer);
    }
    if (step === "card-processing") {
      const timer = setTimeout(() => setStep("success"), 2000);
      return () => clearTimeout(timer);
    }
    if (step === "mobile-sending") {
      const timer = setTimeout(() => setStep("success"), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSelectMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "card") setStep("card-tap");
    else if (method === "cash") setStep("cash-tendered");
    else setStep("mobile-provider");
  };

  const handleCashComplete = () => {
    if (!cashTendered || parseFloat(cashTendered) < total) return;
    setStep("success");
  };

  const handleMobileSend = () => {
    if (!selectedProvider || !customerPhone) return;
    setStep("mobile-sending");
  };

  return (
    <div className={className}>
      {/* PAYMENT METHOD SELECT */}
      {step === "select" && (
        <div className="space-y-4">
          <div className="bg-muted rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-foreground">P{total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>

          <p className="font-semibold text-foreground">Select Payment Method</p>

          <div className="space-y-3">
            <button onClick={() => handleSelectMethod("card")}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted active:scale-[0.98] transition-all">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Card Payment</p>
                <p className="text-sm text-muted-foreground">Tap, insert or swipe</p>
              </div>
            </button>

            <button onClick={() => handleSelectMethod("cash")}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted active:scale-[0.98] transition-all">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Cash</p>
                <p className="text-sm text-muted-foreground">Record cash payment</p>
              </div>
            </button>

            <button onClick={() => handleSelectMethod("mobile-money")}
              className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted active:scale-[0.98] transition-all">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Mobile Money</p>
                <p className="text-sm text-muted-foreground">Orange Money, Smega, MyZaka</p>
              </div>
            </button>
          </div>

          <Button variant="outline" onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Button>
        </div>
      )}

      {/* CARD TAP SCREEN */}
      {step === "card-tap" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="bg-muted rounded-2xl p-4 text-center w-full">
            <p className="text-sm text-muted-foreground">Charge Amount</p>
            <p className="text-4xl font-bold text-foreground">P{total.toFixed(2)}</p>
          </div>

          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Wifi className="w-12 h-12 text-primary rotate-90" />
              </div>
            </div>
            {/* Ripple rings */}
            <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/30 animate-ping" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">Tap, Insert or Swipe Card</p>
            <p className="text-sm text-muted-foreground">Hold card near the terminal</p>
          </div>

          <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-sm text-muted-foreground">Waiting for card...</p>
          </div>

          <Button variant="outline" onClick={() => setStep("select")} className="w-full">Cancel</Button>
        </div>
      )}

      {/* CARD PROCESSING */}
      {step === "card-processing" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">Processing Payment</p>
            <p className="text-sm text-muted-foreground">P{total.toFixed(2)} — Authorising...</p>
          </div>
          <div className="bg-muted rounded-xl p-3 flex items-center gap-3 w-full max-w-xs">
            <CreditCard className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Card ending in</p>
              <p className="text-sm font-mono font-semibold text-foreground">•••• 4829</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      )}

      {/* CASH TENDERED */}
      {step === "cash-tendered" && (
        <div className="space-y-4">
          <div className="bg-muted rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount Due</p>
            <p className="text-4xl font-bold text-foreground">P{total.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Cash Tendered (P)</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={cashTendered}
              onChange={e => setCashTendered(e.target.value)}
              placeholder="0.00"
              className="h-14 text-2xl font-bold text-center"
              autoFocus
            />
          </div>

          {cashTendered && parseFloat(cashTendered) >= total && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <p className="text-sm text-emerald-600 font-medium">Change Due</p>
              <p className="text-3xl font-bold text-emerald-600">P{cashChange.toFixed(2)}</p>
            </div>
          )}

          {cashTendered && parseFloat(cashTendered) > 0 && parseFloat(cashTendered) < total && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-center">
              <p className="text-sm text-destructive font-medium">Insufficient</p>
              <p className="text-lg font-bold text-destructive">
                Short by P{(total - parseFloat(cashTendered)).toFixed(2)}
              </p>
            </div>
          )}

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 50, 100, 200, 500, 1000].filter(a => a >= total).slice(0, 4).map(amount => (
              <button key={amount} onClick={() => setCashTendered(amount.toString())}
                className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                  cashTendered === amount.toString() ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }`}>
                P{amount}
              </button>
            ))}
          </div>

          <Button onClick={() => setCashTendered(total.toFixed(2))}
            variant="outline" className="w-full">
            Exact Amount (P{total.toFixed(2)})
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setCashTendered(""); setStep("select"); }} className="flex-1">Cancel</Button>
            <Button onClick={handleCashComplete}
              disabled={!cashTendered || parseFloat(cashTendered) < total}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
              Confirm Payment
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE MONEY PROVIDER */}
      {step === "mobile-provider" && (
        <div className="space-y-4">
          <div className="bg-muted rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-foreground">P{total.toFixed(2)}</p>
          </div>

          <p className="font-semibold text-foreground">Select Provider</p>
          <div className="grid grid-cols-3 gap-3">
            {mobileMoneyProviders.map(p => (
              <button key={p.id} onClick={() => setSelectedProvider(p.id)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                  selectedProvider === p.id ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}>
                <img src={p.logo} alt={p.name} className="w-12 h-12 object-contain mb-2 rounded-lg" />
                <p className="text-xs font-medium text-foreground text-center">{p.name}</p>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Customer Phone Number</Label>
            <Input
              type="tel"
              placeholder="+267 71 234 5678"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setSelectedProvider(""); setCustomerPhone(""); setStep("select"); }} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleMobileSend}
              disabled={!selectedProvider || !customerPhone}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              Send Request
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE MONEY SENDING */}
      {step === "mobile-sending" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold text-foreground">Sending Payment Request</p>
            <p className="text-sm text-muted-foreground">
              Waiting for customer to approve on {mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}...
            </p>
          </div>
          <div className="bg-muted rounded-xl p-3 flex items-center gap-3 w-full max-w-xs">
            <Smartphone className="w-5 h-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Sent to</p>
              <p className="text-sm font-mono font-semibold text-foreground">{customerPhone}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === "success" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-foreground">Payment Successful!</p>
          <p className="text-2xl font-bold text-foreground">P{total.toFixed(2)}</p>

          <div className="bg-muted rounded-2xl p-4 w-full max-w-sm space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium text-foreground capitalize">{paymentMethod?.replace("-", " ")}</span>
            </div>
            {paymentMethod === "cash" && cashTendered && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tendered</span>
                  <span className="font-medium text-foreground">P{parseFloat(cashTendered).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Change</span>
                  <span className="font-bold text-emerald-600">P{cashChange.toFixed(2)}</span>
                </div>
              </>
            )}
            {paymentMethod === "mobile-money" && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium text-foreground">{mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium text-foreground">{customerPhone}</span>
                </div>
              </>
            )}
            {paymentMethod === "card" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card</span>
                <span className="font-mono font-medium text-foreground">•••• 4829</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium text-foreground">{itemCount}</span>
            </div>
          </div>

          <Button onClick={onComplete} className="w-full mt-2">Done</Button>
        </div>
      )}
    </div>
  );
};

export default PaymentFlow;
