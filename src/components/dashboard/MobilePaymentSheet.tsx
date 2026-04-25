import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTransactions } from "@/hooks/useTransactions";
import PaymentFlow from "./PaymentFlow";

type PaymentType = "card-sale" | "cash" | "mobile-money";

interface MobilePaymentSheetProps {
  open: boolean;
  onClose: () => void;
  paymentType: PaymentType;
}

const paymentConfig: Record<PaymentType, { title: string; icon: React.ElementType; color: string }> = {
  "card-sale": { title: "Card Sale", icon: CreditCard, color: "bg-primary" },
  "cash": { title: "Cash Payment", icon: Banknote, color: "bg-green-500" },
  "mobile-money": { title: "Mobile Money", icon: Smartphone, color: "bg-orange-500" },
};

const MobilePaymentSheet = ({ open, onClose, paymentType }: MobilePaymentSheetProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const { addTransaction } = useTransactions();

  const config = paymentConfig[paymentType];
  const Icon = config.icon;
  const parsedAmount = parseFloat(amount) || 0;

  const handleStartPayment = () => {
    if (parsedAmount <= 0) return;
    setShowPaymentFlow(true);
  };

  const handlePaymentSuccess = async (method: string, total: number, desc?: string) => {
    const descParts = [config.title];
    if (description) descParts.push(description);
    if (desc) descParts.push(desc);

    await addTransaction({
      type: "sale",
      payment_method: method,
      amount: total,
      description: descParts.join(" • "),
      status: "completed",
    });
  };

  const resetAndClose = () => {
    setAmount("");
    setDescription("");
    setShowPaymentFlow(false);
    onClose();
  };

  // Map paymentType to auto-select in PaymentFlow
  const methodMap: Record<PaymentType, string> = {
    "card-sale": "card",
    "cash": "cash",
    "mobile-money": "mobile-money",
    "poso-money": "poso-money",
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()} dismissible={false}>
      <DrawerContent className="bg-background h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <DrawerTitle className="text-foreground">
                {showPaymentFlow ? "Payment" : config.title}
              </DrawerTitle>
            </div>
            <button onClick={resetAndClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {!showPaymentFlow ? (
            <div className="space-y-5">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Amount (P)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9.]*"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-3xl font-bold h-16 text-center"
                  autoFocus
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

              {/* Proceed button */}
              <button
                onClick={handleStartPayment}
                disabled={parsedAmount <= 0}
                className={`w-full h-14 rounded-2xl font-semibold text-lg transition-all active:scale-[0.97] ${
                  parsedAmount > 0
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Continue to Payment — P{parsedAmount.toFixed(2)}
              </button>
            </div>
          ) : (
            <PaymentFlow
              total={parsedAmount}
              itemCount={1}
              onComplete={resetAndClose}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setShowPaymentFlow(false)}
              initialMethod={methodMap[paymentType] as any}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentSheet;
