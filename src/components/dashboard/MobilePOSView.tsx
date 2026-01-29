import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Minus, 
  Search, 
  ShoppingCart, 
  Trash2,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  X,
  Coffee,
  Croissant,
  Apple,
  IceCream,
  Wine
} from "lucide-react";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";
import MobileProfileSheet from "./MobileProfileSheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobilePOSViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: React.ElementType;
}

interface CartItem extends Product {
  quantity: number;
}

const MobilePOSView = ({ profile, userEmail }: MobilePOSViewProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  const categories = ["All", "Beverages", "Food", "Bakery", "Snacks"];

  const products: Product[] = [
    { id: "1", name: "Cappuccino", price: 35, category: "Beverages", icon: Coffee },
    { id: "2", name: "Espresso", price: 28, category: "Beverages", icon: Coffee },
    { id: "3", name: "Latte", price: 38, category: "Beverages", icon: Coffee },
    { id: "4", name: "Fresh Juice", price: 45, category: "Beverages", icon: Wine },
    { id: "5", name: "Croissant", price: 25, category: "Bakery", icon: Croissant },
    { id: "6", name: "Muffin", price: 30, category: "Bakery", icon: Croissant },
    { id: "7", name: "Scone", price: 22, category: "Bakery", icon: Croissant },
    { id: "8", name: "Sandwich", price: 55, category: "Food", icon: Apple },
    { id: "9", name: "Avocado Toast", price: 65, category: "Food", icon: Apple },
    { id: "10", name: "Salad Bowl", price: 75, category: "Food", icon: Apple },
    { id: "11", name: "Ice Cream", price: 35, category: "Snacks", icon: IceCream },
    { id: "12", name: "Chips", price: 15, category: "Snacks", icon: Apple },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartQuantity = (productId: string) => {
    const item = cart.find(i => i.id === productId);
    return item?.quantity || 0;
  };

  const handlePayment = (method: string) => {
    // Here you would process the payment
    alert(`Processing P${cartTotal.toFixed(2)} payment via ${method}`);
    clearCart();
    setCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white"
          >
            {personalInitials}
          </button>
          <h1 className="font-semibold text-[#141414]">Point of Sale</h1>
          <Link 
            to="/dashboard/settings"
            className="px-3 py-1.5 bg-[#F5F5F5] rounded-full"
          >
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "One Guy Can"}
            </span>
          </Link>
        </div>

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
      </header>

      {/* Category Filter */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? "bg-[#141414] text-white" 
                  : "bg-white text-[#141414]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-5 pb-32">
        <div className="grid grid-cols-3 gap-3">
          {filteredProducts.map((product) => {
            const quantity = getCartQuantity(product.id);
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`bg-white rounded-2xl p-3 flex flex-col items-center text-center active:scale-95 transition-all relative ${
                  quantity > 0 ? "ring-2 ring-[#00C8E6]" : ""
                }`}
              >
                {quantity > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00C8E6] rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {quantity}
                  </div>
                )}
                <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-2">
                  <product.icon className="w-6 h-6 text-[#141414]/60" />
                </div>
                <p className="text-xs font-medium text-[#141414] mb-1 line-clamp-1">{product.name}</p>
                <p className="text-sm font-bold text-[#00C8E6]">P{product.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-5 z-30 md:hidden">
          <button
            onClick={() => setCheckoutOpen(true)}
            className="w-full bg-[#141414] text-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="font-medium">{cartCount} items</span>
            </div>
            <span className="text-xl font-bold">P{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Checkout Sheet */}
      <Sheet open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-5 py-4 border-b border-[#E8E8E8]">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Checkout</SheetTitle>
                <button 
                  onClick={clearCart}
                  className="text-red-500 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </SheetHeader>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-[#F5F5F5] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-[#141414]/60" />
                      </div>
                      <div>
                        <p className="font-medium text-[#141414]">{item.name}</p>
                        <p className="text-sm text-[#141414]/60">P{item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 bg-[#00C8E6] rounded-full flex items-center justify-center text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Payment Options */}
            <div className="border-t border-[#E8E8E8] px-5 py-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#141414]/60">Total</span>
                <span className="text-2xl font-bold text-[#141414]">P{cartTotal.toFixed(2)}</span>
              </div>

              <p className="text-sm text-[#141414]/60 mb-3">Select payment method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePayment("Card")}
                  className="bg-[#141414] text-white rounded-2xl p-4 flex flex-col items-center gap-2"
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  onClick={() => handlePayment("Cash")}
                  className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex flex-col items-center gap-2"
                >
                  <Banknote className="w-6 h-6 text-[#141414]" />
                  <span className="text-sm font-medium text-[#141414]">Cash</span>
                </button>
                <button
                  onClick={() => handlePayment("Orange Money")}
                  className="bg-[#FF6600] text-white rounded-2xl p-4 flex flex-col items-center gap-2"
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-medium">Orange Money</span>
                </button>
                <button
                  onClick={() => handlePayment("Mobile Money")}
                  className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex flex-col items-center gap-2"
                >
                  <Wallet className="w-6 h-6 text-[#141414]" />
                  <span className="text-sm font-medium text-[#141414]">MyZaka</span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile Sheet */}
      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        userEmail={userEmail}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobilePOSView;
