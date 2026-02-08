import { useState } from "react";
import { Package, Plus, Minus, ShoppingCart, CreditCard, Banknote, Smartphone, CheckCircle, Search, Bus, Monitor, Car, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import orangeMoneyLogo from "@/assets/mobile-money/orange-money.png";
import smegaLogo from "@/assets/mobile-money/smega.png";
import myzakaLogo from "@/assets/mobile-money/myzaka.png";

import pataPlatinumImg from "@/assets/devices/pata-platinum.jpeg";
import pataProImg from "@/assets/devices/pata-pro.jpeg";
import pataSpazaImg from "@/assets/devices/pata-spaza.jpeg";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface SellProductsDialogProps {
  open: boolean;
  onClose: () => void;
}

const retailProducts: Product[] = [
  { id: "meat", name: "Meat", price: 85, category: "Food" },
  { id: "bread", name: "Bread", price: 12, category: "Food" },
  { id: "milk", name: "Milk", price: 18, category: "Food" },
  { id: "coke", name: "Coke", price: 15, category: "Beverages" },
  { id: "sweets", name: "Sweets", price: 5, category: "Food" },
  { id: "cabbage", name: "Cabbage", price: 10, category: "Food" },
  { id: "cigarette", name: "Cigarette", price: 35, category: "General" },
  { id: "cappuccino", name: "Cappuccino", price: 35, category: "Beverages" },
];

const deviceProducts: Product[] = [
  { id: "go-pata", name: "Go Pata Terminal", price: 880, category: "Devices", image: pataPlatinumImg },
  { id: "pata-pro", name: "Pata Pro Terminal", price: 3880, category: "Devices", image: pataProImg },
  { id: "pata-spaza", name: "Pata Spaza POS", price: 9980, category: "Devices", image: pataSpazaImg },
];

const vehicleTypes = ["Combi", "Taxi", "Bus", "Sedan", "SUV", "Van"];

const categories = ["All", "Food", "Beverages", "General", "Transport", "Devices", "Services"];

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "smega", name: "Smega", logo: smegaLogo },
  { id: "myzaka", name: "MyZaka", logo: myzakaLogo },
];

type PaymentMethod = "card" | "cash" | "mobile-money";
type Step = "products" | "transport-form" | "service-form" | "cart" | "payment" | "mobile-provider" | "success";

