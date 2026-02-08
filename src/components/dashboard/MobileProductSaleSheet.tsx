import { useState } from "react";
import { X, Package, Plus, Minus, ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle, Search, Bus, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

// Mobile Money Logos
import orangeMoneyLogo from "@/assets/mobile-money/orange-money.png";
import smegaLogo from "@/assets/mobile-money/smega.png";
import myzakaLogo from "@/assets/mobile-money/myzaka.png";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface MobileProductSaleSheetProps {
  open: boolean;
  onClose: () => void;
}

const products: Product[] = [
  // Retail
  { id: "1", name: "Meat", price: 85, category: "Food", stock: 50 },
  { id: "2", name: "Bread", price: 12, category: "Food", stock: 100 },
  { id: "3", name: "Milk", price: 18, category: "Food", stock: 80 },
  { id: "4", name: "Coke", price: 15, category: "Beverages", stock: 60 },
  { id: "5", name: "Sweets", price: 5, category: "Food", stock: 200 },
  { id: "6", name: "Cabbage", price: 10, category: "Food", stock: 30 },
  { id: "7", name: "Cigarette", price: 35, category: "General", stock: 40 },
  { id: "8", name: "Cappuccino", price: 35, category: "Beverages", stock: 50 },
  // Transport routes
  { id: "t1", name: "Gaborone → Tlokweng", price: 10, category: "Transport", stock: 999 },
  { id: "t2", name: "Gaborone → Mogoditshane", price: 8, category: "Transport", stock: 999 },
  { id: "t3", name: "Gaborone → Molepolole", price: 30, category: "Transport", stock: 999 },
  { id: "t4", name: "Gaborone → Francistown", price: 150, category: "Transport", stock: 999 },
  // Devices
  { id: "d1", name: "Go Pata Terminal", price: 880, category: "Devices", stock: 10 },
  { id: "d2", name: "Pata Pro Terminal", price: 3880, category: "Devices", stock: 5 },
  { id: "d3", name: "Pata Spaza POS", price: 9980, category: "Devices", stock: 3 },
  // Services
  { id: "s1", name: "Licence Fee", price: 250, category: "Services", stock: 999 },
  { id: "s2", name: "Levy Payment", price: 500, category: "Services", stock: 999 },
];

const categories = ["All", "Food", "Beverages", "General", "Transport", "Devices", "Services"];

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "smega", name: "Smega", logo: smegaLogo },
  { id: "myzaka", name: "MyZaka", logo: myzakaLogo },
];

type PaymentMethod = "card" | "cash" | "mobile-money";
type Step = "products" | "cart" | "payment" | "mobile-provider" | "success";

const MobileProductSaleSheet = ({ open, onClose }: MobileProductSaleSheetProps) => {
  const [step, setStep] = useState<Step>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === "mobile-money") {
      setStep("mobile-provider");
    } else {
      processPayment(method);
    }
  };

  const processPayment = async (method: PaymentMethod) => {
    if (method === "mobile-money" && !selectedProvider) {
      toast({ title: "Error", description: "Please select a provider", variant: "destructive" });
      return;
    }
    if (method === "mobile-money" && !customerPhone) {
      toast({ title: "Error", description: "Please enter phone number", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setStep("success");

    toast({
      title: "Payment Successful",
      description: `P${cartTotal.toFixed(2)} received via ${method === "mobile-money" ? selectedProvider : method}`,
    });
  };

  const resetAndClose = () => {
    setStep("products");
    setCart([]);
    setPaymentMethod(null);
    setSelectedProvider("");
    setCustomerPhone("");
    setSearchQuery("");
    setSelectedCategory("All");
    onClose();
  };

  const getCartItemQuantity = (productId: string) => {
    return cart.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <DrawerTitle className="text-foreground">
                {step === "products" && "Select Products"}
                {step === "cart" && "Your Cart"}
                {step === "payment" && "Payment Method"}
                {step === "mobile-provider" && "Mobile Money"}
                {step === "success" && "Success"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">
          {/* PRODUCTS STEP */}
          {step === "products" && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-0 rounded-xl"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => {
                  const qty = getCartItemQuantity(product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${
                        qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"
                      }`}
                    >
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mb-2">
                        {product.category === "Transport" ? <Bus className="w-5 h-5 text-muted-foreground" /> :
                         product.category === "Devices" ? <Monitor className="w-5 h-5 text-muted-foreground" /> :
                         <Package className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <p className="font-medium text-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-foreground">P{product.price}</p>
                        {qty > 0 && (
                          <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {qty}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CART STEP */}
          {step === "cart" && (
            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-muted rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">P{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-background rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-primary-foreground" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <span className="font-bold text-foreground">P{(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="p-4 space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-foreground">P{cartTotal.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{cartItemCount} items</p>
              </div>

              <p className="font-semibold text-foreground">Select Payment Method</p>

              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentSelect("card")}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Card Payment</p>
                    <p className="text-sm text-muted-foreground">Tap card on device</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentSelect("cash")}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Cash</p>
                    <p className="text-sm text-muted-foreground">Record cash payment</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentSelect("mobile-money")}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Mobile Money</p>
                    <p className="text-sm text-muted-foreground">Orange, Smega, MyZaka</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* MOBILE MONEY PROVIDER STEP */}
          {step === "mobile-provider" && (
            <div className="p-4 space-y-4">
              <div className="bg-muted rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-3xl font-bold text-foreground">P{cartTotal.toFixed(2)}</p>
              </div>

              <p className="font-semibold text-foreground">Select Provider</p>
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

              <div className="space-y-2">
                <p className="font-semibold text-foreground">Customer Phone</p>
                <Input
                  type="tel"
                  placeholder="+267 71 234 5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <Button
                onClick={() => processPayment("mobile-money")}
                disabled={isProcessing || !selectedProvider || !customerPhone}
                className="w-full h-14 font-semibold text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  `Send Payment Request`
                )}
              </Button>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
            <div className="p-4 flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Payment Successful!</p>
              <p className="text-muted-foreground mb-1">P{cartTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{cartItemCount} items sold</p>

              <Button
                onClick={resetAndClose}
                className="mt-6 w-full h-12"
              >
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Footer with Cart/Proceed Button */}
        {step === "products" && cart.length > 0 && (
          <div className="p-4 border-t border-border bg-background">
            <Button
              onClick={() => setStep("cart")}
              className="w-full h-14 font-semibold text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({cartItemCount}) • P{cartTotal.toFixed(2)}
            </Button>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("products")}
                className="flex-1 h-12"
              >
                Add More
              </Button>
              <Button
                onClick={() => setStep("payment")}
                className="flex-1 h-12 font-semibold"
              >
                Checkout P{cartTotal.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileProductSaleSheet;
