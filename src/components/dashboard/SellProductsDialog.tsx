import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Package, Plus, Minus, ShoppingCart, Search, Bus, Monitor, FileText, ArrowLeft, Zap, Droplets, Tv, Shield, Phone, Wifi, Copy, CheckCircle, Wallet, Smartphone, Loader2 } from "lucide-react";
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
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";

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

const allDeviceProducts: Product[] = Object.values(deviceModels).map(d => ({
  id: d.id,
  name: d.name,
  price: parseFloat(d.price.replace(/[^0-9.]/g, "").replace(",", "")),
  category: "Devices",
  image: d.image,
}));

const vehicleTypes = ["Combi", "Taxi", "Bus", "Sedan", "SUV", "Van"];
const baseCategories = ["All", "Transport", "Devices", "Services", "Custom"];

const utilityServices = [
  { id: "airtime", label: "Airtime", icon: Phone, color: "text-green-500", bg: "bg-green-500/10" },
  { id: "wifi", label: "WiFi", icon: Wifi, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: "dstv", label: "DSTV", icon: Tv, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "electricity", label: "Electricity", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "water", label: "Water Bill", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "insurance", label: "Insurance", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "council", label: "Council Payment", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-500/10" },
];

const airtimeProviders = [
  { id: "orange", name: "Orange", color: "bg-orange-500" },
  { id: "mascom", name: "Mascom", color: "bg-red-600" },
  { id: "btc", name: "BTC", color: "bg-blue-700" },
];

const botswanaCouncils = [
  "Gaborone City Council", "Francistown City Council", "Lobatse Town Council",
  "Selebi-Phikwe Town Council", "Jwaneng Town Council", "Sowa Town Council",
  "Orapa Town Council", "Central District Council", "Ghanzi District Council",
  "Kgalagadi District Council", "Kgatleng District Council", "Kweneng District Council",
  "North-East District Council", "North-West District Council", "South-East District Council",
  "Southern District Council", "Chobe District Council", "Maun Administrative Authority",
  "Kasane Township Authority", "Letlhakane Sub-District Council", "Bobonong Sub-District Council",
  "Tutume Sub-District Council", "Tonota Sub-District Council", "Serowe Sub-District Council",
  "Palapye Sub-District Council", "Mochudi Sub-District Council", "Molepolole Sub-District Council",
  "Kanye Sub-District Council", "Ramotswa Sub-District Council", "Mahalapye Sub-District Council",
  "Tlokweng Sub-District Council", "Mogoditshane Sub-District Council", "Goodhope Sub-District Council",
];

const generateElectricityToken = (): string => {
  let token = "";
  for (let i = 0; i < 20; i++) {
    token += Math.floor(Math.random() * 10).toString();
    if ((i + 1) % 4 === 0 && i < 19) token += " ";
  }
  return token;
};

// Botswana surnames for electricity meter name generation
const botswanaSurnames = [
  "Moeng", "Kgosidintsi", "Motswagole", "Seretse", "Mogae", "Masire", "Khama",
  "Tshekedi", "Bathoen", "Letsididi", "Molefe", "Kgathi", "Radipati", "Magang",
  "Mosweu", "Kepaletswe", "Mothibi", "Otsogile", "Gabathuse", "Letsholo",
  "Mabua", "Modise", "Mogorosi", "Mokgweetsi", "Sebina", "Tsheko", "Nkwe",
];
const botswanaFirstNames = [
  "Keabetswe", "Tumelo", "Boitumelo", "Kagiso", "Lethabo", "Neo", "Mpho",
  "Gorata", "Onalenna", "Kago", "Mothusi", "Lesego", "Tebogo", "Goitseone",
  "Phenyo", "Kealeboga", "Ofentse", "Bame", "Lorato", "Thato",
];

const generateMeterCustomerName = (meterNumber: string): string => {
  // Use meter number as seed for consistent name per meter
  let hash = 0;
  for (let i = 0; i < meterNumber.length; i++) {
    hash = ((hash << 5) - hash) + meterNumber.charCodeAt(i);
    hash |= 0;
  }
  const firstIdx = Math.abs(hash) % botswanaFirstNames.length;
  const lastIdx = Math.abs(hash >> 8) % botswanaSurnames.length;
  return `${botswanaFirstNames[firstIdx]} ${botswanaSurnames[lastIdx]}`;
};

const paymentSources = [
  { id: "wallet", label: "Wallet Balance", icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
  { id: "orange_money", label: "Orange Money", icon: Smartphone, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "myzaka", label: "MyZaka", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-600/10" },
  { id: "smega", label: "Smega", icon: Smartphone, color: "text-green-600", bg: "bg-green-600/10" },
  { id: "poso_money", label: "POSO Money", icon: Smartphone, color: "text-teal-600", bg: "bg-teal-600/10" },
];

const PaymentSourceSelector = ({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) => (
  <div className="space-y-2">
    <Label>Pay From *</Label>
    <div className="grid grid-cols-2 gap-2">
      {paymentSources.map(src => {
        const Icon = src.icon;
        return (
          <button
            key={src.id}
            onClick={() => onSelect(src.id)}
            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
              selected === src.id ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div className={`w-8 h-8 ${src.bg} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${src.color}`} />
            </div>
            <span className="text-sm font-medium text-foreground">{src.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const wifiPackages: Record<string, { name: string; price: number }[]> = {
  orange: [
    { name: "Daily 1GB", price: 10 }, { name: "Weekly 5GB", price: 45 },
    { name: "Monthly 20GB", price: 150 }, { name: "Monthly 50GB", price: 300 },
  ],
  mascom: [
    { name: "Daily 1GB", price: 12 }, { name: "Weekly 5GB", price: 50 },
    { name: "Monthly 20GB", price: 160 }, { name: "Monthly 50GB", price: 320 },
  ],
  btc: [
    { name: "Daily 1GB", price: 10 }, { name: "Weekly 5GB", price: 40 },
    { name: "Monthly 20GB", price: 140 }, { name: "Monthly 50GB", price: 280 },
  ],
};

type SubView = "products" | "transport-form" | "service-form" | "services-list" | "airtime-form" | "wifi-form" | "utility-form" | "council-form" | "electricity-form" | "electricity-token" | "service-processing" | "product-form" | "devices-list" | "payment";

const SellProductsDialog = ({ open, onClose }: SellProductsDialogProps) => {
  const [subView, setSubView] = useState<SubView>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addTransaction, balance } = useTransactions();
  const { products: dbProducts } = useProducts();
  const [transportForm, setTransportForm] = useState({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
  const [serviceForm, setServiceForm] = useState({ serviceName: "", amount: "", customerName: "" });
  const [productForm, setProductForm] = useState({ productName: "", price: "", quantity: "1" });

  // Payment source for instant service payments
  const [paymentSource, setPaymentSource] = useState("wallet");

  // Airtime state
  const [airtimeProvider, setAirtimeProvider] = useState("");
  const [airtimeAmount, setAirtimeAmount] = useState("");
  const [airtimePhone, setAirtimePhone] = useState("");

  // WiFi state
  const [wifiProvider, setWifiProvider] = useState("");
  const [wifiPackage, setWifiPackage] = useState("");
  const [wifiPhone, setWifiPhone] = useState("");

  // Utility (DSTV, Water, Insurance) state
  const [activeUtility, setActiveUtility] = useState<typeof utilityServices[0] | null>(null);
  const [utilityAmount, setUtilityAmount] = useState("");
  const [utilityRef, setUtilityRef] = useState("");
  const [utilityCustomer, setUtilityCustomer] = useState("");

  // Council payment state
  const [selectedCouncil, setSelectedCouncil] = useState("");
  const [councilOther, setCouncilOther] = useState("");
  const [councilService, setCouncilService] = useState("");
  const [councilAmount, setCouncilAmount] = useState("");
  const [councilRef, setCouncilRef] = useState("");

  // Electricity form state
  const [elecAmount, setElecAmount] = useState("");
  const [elecMeter, setElecMeter] = useState("");
  const [elecGeneratedName, setElecGeneratedName] = useState("");

  // Electricity token state
  const [electricityToken, setElectricityToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);

  // Service processing state
  const [processingLabel, setProcessingLabel] = useState("");
  const [processingDone, setProcessingDone] = useState(false);
  const [afterProcessingStep, setAfterProcessingStep] = useState<SubView>("products");

  const retailProducts: Product[] = dbProducts.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category }));
  const categories = [...baseCategories, ...Array.from(new Set(dbProducts.map(p => p.category))).filter(c => !baseCategories.includes(c))];

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

  // ── Instant service payment helper ──
  const processServicePayment = async (description: string, amount: number, nextStep: SubView) => {
    const sourceLabel = paymentSources.find(s => s.id === paymentSource)?.label || paymentSource;

    // If paying from wallet, check balance
    if (paymentSource === "wallet") {
      if (balance < amount) {
        toast.error("Insufficient wallet balance", { description: `Your balance is P${balance.toFixed(2)} but you need P${amount.toFixed(2)}` });
        return;
      }
    }

    setProcessingLabel(description);
    setProcessingDone(false);
    setAfterProcessingStep(nextStep);
    setSubView("service-processing");

    // Wallet = deduction (negative), other methods = income (positive)
    const txAmount = paymentSource === "wallet" ? -amount : amount;

    await addTransaction({
      type: paymentSource === "wallet" ? "purchase" : "sale",
      payment_method: paymentSource === "wallet" ? "wallet" : "mobile_money",
      amount: txAmount,
      description: `${description} • ${sourceLabel}`,
      status: "completed",
    });

    setTimeout(() => setProcessingDone(true), 2000);
  };

  const handleAddTransport = () => {
    if (!transportForm.customerName || !transportForm.to || !transportForm.fare) return;
    const id = `transport-${Date.now()}`;
    const label = `${transportForm.from || "Pickup"} → ${transportForm.to}`;
    addToCart({ id, name: `${label} (${transportForm.vehicle || "Vehicle"}) — ${transportForm.customerName}`, price: parseFloat(transportForm.fare), category: "Transport" });
    setTransportForm({ customerName: "", from: "", to: "", fare: "", vehicle: "" });
    setSubView("products");
  };

  const handleAddService = () => {
    if (!serviceForm.serviceName || !serviceForm.amount) return;
    const id = `service-${Date.now()}`;
    addToCart({ id, name: `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`, price: parseFloat(serviceForm.amount), category: "Services" });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    setSubView("products");
  };

  // ── Airtime ──
  const handleAddAirtime = () => {
    if (!airtimeProvider || !airtimeAmount) return;
    const provider = airtimeProviders.find(p => p.id === airtimeProvider);
    const id = `airtime-${Date.now()}`;
    const name = `Airtime — ${provider?.name}${airtimePhone ? ` (${airtimePhone})` : ""}`;
    addToCart({ id, name, price: parseFloat(airtimeAmount), category: "Services" });
    setAirtimeProvider(""); setAirtimeAmount(""); setAirtimePhone("");
    setSubView("products");
  };

  const handlePayAirtimeNow = () => {
    if (!airtimeProvider || !airtimeAmount) return;
    const provider = airtimeProviders.find(p => p.id === airtimeProvider);
    const desc = `Airtime — ${provider?.name}${airtimePhone ? ` (${airtimePhone})` : ""}`;
    const amt = parseFloat(airtimeAmount);
    setAirtimeProvider(""); setAirtimeAmount(""); setAirtimePhone("");
    processServicePayment(desc, amt, "products");
  };

  // ── WiFi ──
  const handleAddWifi = () => {
    if (!wifiProvider || !wifiPackage) return;
    const provider = airtimeProviders.find(p => p.id === wifiProvider);
    const pkg = wifiPackages[wifiProvider]?.find(p => p.name === wifiPackage);
    if (!pkg) return;
    const id = `wifi-${Date.now()}`;
    const name = `WiFi — ${provider?.name} ${pkg.name}${wifiPhone ? ` (${wifiPhone})` : ""}`;
    addToCart({ id, name, price: pkg.price, category: "Services" });
    setWifiProvider(""); setWifiPackage(""); setWifiPhone("");
    setSubView("products");
  };

  const handlePayWifiNow = () => {
    if (!wifiProvider || !wifiPackage) return;
    const provider = airtimeProviders.find(p => p.id === wifiProvider);
    const pkg = wifiPackages[wifiProvider]?.find(p => p.name === wifiPackage);
    if (!pkg) return;
    const desc = `WiFi — ${provider?.name} ${pkg.name}${wifiPhone ? ` (${wifiPhone})` : ""}`;
    setWifiProvider(""); setWifiPackage(""); setWifiPhone("");
    processServicePayment(desc, pkg.price, "products");
  };

  // ── Utility (DSTV, Water, Insurance) ──
  const handleAddUtility = () => {
    if (!activeUtility || !utilityAmount) return;
    const id = `utility-${Date.now()}`;
    const name = `${activeUtility.label}${utilityRef ? ` — Ref: ${utilityRef}` : ""}${utilityCustomer ? ` (${utilityCustomer})` : ""}`;
    addToCart({ id, name, price: parseFloat(utilityAmount), category: "Services" });
    setActiveUtility(null); setUtilityAmount(""); setUtilityRef(""); setUtilityCustomer("");
    setSubView("products");
  };

  const handlePayUtilityNow = () => {
    if (!activeUtility || !utilityAmount) return;
    const desc = `${activeUtility.label}${utilityRef ? ` — Ref: ${utilityRef}` : ""}${utilityCustomer ? ` (${utilityCustomer})` : ""}`;
    const amt = parseFloat(utilityAmount);
    setActiveUtility(null); setUtilityAmount(""); setUtilityRef(""); setUtilityCustomer("");
    processServicePayment(desc, amt, "products");
  };

  // ── Council ──
  const handleAddCouncilPayment = () => {
    const council = selectedCouncil === "Other" ? councilOther : selectedCouncil;
    if (!council || !councilService || !councilAmount) return;
    const id = `council-${Date.now()}`;
    const name = `Council Payment — ${council} • ${councilService}${councilRef ? ` (Ref: ${councilRef})` : ""}`;
    addToCart({ id, name, price: parseFloat(councilAmount), category: "Services" });
    setSelectedCouncil(""); setCouncilOther(""); setCouncilService(""); setCouncilAmount(""); setCouncilRef("");
    setSubView("products");
  };

  const handlePayCouncilNow = () => {
    const council = selectedCouncil === "Other" ? councilOther : selectedCouncil;
    if (!council || !councilService || !councilAmount) return;
    const desc = `Council Payment — ${council} • ${councilService}${councilRef ? ` (Ref: ${councilRef})` : ""}`;
    const amt = parseFloat(councilAmount);
    setSelectedCouncil(""); setCouncilOther(""); setCouncilService(""); setCouncilAmount(""); setCouncilRef("");
    processServicePayment(desc, amt, "products");
  };

  // ── Electricity (pay first, then token) ──
  const handlePayElectricity = async () => {
    if (!elecAmount || !elecMeter) return;
    const amt = parseFloat(elecAmount);
    const generatedName = generateMeterCustomerName(elecMeter);
    const desc = `Electricity — Meter: ${elecMeter} (${generatedName})`;
    const sourceLabel = paymentSources.find(s => s.id === paymentSource)?.label || paymentSource;

    // If paying from wallet, check balance
    if (paymentSource === "wallet") {
      if (balance < amt) {
        toast.error("Insufficient wallet balance", { description: `Your balance is P${balance.toFixed(2)} but you need P${amt.toFixed(2)}` });
        return;
      }
    }

    setProcessingLabel(desc);
    setProcessingDone(false);
    setAfterProcessingStep("electricity-token");
    setSubView("service-processing");

    const txAmount = paymentSource === "wallet" ? -amt : amt;

    await addTransaction({
      type: paymentSource === "wallet" ? "purchase" : "sale",
      payment_method: paymentSource === "wallet" ? "wallet" : "mobile_money",
      amount: txAmount,
      description: `${desc} • ${sourceLabel}`,
      status: "completed",
    });

    const token = generateElectricityToken();
    setElectricityToken(token);
    setElecGeneratedName(generatedName);
    setTokenCopied(false);
    setElecAmount(""); setElecMeter("");

    setTimeout(() => setProcessingDone(true), 2500);
  };

  const handleCopyToken = useCallback(() => {
    navigator.clipboard.writeText(electricityToken.replace(/\s/g, ""));
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  }, [electricityToken]);

  const handleAddProduct = () => {
    if (!productForm.productName || !productForm.price) return;
    const id = `product-${Date.now()}`;
    const qty = parseInt(productForm.quantity) || 1;
    const product: Product = { id, name: productForm.productName, price: parseFloat(productForm.price), category: "Custom" };
    setCart(prev => [...prev, { ...product, quantity: qty }]);
    setProductForm({ productName: "", price: "", quantity: "1" });
    setSubView("products");
  };

  const resetAndClose = () => {
    setSubView("products");
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

  // Payment view
  if (subView === "payment") {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              Payment
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <PaymentFlow
              total={cartTotal}
              itemCount={cartItemCount}
              onComplete={resetAndClose}
              onPaymentSuccess={async (method, totalAmount) => {
                const itemNames = cart.map(i => i.quantity > 1 ? `${i.name} x${i.quantity}` : i.name).join(", ");
                const methodLabel = method === "mobile_money" ? "Mobile Money" : method === "payment_link" ? "Payment Link" : method.charAt(0).toUpperCase() + method.slice(1);
                await addTransaction({
                  type: "sale",
                  payment_method: method,
                  amount: totalAmount,
                  description: `${itemNames} • ${methodLabel}`,
                  status: "completed",
                });
              }}
              onBack={() => setSubView("products")}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Service processing view
  if (subView === "service-processing") {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            {!processingDone ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold text-foreground mb-1">Processing Payment</p>
                <p className="text-sm text-muted-foreground text-center">{processingLabel}</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Payment Successful</p>
                <p className="text-sm text-muted-foreground text-center mb-6">{processingLabel}</p>
                <Button onClick={() => setSubView(afterProcessingStep)} className="w-full">
                  {afterProcessingStep === "electricity-token" ? "View Token" : "Done"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Electricity token view
  if (subView === "electricity-token") {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              Electricity Token
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {elecGeneratedName && (
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="text-sm font-semibold text-foreground">{elecGeneratedName}</p>
              </div>
            )}
            <div className="bg-muted rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your prepaid token</p>
              <p className="text-2xl font-mono font-bold text-foreground tracking-widest">{electricityToken}</p>
            </div>
            <Button onClick={handleCopyToken} variant="outline" className="w-full">
              {tokenCopied ? <><CheckCircle className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Token</>}
            </Button>
            <Button onClick={() => setSubView("products")} className="w-full">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            Sell Products
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* LEFT: Product selection */}
          <div className="flex-1 overflow-y-auto pr-2">
            {subView === "products" && (
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
                    <button onClick={() => setSubView("transport-form")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Bus className="w-5 h-5 text-primary" /></div>
                      <p className="font-medium text-foreground text-sm">Transport</p>
                      <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                    </button>
                  )}
                  {showServiceTile && (
                    <button onClick={() => setSubView("services-list")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><FileText className="w-5 h-5 text-primary" /></div>
                      <p className="font-medium text-foreground text-sm">Services</p>
                      <p className="text-xs text-primary font-semibold mt-1">View All</p>
                    </button>
                  )}
                  {showDevicesTile && (
                    <button onClick={() => setSubView("devices-list")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Monitor className="w-5 h-5 text-primary" /></div>
                      <p className="font-medium text-foreground text-sm">Pata Devices</p>
                      <p className="text-xs text-primary font-semibold mt-1">View All</p>
                    </button>
                  )}
                  {showProductTile && (
                    <button onClick={() => setSubView("product-form")} className="p-3 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-2"><Plus className="w-5 h-5 text-primary" /></div>
                      <p className="font-medium text-foreground text-sm">Custom Product</p>
                      <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                    </button>
                  )}
                  {filteredProducts.map(product => {
                    const qty = getCartQty(product.id);
                    return (
                      <button key={product.id} onClick={() => addToCart(product)}
                        className={`p-3 rounded-xl text-left transition-all ${qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mb-2">
                          {getCategoryIcon(product.category)}
                        </div>
                        <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
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

            {/* Services List */}
            {subView === "services-list" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("products")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Services</h3>
                <div className="grid grid-cols-3 gap-3">
                  {utilityServices.map(svc => {
                    const Icon = svc.icon;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => {
                          if (svc.id === "airtime") setSubView("airtime-form");
                          else if (svc.id === "wifi") setSubView("wifi-form");
                          else if (svc.id === "electricity") setSubView("electricity-form");
                          else if (svc.id === "council") setSubView("council-form");
                          else { setActiveUtility(svc); setSubView("utility-form"); }
                        }}
                        className="p-4 rounded-xl text-left transition-all bg-card border border-border hover:border-primary"
                      >
                        <div className={`w-10 h-10 ${svc.bg} rounded-lg flex items-center justify-center mb-2`}>
                          <Icon className={`w-5 h-5 ${svc.color}`} />
                        </div>
                        <p className="font-medium text-foreground text-sm">{svc.label}</p>
                      </button>
                    );
                  })}
                  {/* Custom Service tile */}
                  <button onClick={() => setSubView("service-form")} className="p-4 rounded-xl text-left transition-all bg-card border border-border hover:border-primary">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-2">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground text-sm">Custom</p>
                  </button>
                </div>
              </div>
            )}

            {/* Airtime Form */}
            {subView === "airtime-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("services-list")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Buy Airtime</h3>
                <div className="space-y-2">
                  <Label>Provider *</Label>
                  <Select value={airtimeProvider} onValueChange={setAirtimeProvider}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>{airtimeProviders.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Phone Number</Label><Input value={airtimePhone} onChange={e => setAirtimePhone(e.target.value)} placeholder="e.g. 71234567" /></div>
                <div className="space-y-2"><Label>Amount (P) *</Label><Input type="number" value={airtimeAmount} onChange={e => setAirtimeAmount(e.target.value)} placeholder="0.00" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleAddAirtime} disabled={!airtimeProvider || !airtimeAmount}>Add to Cart</Button>
                  <Button onClick={handlePayAirtimeNow} disabled={!airtimeProvider || !airtimeAmount}>Pay Now</Button>
                </div>
              </div>
            )}

            {/* WiFi Form */}
            {subView === "wifi-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("services-list")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Buy WiFi</h3>
                <div className="space-y-2">
                  <Label>Provider *</Label>
                  <Select value={wifiProvider} onValueChange={v => { setWifiProvider(v); setWifiPackage(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>{airtimeProviders.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {wifiProvider && (
                  <div className="space-y-2">
                    <Label>Package *</Label>
                    <Select value={wifiPackage} onValueChange={setWifiPackage}>
                      <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                      <SelectContent>{wifiPackages[wifiProvider]?.map(p => <SelectItem key={p.name} value={p.name}>{p.name} — P{p.price}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2"><Label>Phone Number</Label><Input value={wifiPhone} onChange={e => setWifiPhone(e.target.value)} placeholder="e.g. 71234567" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleAddWifi} disabled={!wifiProvider || !wifiPackage}>Add to Cart</Button>
                  <Button onClick={handlePayWifiNow} disabled={!wifiProvider || !wifiPackage}>Pay Now</Button>
                </div>
              </div>
            )}

            {/* Utility Form (DSTV, Water, Insurance) */}
            {subView === "utility-form" && activeUtility && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => { setSubView("services-list"); setActiveUtility(null); }}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">{activeUtility.label}</h3>
                <div className="space-y-2"><Label>Reference / Account Number</Label><Input value={utilityRef} onChange={e => setUtilityRef(e.target.value)} placeholder="e.g. Account number" /></div>
                <div className="space-y-2"><Label>Customer Name</Label><Input value={utilityCustomer} onChange={e => setUtilityCustomer(e.target.value)} placeholder="e.g. John Doe" /></div>
                <div className="space-y-2"><Label>Amount (P) *</Label><Input type="number" value={utilityAmount} onChange={e => setUtilityAmount(e.target.value)} placeholder="0.00" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleAddUtility} disabled={!utilityAmount}>Add to Cart</Button>
                  <Button onClick={handlePayUtilityNow} disabled={!utilityAmount}>Pay Now</Button>
                </div>
              </div>
            )}

            {/* Council Payment Form */}
            {subView === "council-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("services-list")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Council Payment</h3>
                <div className="space-y-2">
                  <Label>Council *</Label>
                  <Select value={selectedCouncil} onValueChange={v => { setSelectedCouncil(v); if (v !== "Other") setCouncilOther(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select council" /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {botswanaCouncils.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedCouncil === "Other" && (
                  <div className="space-y-2"><Label>Council Name *</Label><Input value={councilOther} onChange={e => setCouncilOther(e.target.value)} placeholder="Enter council name" /></div>
                )}
                <div className="space-y-2"><Label>Service / Purpose *</Label><Input value={councilService} onChange={e => setCouncilService(e.target.value)} placeholder="e.g. Rates, Licence Fee" /></div>
                <div className="space-y-2"><Label>Reference Number</Label><Input value={councilRef} onChange={e => setCouncilRef(e.target.value)} placeholder="e.g. Account/Ref" /></div>
                <div className="space-y-2"><Label>Amount (P) *</Label><Input type="number" value={councilAmount} onChange={e => setCouncilAmount(e.target.value)} placeholder="0.00" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleAddCouncilPayment} disabled={!(selectedCouncil === "Other" ? councilOther : selectedCouncil) || !councilService || !councilAmount}>Add to Cart</Button>
                  <Button onClick={handlePayCouncilNow} disabled={!(selectedCouncil === "Other" ? councilOther : selectedCouncil) || !councilService || !councilAmount}>Pay Now</Button>
                </div>
              </div>
            )}

            {/* Electricity Form */}
            {subView === "electricity-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("services-list")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Buy Electricity</h3>
                <div className="space-y-2"><Label>Meter Number *</Label><Input value={elecMeter} onChange={e => setElecMeter(e.target.value)} placeholder="e.g. 04123456789" /></div>
                {elecMeter.length >= 5 && (
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">Registered to:</p>
                    <p className="text-sm font-semibold text-foreground">{generateMeterCustomerName(elecMeter)}</p>
                  </div>
                )}
                <div className="space-y-2"><Label>Amount (P) *</Label><Input type="number" value={elecAmount} onChange={e => setElecAmount(e.target.value)} placeholder="0.00" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <Button onClick={handlePayElectricity} disabled={!elecAmount || !elecMeter} className="w-full">Pay Now</Button>
                <p className="text-xs text-muted-foreground text-center">Token will be generated after successful payment</p>
              </div>
            )}

            {subView === "transport-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("products")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <div className="space-y-2"><Label>Customer Name</Label><Input value={transportForm.customerName} onChange={e => setTransportForm({ ...transportForm, customerName: e.target.value })} placeholder="e.g. Keabetswe Moeng" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>From</Label><Input value={transportForm.from} onChange={e => setTransportForm({ ...transportForm, from: e.target.value })} placeholder="e.g. Gaborone" /></div>
                  <div className="space-y-2"><Label>To</Label><Input value={transportForm.to} onChange={e => setTransportForm({ ...transportForm, to: e.target.value })} placeholder="e.g. Francistown" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={transportForm.vehicle} onValueChange={val => setTransportForm({ ...transportForm, vehicle: val })}>
                    <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>{vehicleTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Fare (P)</Label><Input type="number" inputMode="numeric" value={transportForm.fare} onChange={e => setTransportForm({ ...transportForm, fare: e.target.value })} placeholder="0.00" /></div>
                <Button onClick={handleAddTransport} disabled={!transportForm.customerName || !transportForm.to || !transportForm.fare} className="w-full">Add to Cart</Button>
              </div>
            )}

            {subView === "service-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("services-list")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <h3 className="font-semibold text-foreground">Custom Service</h3>
                <div className="space-y-2"><Label>Service Name *</Label><Input value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} placeholder="e.g. Licence Fee" /></div>
                <div className="space-y-2"><Label>Customer (optional)</Label><Input value={serviceForm.customerName} onChange={e => setServiceForm({ ...serviceForm, customerName: e.target.value })} placeholder="e.g. Council" /></div>
                <div className="space-y-2"><Label>Amount (P) *</Label><Input type="number" inputMode="numeric" value={serviceForm.amount} onChange={e => setServiceForm({ ...serviceForm, amount: e.target.value })} placeholder="0.00" /></div>
                <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleAddService} disabled={!serviceForm.serviceName || !serviceForm.amount}>Add to Cart</Button>
                  <Button onClick={() => {
                    if (!serviceForm.serviceName || !serviceForm.amount) return;
                    const desc = `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`;
                    const amt = parseFloat(serviceForm.amount);
                    setServiceForm({ serviceName: "", amount: "", customerName: "" });
                    processServicePayment(desc, amt, "products");
                  }} disabled={!serviceForm.serviceName || !serviceForm.amount}>Pay Now</Button>
                </div>
              </div>
            )}

            {subView === "product-form" && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setSubView("products")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                <div className="space-y-2"><Label>Product Name</Label><Input value={productForm.productName} onChange={e => setProductForm({ ...productForm, productName: e.target.value })} placeholder="e.g. Phone Case" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Price (P)</Label><Input type="number" inputMode="numeric" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" /></div>
                  <div className="space-y-2"><Label>Quantity</Label><Input type="number" inputMode="numeric" value={productForm.quantity} onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} placeholder="1" /></div>
                </div>
                <Button onClick={handleAddProduct} disabled={!productForm.productName || !productForm.price} className="w-full">Add to Cart</Button>
              </div>
            )}

            {subView === "devices-list" && (
              <div className="space-y-3">
                <Button variant="ghost" size="sm" onClick={() => setSubView("products")}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
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
          </div>

          {/* RIGHT: Cart & Total */}
          <div className="w-80 flex-shrink-0 border-l border-border pl-6 flex flex-col overflow-hidden">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartItemCount})
            </h3>

            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Select products to add</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-muted rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground text-sm truncate flex-1 mr-2">{item.name}</p>
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-xs text-destructive hover:underline">×</button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-background flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Plus className="w-3 h-3 text-primary-foreground" /></button>
                        </div>
                        <p className="font-bold text-foreground text-sm">P{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold text-foreground">P{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-foreground">P{cartTotal.toFixed(2)}</span>
                  </div>
                  <Button onClick={() => setSubView("payment")} className="w-full h-12 font-semibold">
                    Checkout • P{cartTotal.toFixed(2)}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellProductsDialog;