const SellProductsDialog = ({ open, onClose }: SellProductsDialogProps) => {
  const [step, setStep] = useState<Step>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Transport form state
  const [transportForm, setTransportForm] = useState({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
  // Service form state
  const [serviceForm, setServiceForm] = useState({ serviceName: "", amount: "", customerName: "" });

  const allProducts = [...retailProducts, ...deviceProducts];
  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show product tiles for non-form categories, plus special tiles for Transport/Services
  const showTransportTile = selectedCategory === "All" || selectedCategory === "Transport";
  const showServiceTile = selectedCategory === "All" || selectedCategory === "Services";

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
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

  const handleAddTransport = () => {
    if (!transportForm.customerName || !transportForm.to || !transportForm.fare) return;
    const id = `transport-${Date.now()}`;
    const label = `${transportForm.from || "Pickup"} → ${transportForm.to}`;
    addToCart({
      id,
      name: `${label} (${transportForm.vehicle || "Vehicle"}) — ${transportForm.customerName}`,
      price: parseFloat(transportForm.fare),
      category: "Transport",
    });
    setTransportForm({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
    setStep("products");
  };

  const handleAddService = () => {
    if (!serviceForm.serviceName || !serviceForm.amount) return;
    const id = `service-${Date.now()}`;
    addToCart({
      id,
      name: `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`,
      price: parseFloat(serviceForm.amount),
      category: "Services",
    });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    setStep("products");
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    if (method === "mobile-money") {
      setStep("mobile-provider");
    } else {
      processPayment(method);
    }
  };

  const processPayment = async (method: PaymentMethod) => {
    if (method === "mobile-money" && (!selectedProvider || !customerPhone)) {
      toast({ title: "Error", description: "Please complete all fields", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setStep("success");
    toast({ title: "Payment Successful", description: `P${cartTotal.toFixed(2)} received` });
  };

  const resetAndClose = () => {
    setStep("products");
    setCart([]);
    setSelectedProvider("");
    setCustomerPhone("");
    setSearchQuery("");
    setSelectedCategory("All");
    setTransportForm({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    onClose();
  };

  const getCartQty = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Transport": return <Bus className="w-5 h-5 text-muted-foreground" />;
      case "Devices": return <Monitor className="w-5 h-5 text-muted-foreground" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            {step === "products" && "Sell Products"}
            {step === "transport-form" && "Add Transport Fare"}
            {step === "service-form" && "Add Custom Service"}
            {step === "cart" && `Cart (${cartItemCount})`}
            {step === "payment" && "Payment Method"}
            {step === "mobile-provider" && "Mobile Money"}
            {step === "success" && "Success"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* PRODUCTS STEP */}
          {step === "products" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search products, devices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-foreground text-background" : "bg-muted text-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Transport entry tile */}
                {showTransportTile && (
                  <button onClick={() => setStep("transport-form")}
                    className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <Bus className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm">Transport</p>
                    <p className="text-xs text-muted-foreground">Enter fare details</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {/* Service entry tile */}
                {showServiceTile && (
                  <button onClick={() => setStep("service-form")}
                    className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm">Custom Service</p>
                    <p className="text-xs text-muted-foreground">Licence, levy, etc.</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {/* Regular products */}
                {filteredProducts.map(product => {
                  const qty = getCartQty(product.id);
                  return (
                    <button key={product.id} onClick={() => addToCart(product)}
                      className={`p-3 rounded-xl text-left transition-all ${qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
                        {product.image ? <img src={product.image} alt="" className="w-6 h-6 object-contain" /> : getCategoryIcon(product.category)}
                      </div>
                      <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-bold text-foreground text-sm">P{product.price.toLocaleString()}</p>
                        {qty > 0 && <span className="w-5 h-5 bg-primary rounded-full text-xs font-bold text-primary-foreground flex items-center justify-center">{qty}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TRANSPORT FORM */}
          {step === "transport-form" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={transportForm.customerName} onChange={e => setTransportForm({ ...transportForm, customerName: e.target.value })} placeholder="e.g. Keabetswe Moeng" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input value={transportForm.from} onChange={e => setTransportForm({ ...transportForm, from: e.target.value })} placeholder="e.g. Gaborone" />
                </div>
                <div className="space-y-2">
                  <Label>To (Destination)</Label>
                  <Input value={transportForm.to} onChange={e => setTransportForm({ ...transportForm, to: e.target.value })} placeholder="e.g. Francistown" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={transportForm.vehicle} onValueChange={val => setTransportForm({ ...transportForm, vehicle: val })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fare Amount (P)</Label>
                <Input type="number" inputMode="numeric" value={transportForm.fare} onChange={e => setTransportForm({ ...transportForm, fare: e.target.value })} placeholder="0.00" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1">Cancel</Button>
                <Button onClick={handleAddTransport} disabled={!transportForm.customerName || !transportForm.to || !transportForm.fare} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            </div>
          )}

          {/* SERVICE FORM */}
          {step === "service-form" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} placeholder="e.g. Licence Fee, Levy Payment" />
              </div>
              <div className="space-y-2">
                <Label>Customer Name (optional)</Label>
                <Input value={serviceForm.customerName} onChange={e => setServiceForm({ ...serviceForm, customerName: e.target.value })} placeholder="e.g. Gaborone City Council" />
              </div>
              <div className="space-y-2">
                <Label>Amount (P)</Label>
                <Input type="number" inputMode="numeric" value={serviceForm.amount} onChange={e => setServiceForm({ ...serviceForm, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1">Cancel</Button>
                <Button onClick={handleAddService} disabled={!serviceForm.serviceName || !serviceForm.amount} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            </div>
          )}

          {/* CART */}
          {step === "cart" && (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-muted rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">P{item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-background flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <span className="font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"><Plus className="w-3 h-3 text-primary-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENT */}
          {step === "payment" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold text-foreground">P{cartTotal.toFixed(2)}</p>
              </div>
              {[
                { method: "card" as const, icon: CreditCard, label: "Card", color: "bg-primary" },
                { method: "cash" as const, icon: Banknote, label: "Cash", color: "bg-green-500" },
                { method: "mobile-money" as const, icon: Smartphone, label: "Mobile Money", color: "bg-orange-500" },
              ].map(({ method, icon: Icon, label, color }) => (
                <button key={method} onClick={() => handlePaymentSelect(method)}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-muted transition-colors">
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
                  <p className="font-semibold text-foreground">{label}</p>
                </button>
              ))}
            </div>
          )}

          {/* MOBILE MONEY */}
          {step === "mobile-provider" && (
            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-foreground">P{cartTotal.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mobileMoneyProviders.map(p => (
                  <button key={p.id} onClick={() => setSelectedProvider(p.id)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center ${selectedProvider === p.id ? "border-primary bg-primary/10" : "border-border"}`}>
                    <img src={p.logo} alt={p.name} className="w-12 h-12 object-contain rounded-lg mb-1" />
                    <p className="text-xs font-medium">{p.name}</p>
                  </button>
                ))}
              </div>
              <Input type="tel" placeholder="+267 71 234 5678" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              <Button onClick={() => processPayment("mobile-money")} disabled={isProcessing || !selectedProvider || !customerPhone} className="w-full">
                {isProcessing ? "Processing..." : "Send Payment Request"}
              </Button>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="flex flex-col items-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground">Payment Successful!</p>
              <p className="text-muted-foreground">P{cartTotal.toFixed(2)}</p>
              <Button onClick={resetAndClose} className="mt-6">Done</Button>
            </div>
          )}
        </div>

        {step === "products" && cart.length > 0 && (
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">P{cartTotal.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{cartItemCount} items</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("cart")}>View Cart</Button>
              <Button onClick={() => setStep("payment")}>Checkout</Button>
            </div>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <p className="font-bold text-lg text-foreground">P{cartTotal.toFixed(2)}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("products")}>Add More</Button>
              <Button onClick={() => setStep("payment")}>Checkout</Button>
            </div>
          </div>
        )}

        {(step === "payment" || step === "mobile-provider") && (
          <div className="border-t border-border pt-4">
            <Button variant="outline" onClick={() => setStep(step === "mobile-provider" ? "payment" : "cart")} className="w-full">Back</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SellProductsDialog;
