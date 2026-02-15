import { useCart } from "@/contexts/CartContext";
import { X, Plus, Minus, ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle, Trash2, QrCode, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Mobile Money Logos
import orangeMoneyLogo from "@/assets/mobile-money/orange-money.png";
import smegaLogo from "@/assets/mobile-money/smega.png";
import myzakaLogo from "@/assets/mobile-money/myzaka.png";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Step = "cart" | "payment" | "mobile-provider" | "qr-scan" | "payment-link-form" | "success";

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "smega", name: "Smega", logo: smegaLogo },
  { id: "myzaka", name: "MyZaka", logo: myzakaLogo },
];

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, isCartOpen, setIsCartOpen } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) return;
    setStep("payment");
  };

  const handlePayment = async (method: string) => {
    if (method === "mobile-money") { setStep("mobile-provider"); return; }
    if (method === "qr") { setStep("qr-scan"); return; }
    if (method === "payment-link") { setStep("payment-link-form"); return; }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setStep("success");
    toast({ title: "Order Placed!", description: `P${total.toFixed(2)} payment processed via ${method}` });
  };

  const handleQrPayment = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setStep("success");
    toast({ title: "Order Placed!", description: `P${total.toFixed(2)} via QR Payment` });
  };

  const handlePaymentLink = async () => {
    if (!customerPhone) {
      toast({ title: "Error", description: "Please enter customer phone", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsProcessing(false);
    setStep("success");
    toast({ title: "Link Sent!", description: `Payment link sent to ${customerPhone}` });
  };

  const handleMobilePayment = async () => {
    if (!selectedProvider || !customerPhone) {
      toast({ title: "Error", description: "Please select provider and enter phone", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setStep("success");
    toast({ title: "Order Placed!", description: `P${total.toFixed(2)} via Mobile Money` });
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === "success") {
      clearCart();
      setStep("cart");
      setSelectedProvider("");
      setCustomerPhone("");
    }
  };

  const resetToCart = () => {
    setStep("cart");
    setSelectedProvider("");
    setCustomerPhone("");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {step === "cart" && `Cart (${itemCount})`}
            {step === "payment" && "Payment Method"}
            {step === "mobile-provider" && "Mobile Money"}
            {step === "success" && "Order Confirmed"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mb-3 opacity-40" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 bg-muted rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-background" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                        <p className="text-primary font-bold text-sm">P{item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                            <Plus className="w-3 h-3 text-primary-foreground" />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground">P{total.toLocaleString()}</p>
              </div>
              <div className="space-y-3">
              {[
                  { method: "card", icon: CreditCard, label: "Card Payment", desc: "Visa, Mastercard", color: "bg-primary" },
                  { method: "cash", icon: Banknote, label: "Cash", desc: "Pay on delivery", color: "bg-green-500" },
                  { method: "mobile-money", icon: Smartphone, label: "Mobile Money", desc: "Orange, Smega, MyZaka", color: "bg-orange-500" },
                  { method: "qr", icon: QrCode, label: "QR Payment", desc: "Scan to pay", color: "bg-violet-500" },
                  { method: "payment-link", icon: Link2, label: "Payment Link", desc: "Send via SMS", color: "bg-purple-500" },
                ].map(({ method, icon: Icon, label, desc, color }) => (
                  <button key={method} onClick={() => handlePayment(method)} disabled={isProcessing}
                    className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-muted transition-colors">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "mobile-provider" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold text-foreground">P{total.toLocaleString()}</p>
              </div>
              <p className="font-semibold text-foreground">Select Provider</p>
              <div className="grid grid-cols-3 gap-3">
                {mobileMoneyProviders.map(p => (
                  <button key={p.id} onClick={() => setSelectedProvider(p.id)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center ${selectedProvider === p.id ? "border-primary bg-primary/10" : "border-border"}`}>
                    <img src={p.logo} alt={p.name} className="w-12 h-12 object-contain rounded-lg mb-1" />
                    <p className="text-xs font-medium">{p.name}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Phone Number</p>
                <Input type="tel" placeholder="+267 71 234 5678" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <Button onClick={handleMobilePayment} disabled={isProcessing || !selectedProvider || !customerPhone} className="w-full h-12">
                {isProcessing ? "Processing..." : "Send Payment Request"}
              </Button>
            </div>
          )}

          {step === "qr-scan" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold text-foreground">P{total.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-center py-6">
                <div className="w-40 h-40 bg-card border-2 border-border rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                  <QrCode className="w-20 h-20 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-center">Ask customer to scan the QR code to complete payment</p>
              </div>
              <Button onClick={handleQrPayment} disabled={isProcessing} className="w-full h-12">
                {isProcessing ? "Waiting for payment..." : "Confirm Payment Received"}
              </Button>
            </div>
          )}

          {step === "payment-link-form" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-3xl font-bold text-foreground">P{total.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Customer Phone Number</p>
                <Input type="tel" placeholder="+267 71 234 5678" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <p className="text-sm text-muted-foreground">A payment link will be sent via SMS to the customer's phone.</p>
              <Button onClick={handlePaymentLink} disabled={isProcessing || !customerPhone} className="w-full h-12">
                {isProcessing ? "Sending link..." : "Send Payment Link"}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Order Confirmed!</p>
              <p className="text-muted-foreground">P{total.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">{itemCount} items</p>
              <p className="text-xs text-muted-foreground mt-4">Free delivery across Botswana</p>
              <Button onClick={handleClose} className="mt-6 w-full">Done</Button>
            </div>
          )}
        </div>

        {step === "cart" && items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-foreground text-lg">P{total.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { clearCart(); }} className="flex-1">Clear</Button>
              <Button onClick={handleCheckout} className="flex-1">Checkout</Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="border-t border-border pt-4">
            <Button variant="outline" onClick={resetToCart} className="w-full">Back to Cart</Button>
          </div>
        )}

        {(step === "mobile-provider" || step === "qr-scan" || step === "payment-link-form") && (
          <div className="border-t border-border pt-4">
            <Button variant="outline" onClick={() => setStep("payment")} className="w-full">Back</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
