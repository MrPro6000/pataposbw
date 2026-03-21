import { useState } from "react";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";

interface MobileEWalletSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileEWalletSheet = ({ open, onClose }: MobileEWalletSheetProps) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "processing" | "success">("form");
  const { balance, addTransaction } = useTransactions();
  const { toast } = useToast();

  const parsedAmount = parseFloat(amount) || 0;
  const isValidPhone = /^7\d{7}$/.test(phone);
  const canProceed = isValidPhone && parsedAmount > 0;

  const handleConfirm = () => {
    if (parsedAmount > balance) {
      toast({ title: "Insufficient Balance", description: `Your wallet balance is P${balance.toFixed(2)}`, variant: "destructive" });
      return;
    }
    setStep("confirm");
  };

  const handleSend = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2000));

    const { error } = await addTransaction({
      type: "purchase",
      payment_method: "wallet",
      amount: -parsedAmount,
      description: `E-Wallet • Sent to ${phone}${reference ? ` • ${reference}` : ""}`,
      status: "completed",
    });

    if (error) {
      toast({ title: "Failed", description: error, variant: "destructive" });
      setStep("form");
      return;
    }

    setStep("success");
  };

  const resetAndClose = () => {
    setPhone("");
    setAmount("");
    setReference("");
    setStep("form");
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && resetAndClose()} dismissible={step !== "processing"}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold text-foreground">Send E-Wallet</DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">Send money to any mobile number</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button className="p-2 -mr-2">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "form" && (
            <div className="space-y-5">
              {/* Balance */}
              <div className="bg-primary/10 rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-3xl font-bold text-foreground">P{balance.toFixed(2)}</p>
              </div>

              {/* Recipient Phone */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Recipient Phone Number *</Label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="7XXXXXXX"
                  maxLength={8}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
                {phone.length > 0 && !isValidPhone && (
                  <p className="text-xs text-destructive">Must be 8 digits starting with 7</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Amount (P) *</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="text-2xl font-bold h-14 text-center"
                />
              </div>

              {/* Reference */}
              <div className="space-y-2">
                <Label className="text-foreground">Reference (optional)</Label>
                <Input
                  placeholder="e.g. Groceries, Rent"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>

              <Button className="w-full h-14 text-lg" disabled={!canProceed} onClick={handleConfirm}>
                <Send className="w-5 h-5 mr-2" />
                Send P{parsedAmount.toFixed(2)}
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6 text-center">
              <div className="bg-muted rounded-2xl p-6 space-y-3">
                <p className="text-sm text-muted-foreground">You are sending</p>
                <p className="text-4xl font-bold text-foreground">P{parsedAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">to</p>
                <p className="text-xl font-semibold text-foreground">{phone}</p>
                {reference && <p className="text-sm text-muted-foreground">Ref: {reference}</p>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setStep("form")}>Back</Button>
                <Button className="flex-1 h-12" onClick={handleSend}>Confirm & Send</Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-semibold text-foreground">Sending E-Wallet...</p>
              <p className="text-sm text-muted-foreground">Processing your transfer</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground">E-Wallet Sent!</p>
              <p className="text-muted-foreground text-center">
                P{parsedAmount.toFixed(2)} sent to {phone}
              </p>
              <Button className="w-full h-12 mt-4" onClick={resetAndClose}>Done</Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileEWalletSheet;
