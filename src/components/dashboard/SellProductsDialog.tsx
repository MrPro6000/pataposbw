import { useState } from "react";
import { Package, Plus, Minus, ShoppingCart, Search, Bus, Monitor, FileText, ArrowLeft } from "lucide-react";
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
import PaymentFlow from "./PaymentFlow";
import { deviceModels } from "@/data/devices";

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

const allDeviceProducts: Product[] = Object.values(deviceModels).map(d => ({
  id: d.id,
  name: d.name,
  price: parseFloat(d.price.replace(/[^0-9.]/g, "").replace(",", "")),
  category: "Devices",
  image: d.image,
}));

const vehicleTypes = ["Combi", "Taxi", "Bus", "Sedan", "SUV", "Van"];
const categories = ["All", "Food", "Beverages", "General", "Transport", "Devices", "Services", "Custom"];

type Step = "products" | "transport-form" | "service-form" | "product-form" | "devices-list" | "cart" | "payment";

const SellProductsDialog = ({ open, onClose }: SellProductsDialogProps) => {
  const [step, setStep] = useState<Step>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [transportForm, setTransportForm] = useState({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
  const [serviceForm, setServiceForm] = useState({ serviceName: "", amount: "", customerName: "" });
  const [productForm, setProductForm] = useState({ productName: "", price: "", quantity: "1" });

  const filteredProducts = retailProducts.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showTransportTile = selectedCategory === "All" || selectedCategory === "Transport";
  const showServiceTile = selectedCategory === "All" || selectedCategory === "Services";
  const showDevicesTile = selectedCategory === "All" || selectedCategory === "Devices";
  const showProductTile = selectedCategory === "All" || selectedCategory === "Custom";

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
    addToCart({ id, name: `${label} (${transportForm.vehicle || "Vehicle"}) — ${transportForm.customerName}`, price: parseFloat(transportForm.fare), category: "Transport" });
    setTransportForm({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
    setStep("products");
  };

  const handleAddService = () => {
    if (!serviceForm.serviceName || !serviceForm.amount) return;
    const id = `service-${Date.now()}`;
    addToCart({ id, name: `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`, price: parseFloat(serviceForm.amount), category: "Services" });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    setStep("products");
  };

  const handleAddProduct = () => {
    if (!productForm.productName || !productForm.price) return;
    const id = `product-${Date.now()}`;
    const qty = parseInt(productForm.quantity) || 1;
    const product: Product = { id, name: productForm.productName, price: parseFloat(productForm.price), category: "Custom" };
    setCart(prev => [...prev, { ...product, quantity: qty }]);
    setProductForm({ productName: "", price: "", quantity: "1" });
    setStep("products");
  };

  const resetAndClose = () => {
    setStep("products");
    setCart([]);
    setSearchQuery("");
    setSelectedCategory("All");
    setTransportForm({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    setProductForm({ productName: "", price: "", quantity: "1" });
    onClose();
  };

  const getCartQty = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Devices": return <Monitor className="w-5 h-5 text-muted-foreground" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "products": return "Sell Products";
      case "transport-form": return "Add Transport Fare";
      case "service-form": return "Add Custom Service";
      case "product-form": return "Add Custom Product";
      case "devices-list": return "Pata Devices";
      case "cart": return `Cart (${cartItemCount})`;
      case "payment": return "Payment";
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
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* PRODUCTS */}
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
                {showTransportTile && (
                  <button onClick={() => setStep("transport-form")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Bus className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Transport</p>
                    <p className="text-xs text-muted-foreground">Enter fare details</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {showServiceTile && (
                  <button onClick={() => setStep("service-form")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><FileText className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Custom Service</p>
                    <p className="text-xs text-muted-foreground">Licence, levy, etc.</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {showDevicesTile && (
                  <button onClick={() => setStep("devices-list")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Monitor className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Pata Devices</p>
                    <p className="text-xs text-muted-foreground">All terminals & POS</p>
                    <p className="text-xs text-primary font-semibold mt-1">View All</p>
                  </button>
                )}
                {showProductTile && (
                  <button onClick={() => setStep("product-form")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Plus className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Custom Product</p>
                    <p className="text-xs text-muted-foreground">Add any item</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
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
              <div className="space-y-2"><Label>Customer Name</Label><Input value={transportForm.customerName} onChange={e => setTransportForm({ ...transportForm, customerName: e.target.value })} placeholder="e.g. Keabetswe Moeng" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>From</Label><Input value={transportForm.from} onChange={e => setTransportForm({ ...transportForm, from: e.target.value })} placeholder="e.g. Gaborone" /></div>
                <div className="space-y-2"><Label>To (Destination)</Label><Input value={transportForm.to} onChange={e => setTransportForm({ ...transportForm, to: e.target.value })} placeholder="e.g. Francistown" /></div>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={transportForm.vehicle} onValueChange={val => setTransportForm({ ...transportForm, vehicle: val })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>{vehicleTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Fare Amount (P)</Label><Input type="number" inputMode="numeric" value={transportForm.fare} onChange={e => setTransportForm({ ...transportForm, fare: e.target.value })} placeholder="0.00" /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1">Cancel</Button>
                <Button onClick={handleAddTransport} disabled={!transportForm.customerName || !transportForm.to || !transportForm.fare} className="flex-1">Add to Cart</Button>
              </div>
            </div>
          )}

          {/* SERVICE FORM */}
          {step === "service-form" && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Service Name</Label><Input value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} placeholder="e.g. Licence Fee, Levy Payment" /></div>
              <div className="space-y-2"><Label>Customer Name (optional)</Label><Input value={serviceForm.customerName} onChange={e => setServiceForm({ ...serviceForm, customerName: e.target.value })} placeholder="e.g. Gaborone City Council" /></div>
              <div className="space-y-2"><Label>Amount (P)</Label><Input type="number" inputMode="numeric" value={serviceForm.amount} onChange={e => setServiceForm({ ...serviceForm, amount: e.target.value })} placeholder="0.00" /></div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1">Cancel</Button>
                <Button onClick={handleAddService} disabled={!serviceForm.serviceName || !serviceForm.amount} className="flex-1">Add to Cart</Button>
              </div>
            </div>
          )}

          {/* CUSTOM PRODUCT FORM */}
          {step === "product-form" && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Product Name</Label><Input value={productForm.productName} onChange={e => setProductForm({ ...productForm, productName: e.target.value })} placeholder="e.g. Phone Case, Charger" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Price (P)</Label><Input type="number" inputMode="numeric" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" /></div>
                <div className="space-y-2"><Label>Quantity</Label><Input type="number" inputMode="numeric" value={productForm.quantity} onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} placeholder="1" /></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1">Cancel</Button>
                <Button onClick={handleAddProduct} disabled={!productForm.productName || !productForm.price} className="flex-1">Add to Cart</Button>
              </div>
            </div>
          )}

          {/* DEVICES LIST */}
          {step === "devices-list" && (
            <div className="space-y-3">
              <Button variant="ghost" size="sm" onClick={() => setStep("products")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
              </Button>
              <div className="grid grid-cols-2 gap-3">
                {allDeviceProducts.map(device => {
                  const qty = getCartQty(device.id);
                  return (
                    <button key={device.id} onClick={() => addToCart(device)}
                      className={`p-3 rounded-xl text-left transition-all ${qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                      {device.image && (
                        <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                          <img src={device.image} alt={device.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <p className="font-medium text-foreground text-sm">{device.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-bold text-foreground text-sm">P{device.price.toLocaleString()}</p>
                        {qty > 0 && <span className="w-5 h-5 bg-primary rounded-full text-xs font-bold text-primary-foreground flex items-center justify-center">{qty}</span>}
                      </div>
                    </button>
                  );
                })}
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

          {/* PAYMENT FLOW */}
          {step === "payment" && (
            <PaymentFlow
              total={cartTotal}
              itemCount={cartItemCount}
              onComplete={resetAndClose}
              onBack={() => setStep("cart")}
            />
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
      </DialogContent>
    </Dialog>
  );
};

export default SellProductsDialog;
