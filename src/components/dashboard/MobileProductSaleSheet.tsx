import { useState } from "react";
import { X, Package, Plus, Minus, ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle, Search } from "lucide-react";
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
  { id: "1", name: "Cappuccino", price: 35, category: "Beverages", stock: 50 },
  { id: "2", name: "Espresso", price: 28, category: "Beverages", stock: 45 },
  { id: "3", name: "Avocado Toast", price: 65, category: "Food", stock: 8 },
  { id: "4", name: "Croissant", price: 25, category: "Bakery", stock: 20 },
  { id: "5", name: "Fresh Juice", price: 45, category: "Beverages", stock: 20 },
  { id: "6", name: "Sandwich", price: 55, category: "Food", stock: 12 },
  { id: "7", name: "Muffin", price: 30, category: "Bakery", stock: 15 },
  { id: "8", name: "Latte", price: 38, category: "Beverages", stock: 40 },
];

const categories = ["All", "Beverages", "Food", "Bakery"];

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", color: "bg-orange-500" },
  { id: "smega", name: "Smega", color: "bg-blue-600" },
  { id: "myzaka", name: "MyZaka", color: "bg-green-600" },
  { id: "mascom", name: "Mascom MyZaka", color: "bg-yellow-500" },
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
      <DrawerContent className="bg-white max-h-[95vh]">
        <DrawerHeader className="border-b border-[#E8E8E8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <DrawerTitle className="text-[#141414]">
                {step === "products" && "Select Products"}
                {step === "cart" && "Your Cart"}
                {step === "payment" && "Payment Method"}
                {step === "mobile-provider" && "Mobile Money"}
                {step === "success" && "Success"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X className="w-4 h-4 text-[#141414]" />
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/40" />
                <Input 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#F5F5F5] border-0 rounded-xl"
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
                        ? "bg-[#141414] text-white"
                        : "bg-[#F5F5F5] text-[#141414]"
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
                        qty > 0 ? "bg-[#00C8E6]/10 border-2 border-[#00C8E6]" : "bg-white border border-[#E8E8E8]"
                      }`}
                    >
                      <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-2">
                        <Package className="w-5 h-5 text-[#141414]/40" />
                      </div>
                      <p className="font-medium text-[#141414] text-sm">{product.name}</p>
                      <p className="text-xs text-[#141414]/60">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-[#141414]">P{product.price}</p>
                        {qty > 0 && (
                          <span className="w-6 h-6 bg-[#00C8E6] rounded-full flex items-center justify-center text-xs font-bold text-white">
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
                  <ShoppingCart className="w-12 h-12 text-[#141414]/20 mx-auto mb-3" />
                  <p className="text-[#141414]/60">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-[#F5F5F5] rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-[#141414]">{item.name}</p>
                          <p className="text-sm text-[#141414]/60">P{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-[#141414] w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 bg-[#00C8E6] rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E0E0E0]">
                        <span className="font-bold text-[#141414]">P{(item.price * item.quantity).toFixed(2)}</span>
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
              <div className="bg-[#F5F5F5] rounded-2xl p-4 text-center">
                <p className="text-sm text-[#141414]/60">Total Amount</p>
                <p className="text-3xl font-bold text-[#141414]">P{cartTotal.toFixed(2)}</p>
                <p className="text-sm text-[#141414]/60">{cartItemCount} items</p>
              </div>

              <p className="font-semibold text-[#141414]">Select Payment Method</p>

              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentSelect("card")}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-[#E8E8E8] rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-[#00C8E6] rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#141414]">Card Payment</p>
                    <p className="text-sm text-[#141414]/60">Tap card on device</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentSelect("cash")}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-[#E8E8E8] rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#141414]">Cash</p>
                    <p className="text-sm text-[#141414]/60">Record cash payment</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentSelect("mobile-money")}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-[#E8E8E8] rounded-2xl active:scale-98 transition-transform"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#141414]">Mobile Money</p>
                    <p className="text-sm text-[#141414]/60">Orange, Smega, MyZaka</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* MOBILE MONEY PROVIDER STEP */}
          {step === "mobile-provider" && (
            <div className="p-4 space-y-4">
              <div className="bg-[#F5F5F5] rounded-2xl p-4 text-center">
                <p className="text-sm text-[#141414]/60">Amount to Pay</p>
                <p className="text-3xl font-bold text-[#141414]">P{cartTotal.toFixed(2)}</p>
              </div>

              <p className="font-semibold text-[#141414]">Select Provider</p>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoneyProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedProvider === provider.id
                        ? "border-[#00C8E6] bg-[#00C8E6]/10"
                        : "border-[#E8E8E8] bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 ${provider.color} rounded-lg mb-2`} />
                    <p className="text-sm font-medium text-[#141414]">{provider.name}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-[#141414]">Customer Phone</p>
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
                className="w-full h-14 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-[#141414] border-t-transparent rounded-full" />
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
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-[#141414] mb-2">Payment Successful!</p>
              <p className="text-[#141414]/60 mb-1">P{cartTotal.toFixed(2)}</p>
              <p className="text-sm text-[#141414]/40">{cartItemCount} items sold</p>

              <Button
                onClick={resetAndClose}
                className="mt-6 w-full h-12 bg-[#141414] text-white"
              >
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Footer with Cart/Proceed Button */}
        {step === "products" && cart.length > 0 && (
          <div className="p-4 border-t border-[#E8E8E8] bg-white">
            <Button
              onClick={() => setStep("cart")}
              className="w-full h-14 bg-[#141414] text-white font-semibold"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({cartItemCount}) • P{cartTotal.toFixed(2)}
            </Button>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="p-4 border-t border-[#E8E8E8] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#141414]/60">Total</span>
              <span className="text-xl font-bold text-[#141414]">P{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setStep("products")}
                variant="outline"
                className="flex-1 h-12"
              >
                Add More
              </Button>
              <Button
                onClick={() => setStep("payment")}
                className="flex-1 h-12 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileProductSaleSheet;
