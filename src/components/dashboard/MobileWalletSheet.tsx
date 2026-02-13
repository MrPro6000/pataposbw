import { useState } from "react";
import { Wallet, CreditCard, Smartphone, Plus, ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import orangeMoneyImg from "@/assets/mobile-money/orange-money.png";
import smegaImg from "@/assets/mobile-money/smega.png";
import myzakaImg from "@/assets/mobile-money/myzaka.png";

interface MobileWalletSheetProps {
  open: boolean;
  onClose: () => void;
}

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", img: orangeMoneyImg },
  { id: "smega", name: "Smega", img: smegaImg },
  { id: "myzaka", name: "MyZaka", img: myzakaImg },
];

const MobileWalletSheet = ({ open, onClose }: MobileWalletSheetProps) => {
  const [view, setView] = useState<"main" | "topup" | "method" | "provider" | "success">("main");
  const [topupMethod, setTopupMethod] = useState<"card" | "mobile_money" | "">("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const balance = 0;

  const resetState = () => {
    setView("main");
    setTopupMethod("");
    setSelectedProvider("");
    setAmount("");
    setCardNumber("");
    setPhoneNumber("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSelectMethod = (method: "card" | "mobile_money") => {
    setTopupMethod(method);
    if (method === "mobile_money") {
      setView("provider");
    } else {
      setView("method");
    }
  };

  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
    setView("method");
  };

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (topupMethod === "card" && !cardNumber) return;
    if (topupMethod === "mobile_money" && !phoneNumber) return;
    setView("success");
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {view === "main" && "Wallet"}
            {view === "topup" && "Add Money"}
            {view === "provider" && "Select Provider"}
            {view === "method" && "Enter Details"}
            {view === "success" && "Top-up Successful"}
          </SheetTitle>
        </SheetHeader>

        {view === "main" && (
          <div className="space-y-4 py-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-center">
              <Wallet className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/70">Available Balance</p>
              <p className="text-3xl font-bold text-primary-foreground mt-1">P{balance.toFixed(2)}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setView("topup")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-foreground">Add Money</span>
              </button>

              <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Send</span>
              </button>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h3>
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No transactions yet</p>
                <p className="text-xs">Add money to get started</p>
              </div>
            </div>
          </div>
        )}

        {view === "topup" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount (P)</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-2xl font-bold h-14 text-center"
              />
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 200, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className="p-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:border-primary transition-colors"
                >
                  P{val}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Top-up Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelectMethod("card")}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                    topupMethod === "card" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  onClick={() => handleSelectMethod("mobile_money")}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                    topupMethod === "mobile_money" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm font-medium">Mobile Money</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "provider" && (
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Select your mobile money provider</p>
            {mobileMoneyProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSelectProvider(provider.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors active:scale-[0.98] ${
                  selectedProvider === provider.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <img src={provider.img} alt={provider.name} className="w-10 h-10 rounded-lg object-contain" />
                <span className="font-semibold text-foreground">{provider.name}</span>
              </button>
            ))}
          </div>
        )}

        {view === "method" && (
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Top-up Amount</p>
              <p className="text-2xl font-bold text-foreground">P{amount || "0.00"}</p>
              <p className="text-xs text-muted-foreground capitalize mt-1">
                via {topupMethod === "mobile_money" 
                  ? mobileMoneyProviders.find(p => p.id === selectedProvider)?.name || "Mobile Money"
                  : "Card"}
              </p>
            </div>

            {topupMethod === "card" ? (
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 71234567"
                  inputMode="tel"
                />
              </div>
            )}

            <Button onClick={handleConfirm} className="w-full bg-primary text-primary-foreground">
              Confirm Top-up — P{amount || "0.00"}
            </Button>
            <Button variant="outline" onClick={() => setView("topup")} className="w-full">
              Back
            </Button>
          </div>
        )}

        {view === "success" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Top-up Successful</h3>
            <div className="bg-muted rounded-xl p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Amount: <span className="text-foreground font-medium">P{parseFloat(amount).toFixed(2)}</span></p>
              <p className="text-sm text-muted-foreground">Method: <span className="text-foreground font-medium capitalize">
                {topupMethod === "mobile_money" 
                  ? mobileMoneyProviders.find(p => p.id === selectedProvider)?.name 
                  : "Card"}
              </span></p>
            </div>
            <Button onClick={handleClose} className="w-full bg-primary text-primary-foreground">
              Done
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileWalletSheet;
