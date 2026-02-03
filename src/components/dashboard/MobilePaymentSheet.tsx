import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, Wallet, Link2, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

type PaymentType = "card-sale" | "payment-link" | "invoice" | "cash" | "mobile-money" | "wallet";

interface MobilePaymentSheetProps {
  open: boolean;
  onClose: () => void;
  paymentType: PaymentType;
}

const paymentConfig = {
  "card-sale": { title: "Card Sale", icon: CreditCard, color: "bg-primary" },
  "payment-link": { title: "Payment Link", icon: Link2, color: "bg-purple-500" },
  "invoice": { title: "New Invoice", icon: FileText, color: "bg-blue-500" },
  "cash": { title: "Cash Payment", icon: Banknote, color: "bg-green-500" },
  "mobile-money": { title: "Mobile Money", icon: Smartphone, color: "bg-orange-500" },
  "wallet": { title: "Wallet Payment", icon: Wallet, color: "bg-indigo-500" },
};

import orangeMoneyLogo from "@/assets/mobile-money/orange-money.png";
import smegaLogo from "@/assets/mobile-money/smega.png";
import myzakaLogo from "@/assets/mobile-money/myzaka.png";

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "smega", name: "Smega", logo: smegaLogo },
  { id: "myzaka", name: "MyZaka", logo: myzakaLogo },
];

const MobilePaymentSheet = ({ open, onClose, paymentType }: MobilePaymentSheetProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const config = paymentConfig[paymentType];
  const Icon = config.icon;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (paymentType === "mobile-money" && !selectedProvider) {
      toast({ title: "Error", description: "Please select a provider", variant: "destructive" });
      return;
    }

    if ((paymentType === "mobile-money" || paymentType === "payment-link") && !customerPhone) {
      toast({ title: "Error", description: "Please enter customer phone number", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    toast({
      title: "Payment Successful",
      description: `P${parseFloat(amount).toFixed(2)} ${config.title} completed`,
    });

    // Reset after showing success
    setTimeout(() => {
      setIsSuccess(false);
      setAmount("");
      setDescription("");
      setCustomerPhone("");
      setCustomerEmail("");
      setSelectedProvider("");
      onClose();
    }, 1500);
  };

  const resetAndClose = () => {
    setAmount("");
    setDescription("");
    setCustomerPhone("");
    setCustomerEmail("");
    setSelectedProvider("");
    setIsSuccess(false);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <DrawerTitle className="text-foreground">{config.title}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 space-y-5 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground">Payment Successful!</p>
              <p className="text-muted-foreground">P{parseFloat(amount).toFixed(2)}</p>
            </div>
          ) : (
            <>
              {/* Amount Input */}
              <div className="space-y-2">
                <Label className="text-foreground">Amount (P)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9.]*"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-bold h-14 text-center"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-foreground">Description (optional)</Label>
                <Input
                  placeholder="What is this payment for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Mobile Money Provider Selection */}
              {paymentType === "mobile-money" && (
                <div className="space-y-3">
                  <Label className="text-foreground">Select Provider</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {mobileMoneyProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${
                          selectedProvider === provider.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card"
                        }`}
                      >
                        <img 
                          src={provider.logo} 
                          alt={provider.name} 
                          className="w-12 h-12 object-contain mb-2 rounded-lg"
                        />
                        <p className="text-xs font-medium text-foreground text-center">{provider.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Phone for Mobile Money & Payment Link */}
              {(paymentType === "mobile-money" || paymentType === "payment-link") && (
                <div className="space-y-2">
                  <Label className="text-foreground">Customer Phone</Label>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+267 71 234 5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              )}

              {/* Customer Email for Invoice & Payment Link */}
              {(paymentType === "invoice" || paymentType === "payment-link") && (
                <div className="space-y-2">
                  <Label className="text-foreground">Customer Email</Label>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              )}

              {/* Card Sale Info */}
              {paymentType === "card-sale" && (
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the amount and tap your card machine to complete the transaction.
                  </p>
                </div>
              )}

              {/* Cash Sale Info */}
              {paymentType === "cash" && (
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    Record cash received from the customer.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full h-14 font-semibold text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  `Process ${config.title}`
                )}
              </Button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentSheet;
