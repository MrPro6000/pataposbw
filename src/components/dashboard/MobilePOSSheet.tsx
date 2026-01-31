import { useState } from "react";
import { X, ShoppingBag, Plus, Minus, CreditCard, Banknote, Smartphone } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface MobilePOSSheetProps {
  open: boolean;
  onClose: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const MobilePOSSheet = ({ open, onClose }: MobilePOSSheetProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Mock products
  const products = [
    { id: "1", name: "Coffee", price: 35, category: "Beverages" },
    { id: "2", name: "Sandwich", price: 55, category: "Food" },
    { id: "3", name: "Muffin", price: 25, category: "Food" },
    { id: "4", name: "Juice", price: 20, category: "Beverages" },
    { id: "5", name: "Salad", price: 45, category: "Food" },
    { id: "6", name: "Water", price: 10, category: "Beverages" },
  ];

  const addToCart = (product: typeof products[0]) => {
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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (method: string) => {
    // TODO: Implement checkout logic
    console.log(`Checkout with ${method}`, cart);
    setCart([]);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold text-foreground">Point of Sale</DrawerTitle>
            <button onClick={onClose} className="p-2 -mr-2">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Products Grid */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Products</h3>
            <div className="grid grid-cols-3 gap-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-card border border-border rounded-xl p-3 text-left active:scale-95 transition-transform"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">P{product.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Cart ({itemCount} items)
              </h3>
              <div className="bg-card border border-border rounded-2xl divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">P{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="font-medium text-foreground w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Total & Payment Options */}
        {cart.length > 0 && (
          <div className="border-t border-border px-5 py-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">P{total.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => handleCheckout('card')}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Card</span>
              </Button>
              <Button 
                onClick={() => handleCheckout('cash')}
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button 
                onClick={() => handleCheckout('mobile')}
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs">Mobile</span>
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {cart.length === 0 && (
          <div className="px-5 pb-6 text-center">
            <p className="text-muted-foreground">Tap products above to add to cart</p>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePOSSheet;
