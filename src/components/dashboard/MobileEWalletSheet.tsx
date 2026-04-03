import { useState } from "react";
import { X, Send, CheckCircle, Loader2, Copy, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money" },
  { id: "mascom", name: "Mascom MyZaka" },
  { id: "btc", name: "BTC Smega" },
  { id: "poso", name: "POSO Money" },
  { id: "mani", name: "Mani" },
];

const generateEWalletCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const MobileEWalletSheet = ({ open, onClose }: MobileEWalletSheetProps) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [sendMethod, setSendMethod] = useState<"direct" | "code">("direct");
  const [provider, setProvider] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "processing" | "success">("form");
  const [generatedCode, setGeneratedCode] = useState("");
  const { balance, addTransaction } = useTransactions();
  const { toast } = useToast();

  const parsedAmount = parseFloat(amount) || 0;
  const isValidPhone = /^7\d{7}$/.test(phone);
  const canProceed = sendMethod === "code"
    ? parsedAmount > 0
    : isValidPhone && parsedAmount > 0;

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

    const code = sendMethod === "code" ? generateEWalletCode() : "";
    const providerName = provider ? mobileMoneyProviders.find(p => p.id === provider)?.name : "";
    const descParts = ["E-Wallet"];
    if (sendMethod === "code") {
      descParts.push(`Code: ${code}`);
    } else {
      descParts.push(`Sent to ${phone}`);
    }
    if (providerName) descParts.push(providerName);
    if (reference) descParts.push(reference);

    const { error } = await addTransaction({
      type: "purchase",
      payment_method: "wallet",
      amount: -parsedAmount,
      description: descParts.join(" • "),
      status: "completed",
    });

    if (error) {
      toast({ title: "Failed", description: error, variant: "destructive" });
      setStep("form");
      return;
    }

    setGeneratedCode(code);
    setStep("success");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Copied!", description: "E-Wallet code copied to clipboard" });
  };

  const resetAndClose = () => {
    setPhone("");
    setAmount("");
    setReference("");
    setSendMethod("direct");
    setProvider("");
    setStep("form");
    setGeneratedCode("");
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && resetAndClose()} dismissible={step !== "processing"}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-bold text-foreground">Send E-Wallet</DrawerTitle>
              <DrawerDescription className="text-xs text-muted-foreground mt-0.5">Send money or generate a cash-out code</DrawerDescription>
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

              {/* Send Method */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Send Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSendMethod("direct")}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sendMethod === "direct"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Send className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">Send Direct</span>
                  </button>
                  <button
                    onClick={() => setSendMethod("code")}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sendMethod === "code"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Copy className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">Generate Code</span>
                  </button>
                </div>
              </div>

              {/* Recipient Phone (only for direct) */}
              {sendMethod === "direct" && (
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
              )}

              {/* Mobile Money Provider */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Mobile Money Provider (optional)</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileMoneyProviders.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          {p.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                {sendMethod === "code" ? (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Generate Code — P{parsedAmount.toFixed(2)}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send P{parsedAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6 text-center">
              <div className="bg-muted rounded-2xl p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {sendMethod === "code" ? "Generating e-wallet code for" : "You are sending"}
                </p>
                <p className="text-4xl font-bold text-foreground">P{parsedAmount.toFixed(2)}</p>
                {sendMethod === "direct" && (
                  <>
                    <p className="text-sm text-muted-foreground">to</p>
                    <p className="text-xl font-semibold text-foreground">{phone}</p>
                  </>
                )}
                {provider && (
                  <p className="text-sm text-muted-foreground">
                    via {mobileMoneyProviders.find(p => p.id === provider)?.name}
                  </p>
                )}
                {reference && <p className="text-sm text-muted-foreground">Ref: {reference}</p>}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12" onClick={() => setStep("form")}>Back</Button>
                <Button className="flex-1 h-12" onClick={handleSend}>
                  {sendMethod === "code" ? "Generate Code" : "Confirm & Send"}
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-semibold text-foreground">
                {sendMethod === "code" ? "Generating Code..." : "Sending E-Wallet..."}
              </p>
              <p className="text-sm text-muted-foreground">Processing your transfer</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground">
                {sendMethod === "code" ? "E-Wallet Code Generated!" : "E-Wallet Sent!"}
              </p>
              <p className="text-muted-foreground text-center">
                P{parsedAmount.toFixed(2)} {sendMethod === "code" ? "code ready" : `sent to ${phone}`}
              </p>

              {sendMethod === "code" && generatedCode && (
                <div className="w-full space-y-3 mt-2">
                  <div className="bg-muted rounded-2xl p-5 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Cash-out Code</p>
                    <p className="text-2xl font-mono font-bold text-foreground tracking-wider">{generatedCode}</p>
                  </div>
                  <Button variant="outline" className="w-full h-12" onClick={copyCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Share this code with the recipient. They can cash out at any agent using this code.
                  </p>
                </div>
              )}

              <Button className="w-full h-12 mt-4" onClick={resetAndClose}>Done</Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileEWalletSheet;
