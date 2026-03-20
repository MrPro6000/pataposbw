import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { X, Package, Plus, Minus, ShoppingCart, Search, Bus, Monitor, FileText, ArrowLeft, Zap, Droplets, Tv, Shield, Phone, Wifi, Copy, CheckCircle, Wallet, Smartphone, Loader2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";
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

interface MobileProductSaleSheetProps {
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
  let hash = 0;
  for (let i = 0; i < meterNumber.length; i++) {
    hash = ((hash << 5) - hash) + meterNumber.charCodeAt(i);
    hash |= 0;
  }
  const firstIdx = Math.abs(hash) % botswanaFirstNames.length;
  const lastIdx = Math.abs(hash >> 8) % botswanaSurnames.length;
  return `${botswanaFirstNames[firstIdx]} ${botswanaSurnames[lastIdx]}`;
};

// Payment sources for instant service checkout
const paymentSources = [
  { id: "wallet", label: "Wallet Balance", icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
  { id: "orange_money", label: "Orange Money", icon: Smartphone, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "myzaka", label: "MyZaka", icon: Smartphone, color: "text-blue-600", bg: "bg-blue-600/10" },
  { id: "smega", label: "Smega", icon: Smartphone, color: "text-green-600", bg: "bg-green-600/10" },
];

/** Inline payment source selector */
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

type Step = "products" | "transport-form" | "service-form" | "services-list" | "airtime-form" | "wifi-form" | "utility-form" | "council-form" | "electricity-form" | "electricity-token" | "service-processing" | "product-form" | "devices-list" | "cart" | "payment";

const MobileProductSaleSheet = ({ open, onClose }: MobileProductSaleSheetProps) => {
  const [step, setStep] = useState<Step>("products");
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

  // WiFi subscription state
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
  const [councilServiceOther, setCouncilServiceOther] = useState("");
  const [councilAmount, setCouncilAmount] = useState("");
  const [councilRef, setCouncilRef] = useState("");

  // Electricity form state (separate from utility)
  const [elecAmount, setElecAmount] = useState("");
  const [elecMeter, setElecMeter] = useState("");
  const [elecGeneratedName, setElecGeneratedName] = useState("");

  // Electricity token state
  const [electricityToken, setElectricityToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);

  // Service processing state
  const [processingLabel, setProcessingLabel] = useState("");
  const [processingDone, setProcessingDone] = useState(false);
  const [afterProcessingStep, setAfterProcessingStep] = useState<Step>("products");

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

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // ── Instant service payment helper ──
  const processServicePayment = async (description: string, amount: number, nextStep: Step) => {
    const sourceLabel = paymentSources.find(s => s.id === paymentSource)?.label || paymentSource;

    if (paymentSource === "wallet") {
      if (balance < amount) {
        toast.error("Insufficient wallet balance", { description: `Your balance is P${balance.toFixed(2)} but you need P${amount.toFixed(2)}` });
        return;
      }
    }

    setProcessingLabel(description);
    setProcessingDone(false);
    setAfterProcessingStep(nextStep);
    setStep("service-processing");

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
    setStep("products");
  };

  const handleAddService = () => {
    if (!serviceForm.serviceName || !serviceForm.amount) return;
    const id = `service-${Date.now()}`;
    addToCart({ id, name: `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`, price: parseFloat(serviceForm.amount), category: "Services" });
    setServiceForm({ serviceName: "", amount: "", customerName: "" });
    setStep("products");
  };

  const handlePayServiceNow = (description: string, amount: number) => {
    processServicePayment(description, amount, "products");
  };

  // ── Airtime ──
  const handleAddAirtime = () => {
    if (!airtimeProvider || !airtimeAmount) return;
    const provider = airtimeProviders.find(p => p.id === airtimeProvider);
    const id = `airtime-${Date.now()}`;
    const name = `Airtime — ${provider?.name}${airtimePhone ? ` (${airtimePhone})` : ""}`;
    addToCart({ id, name, price: parseFloat(airtimeAmount), category: "Services" });
    setAirtimeProvider(""); setAirtimeAmount(""); setAirtimePhone("");
    setStep("products");
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

  const handleAddWifi = () => {
    if (!wifiProvider || !wifiPackage) return;
    const provider = airtimeProviders.find(p => p.id === wifiProvider);
    const pkg = wifiPackages[wifiProvider]?.find(p => p.name === wifiPackage);
    if (!pkg) return;
    const id = `wifi-${Date.now()}`;
    const name = `WiFi — ${provider?.name} ${pkg.name}${wifiPhone ? ` (${wifiPhone})` : ""}`;
    addToCart({ id, name, price: pkg.price, category: "Services" });
    setWifiProvider(""); setWifiPackage(""); setWifiPhone("");
    setStep("products");
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

  // ── Utility (DSTV, Water, Insurance — NOT electricity) ──
  const handleAddUtility = () => {
    if (!activeUtility || !utilityAmount) return;
    const id = `utility-${Date.now()}`;
    const name = `${activeUtility.label}${utilityRef ? ` — Ref: ${utilityRef}` : ""}${utilityCustomer ? ` (${utilityCustomer})` : ""}`;
    addToCart({ id, name, price: parseFloat(utilityAmount), category: "Services" });
    setActiveUtility(null); setUtilityAmount(""); setUtilityRef(""); setUtilityCustomer("");
    setStep("products");
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
    const service = councilService === "Other" ? councilServiceOther : councilService;
    if (!council || !service || !councilAmount) return;
    const id = `council-${Date.now()}`;
    const name = `Council Payment — ${council} • ${service}${councilRef ? ` (Ref: ${councilRef})` : ""}`;
    addToCart({ id, name, price: parseFloat(councilAmount), category: "Services" });
    setSelectedCouncil(""); setCouncilOther(""); setCouncilService(""); setCouncilServiceOther(""); setCouncilAmount(""); setCouncilRef("");
    setStep("products");
  };

  const handlePayCouncilNow = () => {
    const council = selectedCouncil === "Other" ? councilOther : selectedCouncil;
    const service = councilService === "Other" ? councilServiceOther : councilService;
    if (!council || !service || !councilAmount) return;
    const desc = `Council Payment — ${council} • ${service}${councilRef ? ` (Ref: ${councilRef})` : ""}`;
    const amt = parseFloat(councilAmount);
    setSelectedCouncil(""); setCouncilOther(""); setCouncilService(""); setCouncilServiceOther(""); setCouncilAmount(""); setCouncilRef("");
    processServicePayment(desc, amt, "products");
  };

  // ── Electricity (pay first, then token) ──
  const handlePayElectricity = async () => {
    if (!elecAmount || !elecMeter) return;
    const amt = parseFloat(elecAmount);
    const generatedName = generateMeterCustomerName(elecMeter);
    const desc = `Electricity — Meter: ${elecMeter} (${generatedName})`;
    const sourceLabel = paymentSources.find(s => s.id === paymentSource)?.label || paymentSource;

    if (paymentSource === "wallet") {
      if (balance < amt) {
        toast.error("Insufficient wallet balance", { description: `Your balance is P${balance.toFixed(2)} but you need P${amt.toFixed(2)}` });
        return;
      }
    }

    setProcessingLabel(desc);
    setProcessingDone(false);
    setAfterProcessingStep("electricity-token");
    setStep("service-processing");

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
    setAirtimeProvider(""); setAirtimeAmount(""); setAirtimePhone("");
    setWifiProvider(""); setWifiPackage(""); setWifiPhone("");
    setActiveUtility(null); setUtilityAmount(""); setUtilityRef(""); setUtilityCustomer("");
    setSelectedCouncil(""); setCouncilOther(""); setCouncilService(""); setCouncilServiceOther(""); setCouncilAmount(""); setCouncilRef("");
    setElecAmount(""); setElecMeter(""); setElecGeneratedName("");
    setElectricityToken(""); setTokenCopied(false);
    setPaymentSource("wallet");
    onClose();
  };

  const getCartQty = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  const getStepTitle = () => {
    switch (step) {
      case "products": return "Select Products";
      case "transport-form": return "Add Transport";
      case "service-form": return "Add Service";
      case "services-list": return "Services";
      case "airtime-form": return "Buy Airtime";
      case "wifi-form": return "WiFi Subscription";
      case "utility-form": return activeUtility?.label ?? "Utility Payment";
      case "council-form": return "Council Payment";
      case "electricity-form": return "Buy Electricity";
      case "electricity-token": return "Electricity Token";
      case "service-processing": return "Processing...";
      case "product-form": return "Add Custom Product";
      case "devices-list": return "Pata Devices";
      case "cart": return "Your Cart";
      case "payment": return "Payment";
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()} dismissible={false}>
      <DrawerContent className="bg-background h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <DrawerTitle className="text-foreground">{getStepTitle()}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">
          {/* PRODUCTS */}
          {step === "products" && (
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-muted border-0 rounded-xl" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-foreground text-background" : "bg-muted text-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {showTransportTile && (
                  <button onClick={() => setStep("transport-form")} className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><Bus className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Transport</p>
                    <p className="text-xs text-muted-foreground">Enter fare details</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {showServiceTile && (
                  <button onClick={() => setStep("services-list")} className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><FileText className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Services</p>
                    <p className="text-xs text-muted-foreground">Airtime, DSTV & more</p>
                    <p className="text-xs text-primary font-semibold mt-1">View All</p>
                  </button>
                )}
                {showDevicesTile && (
                  <button onClick={() => setStep("devices-list")} className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><Monitor className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Pata Devices</p>
                    <p className="text-xs text-muted-foreground">All terminals & POS</p>
                    <p className="text-xs text-primary font-semibold mt-1">View All</p>
                  </button>
                )}
                {showProductTile && (
                  <button onClick={() => setStep("product-form")} className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><Plus className="w-5 h-5 text-primary" /></div>
                    <p className="font-medium text-foreground text-sm">Custom Product</p>
                    <p className="text-xs text-muted-foreground">Add any item</p>
                    <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                  </button>
                )}
                {filteredProducts.map(product => {
                  const qty = getCartQty(product.id);
                  return (
                    <button key={product.id} onClick={() => addToCart(product)}
                      className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mb-2">
                        {product.category === "Devices" ? <Monitor className="w-5 h-5 text-muted-foreground" /> : <Package className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <p className="font-medium text-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-foreground">P{product.price}</p>
                        {qty > 0 && <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">{qty}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SERVICES LIST */}
          {step === "services-list" && (
            <div className="p-4 space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("products")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="grid grid-cols-2 gap-3">
                {utilityServices.map(svc => {
                  const Icon = svc.icon;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => {
                        if (svc.id === "airtime") setStep("airtime-form");
                        else if (svc.id === "wifi") setStep("wifi-form");
                        else if (svc.id === "council") setStep("council-form");
                        else if (svc.id === "electricity") setStep("electricity-form");
                        else { setActiveUtility(svc); setStep("utility-form"); }
                      }}
                      className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border"
                    >
                      <div className={`w-10 h-10 ${svc.bg} rounded-xl flex items-center justify-center mb-2`}>
                        <Icon className={`w-5 h-5 ${svc.color}`} />
                      </div>
                      <p className="font-medium text-foreground text-sm">{svc.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">+ Add</p>
                    </button>
                  );
                })}
                <button onClick={() => setStep("service-form")} className="p-4 rounded-2xl text-left transition-all active:scale-95 bg-card border border-border">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><FileText className="w-5 h-5 text-primary" /></div>
                  <p className="font-medium text-foreground text-sm">Custom Service</p>
                  <p className="text-xs text-muted-foreground">Licence, levy, etc.</p>
                  <p className="text-xs text-primary font-semibold mt-1">+ Add</p>
                </button>
              </div>
            </div>
          )}

          {/* AIRTIME FORM */}
          {step === "airtime-form" && (
            <div className="p-4 space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("services-list")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="space-y-2">
                <Label>Select Provider *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {airtimeProviders.map(p => (
                    <button key={p.id} onClick={() => setAirtimeProvider(p.id)}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-all text-white ${p.color} ${airtimeProvider === p.id ? "ring-2 ring-offset-2 ring-foreground scale-95" : "opacity-80"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Airtime Amount (P) *</Label>
                <Input type="number" inputMode="numeric" value={airtimeAmount} onChange={e => setAirtimeAmount(e.target.value)} placeholder="e.g. 10.00" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number (optional)</Label>
                <Input type="tel" inputMode="numeric" value={airtimePhone} onChange={e => setAirtimePhone(e.target.value)} placeholder="e.g. 71234567" />
              </div>
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddAirtime} disabled={!airtimeProvider || !airtimeAmount} className="flex-1 h-12">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button onClick={handlePayAirtimeNow} disabled={!airtimeProvider || !airtimeAmount} className="flex-1 h-12">
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* WIFI FORM */}
          {step === "wifi-form" && (
            <div className="p-4 space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("services-list")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="space-y-2">
                <Label>Select Provider *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {airtimeProviders.map(p => (
                    <button key={p.id} onClick={() => { setWifiProvider(p.id); setWifiPackage(""); }}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-all text-white ${p.color} ${wifiProvider === p.id ? "ring-2 ring-offset-2 ring-foreground scale-95" : "opacity-80"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              {wifiProvider && (
                <div className="space-y-2">
                  <Label>Select Package *</Label>
                  <div className="space-y-2">
                    {wifiPackages[wifiProvider]?.map(pkg => (
                      <button key={pkg.name} onClick={() => setWifiPackage(pkg.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${wifiPackage === pkg.name ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                        <span className="font-medium text-foreground text-sm">{pkg.name}</span>
                        <span className="font-bold text-foreground">P{pkg.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Phone Number (optional)</Label>
                <Input type="tel" inputMode="numeric" value={wifiPhone} onChange={e => setWifiPhone(e.target.value)} placeholder="e.g. 71234567" />
              </div>
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddWifi} disabled={!wifiProvider || !wifiPackage} className="flex-1 h-12">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button onClick={handlePayWifiNow} disabled={!wifiProvider || !wifiPackage} className="flex-1 h-12">
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* UTILITY FORM (DSTV / Water / Insurance — NOT electricity) */}
          {step === "utility-form" && activeUtility && (
            <div className="p-4 space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("services-list")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 ${activeUtility.bg} rounded-xl flex items-center justify-center`}>
                  <activeUtility.icon className={`w-6 h-6 ${activeUtility.color}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{activeUtility.label}</p>
                  <p className="text-xs text-muted-foreground">Fill in the payment details</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (P) *</Label>
                <Input type="number" inputMode="numeric" value={utilityAmount} onChange={e => setUtilityAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Account / Reference No. (optional)</Label>
                <Input value={utilityRef} onChange={e => setUtilityRef(e.target.value)} placeholder="e.g. account or meter number" />
              </div>
              <div className="space-y-2">
                <Label>Customer Name (optional)</Label>
                <Input value={utilityCustomer} onChange={e => setUtilityCustomer(e.target.value)} placeholder="e.g. John Moeng" />
              </div>
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddUtility} disabled={!utilityAmount} className="flex-1 h-12">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button onClick={handlePayUtilityNow} disabled={!utilityAmount} className="flex-1 h-12">
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* ELECTRICITY FORM — pay first, then get token */}
          {step === "electricity-form" && (
            <div className="p-4 space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setStep("services-list")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Buy Electricity</p>
                  <p className="text-xs text-muted-foreground">Pay to receive your prepaid token</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount (P) *</Label>
                <Input type="number" inputMode="numeric" value={elecAmount} onChange={e => setElecAmount(e.target.value)} placeholder="e.g. 100.00" />
              </div>
              <div className="space-y-2">
                <Label>Meter Number *</Label>
                <Input value={elecMeter} onChange={e => setElecMeter(e.target.value)} placeholder="e.g. 04123456789" inputMode="numeric" />
              </div>
              {elecMeter.length >= 5 && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Registered to:</p>
                  <p className="text-sm font-semibold text-foreground">{generateMeterCustomerName(elecMeter)}</p>
                </div>
              )}
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <Button onClick={handlePayElectricity} disabled={!elecAmount || !elecMeter} className="w-full h-14 text-lg font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Pay P{elecAmount || "0"} & Get Token
              </Button>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground text-center">
                  🇧🇼 BPC Prepaid • Your 20-digit token will be generated after successful payment.
                </p>
              </div>
            </div>
          )}

          {/* COUNCIL PAYMENT FORM */}
          {step === "council-form" && (
            <div className="p-4 space-y-4 overflow-y-auto">
              <Button variant="ghost" size="sm" onClick={() => setStep("services-list")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Council Payment</p>
                  <p className="text-xs text-muted-foreground">Pay rates, levies, licences</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Council *</Label>
                <Select value={selectedCouncil} onValueChange={v => { setSelectedCouncil(v); if (v !== "Other") setCouncilOther(""); }}>
                  <SelectTrigger><SelectValue placeholder="Choose your council" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {botswanaCouncils.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                    <SelectItem value="Other">Other (type below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedCouncil === "Other" && (
                <div className="space-y-2">
                  <Label>Council Name *</Label>
                  <Input value={councilOther} onChange={e => setCouncilOther(e.target.value)} placeholder="Type your council name" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Service / Payment Type *</Label>
                <Select value={councilService} onValueChange={setCouncilService}>
                  <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rates">Rates</SelectItem>
                    <SelectItem value="Levy">Levy</SelectItem>
                    <SelectItem value="Licence Fee">Licence Fee</SelectItem>
                    <SelectItem value="Trading Licence">Trading Licence</SelectItem>
                    <SelectItem value="Building Permit">Building Permit</SelectItem>
                    <SelectItem value="Water Bill">Water Bill</SelectItem>
                    <SelectItem value="Refuse Collection">Refuse Collection</SelectItem>
                    <SelectItem value="Plot Rent">Plot Rent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {councilService === "Other" && (
                <div className="space-y-2">
                  <Label>Specify Service *</Label>
                  <Input value={councilServiceOther} onChange={e => setCouncilServiceOther(e.target.value)} placeholder="Type the service or payment type" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Amount (P) *</Label>
                <Input type="number" inputMode="numeric" value={councilAmount} onChange={e => setCouncilAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Reference Number (optional)</Label>
                <Input value={councilRef} onChange={e => setCouncilRef(e.target.value)} placeholder="e.g. account or reference number" />
              </div>
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddCouncilPayment}
                  disabled={!(selectedCouncil === "Other" ? councilOther : selectedCouncil) || !(councilService === "Other" ? councilServiceOther : councilService) || !councilAmount}
                  className="flex-1 h-12">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button onClick={handlePayCouncilNow}
                  disabled={!(selectedCouncil === "Other" ? councilOther : selectedCouncil) || !(councilService === "Other" ? councilServiceOther : councilService) || !councilAmount}
                  className="flex-1 h-12">
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* SERVICE PROCESSING ANIMATION */}
          {step === "service-processing" && (
            <div className="p-4 flex flex-col items-center justify-center py-16 space-y-6">
              {!processingDone ? (
                <>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-foreground">Processing Payment</p>
                    <p className="text-sm text-muted-foreground max-w-xs">{processingLabel}</p>
                    <p className="text-xs text-muted-foreground">Please wait...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-foreground">Payment Successful!</p>
                    <p className="text-sm text-muted-foreground max-w-xs">{processingLabel}</p>
                  </div>
                  <Button onClick={() => setStep(afterProcessingStep)} className="w-full h-12 mt-4">
                    {afterProcessingStep === "electricity-token" ? "View Your Token" : "Done"}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* ELECTRICITY TOKEN DISPLAY */}
          {step === "electricity-token" && (
            <div className="p-4 space-y-6">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-10 h-10 text-yellow-500" />
                </div>
                <p className="text-lg font-bold text-foreground">Electricity Token Generated</p>
                <p className="text-sm text-muted-foreground text-center">Enter this token into your prepaid meter to load electricity units.</p>
                
                {elecGeneratedName && (
                  <div className="w-full bg-card border border-border rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-semibold text-foreground">{elecGeneratedName}</p>
                  </div>
                )}

                <div className="w-full bg-muted border-2 border-yellow-500/30 rounded-2xl p-5 text-center">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Prepaid Token</p>
                  <p className="text-2xl font-mono font-bold text-foreground tracking-widest">{electricityToken}</p>
                </div>

                <Button variant="outline" onClick={handleCopyToken} className="w-full h-12 gap-2">
                  {tokenCopied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {tokenCopied ? "Copied!" : "Copy Token"}
                </Button>

                <div className="bg-card border border-border rounded-xl p-3 w-full">
                  <p className="text-xs text-muted-foreground text-center">
                    🇧🇼 BPC Prepaid • Keep this token safe. Enter all 20 digits into your meter.
                  </p>
                </div>
              </div>

              <Button onClick={() => setStep("products")} className="w-full h-12">
                Done
              </Button>
            </div>
          )}

          {step === "transport-form" && (
            <div className="p-4 space-y-4">
              <div className="space-y-2"><Label>Customer Name</Label><Input value={transportForm.customerName} onChange={e => setTransportForm({ ...transportForm, customerName: e.target.value })} placeholder="e.g. Keabetswe Moeng" /></div>
              <div className="space-y-2"><Label>From</Label><Input value={transportForm.from} onChange={e => setTransportForm({ ...transportForm, from: e.target.value })} placeholder="e.g. Gaborone" /></div>
              <div className="space-y-2"><Label>To (Destination)</Label><Input value={transportForm.to} onChange={e => setTransportForm({ ...transportForm, to: e.target.value })} placeholder="e.g. Francistown" /></div>
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={transportForm.vehicle} onValueChange={val => setTransportForm({ ...transportForm, vehicle: val })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>{vehicleTypes.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Fare Amount (P)</Label><Input type="number" inputMode="numeric" value={transportForm.fare} onChange={e => setTransportForm({ ...transportForm, fare: e.target.value })} placeholder="0.00" /></div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1 h-12">Cancel</Button>
                <Button onClick={handleAddTransport} disabled={!transportForm.customerName || !transportForm.to || !transportForm.fare} className="flex-1 h-12">Add to Cart</Button>
              </div>
            </div>
          )}

          {/* SERVICE FORM */}
          {step === "service-form" && (
            <div className="p-4 space-y-4">
              <div className="space-y-2"><Label>Service Name</Label><Input value={serviceForm.serviceName} onChange={e => setServiceForm({ ...serviceForm, serviceName: e.target.value })} placeholder="e.g. Licence Fee, Levy Payment" /></div>
              <div className="space-y-2"><Label>Customer Name (optional)</Label><Input value={serviceForm.customerName} onChange={e => setServiceForm({ ...serviceForm, customerName: e.target.value })} placeholder="e.g. Gaborone City Council" /></div>
              <div className="space-y-2"><Label>Amount (P)</Label><Input type="number" inputMode="numeric" value={serviceForm.amount} onChange={e => setServiceForm({ ...serviceForm, amount: e.target.value })} placeholder="0.00" /></div>
              <PaymentSourceSelector selected={paymentSource} onSelect={setPaymentSource} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddService} disabled={!serviceForm.serviceName || !serviceForm.amount} className="flex-1 h-12">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </Button>
                <Button onClick={() => {
                  if (!serviceForm.serviceName || !serviceForm.amount) return;
                  const desc = `${serviceForm.serviceName}${serviceForm.customerName ? ` — ${serviceForm.customerName}` : ""}`;
                  const amt = parseFloat(serviceForm.amount);
                  setServiceForm({ serviceName: "", amount: "", customerName: "" });
                  handlePayServiceNow(desc, amt);
                }} disabled={!serviceForm.serviceName || !serviceForm.amount} className="flex-1 h-12">
                  Pay Now
                </Button>
              </div>
            </div>
          )}

          {/* CUSTOM PRODUCT FORM */}
          {step === "product-form" && (
            <div className="p-4 space-y-4">
              <div className="space-y-2"><Label>Product Name</Label><Input value={productForm.productName} onChange={e => setProductForm({ ...productForm, productName: e.target.value })} placeholder="e.g. Phone Case, Charger" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Price (P)</Label><Input type="number" inputMode="numeric" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" /></div>
                <div className="space-y-2"><Label>Quantity</Label><Input type="number" inputMode="numeric" value={productForm.quantity} onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} placeholder="1" /></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("products")} className="flex-1 h-12">Cancel</Button>
                <Button onClick={handleAddProduct} disabled={!productForm.productName || !productForm.price} className="flex-1 h-12">Add to Cart</Button>
              </div>
            </div>
          )}

          {/* DEVICES LIST */}
          {step === "devices-list" && (
            <div className="p-4 space-y-3">
              <Button variant="ghost" size="sm" onClick={() => setStep("products")} className="mb-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
              </Button>
              <div className="grid grid-cols-2 gap-3">
                {allDeviceProducts.map(device => {
                  const qty = getCartQty(device.id);
                  return (
                    <button key={device.id} onClick={() => addToCart(device)}
                      className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${qty > 0 ? "bg-primary/10 border-2 border-primary" : "bg-card border border-border"}`}>
                      {device.image && (
                        <div className="w-full aspect-square bg-muted rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                          <img src={device.image} alt={device.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <p className="font-medium text-foreground text-sm">{device.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-foreground">P{device.price.toLocaleString()}</p>
                        {qty > 0 && <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">{qty}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CART */}
          {step === "cart" && (
            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="bg-muted rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">P{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 bg-background rounded-full flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                          <span className="font-bold text-foreground w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"><Plus className="w-4 h-4 text-primary-foreground" /></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                        <span className="font-bold text-foreground">P{(item.price * item.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-destructive text-sm font-medium">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENT FLOW */}
          {step === "payment" && (
            <div className="p-4">
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
                onBack={() => setStep("cart")}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "products" && cart.length > 0 && (
          <div className="p-4 border-t border-border bg-background">
            <Button onClick={() => setStep("cart")} className="w-full h-14 font-semibold text-lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({cartItemCount}) • P{cartTotal.toFixed(2)}
            </Button>
          </div>
        )}

        {step === "cart" && cart.length > 0 && (
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("products")} className="flex-1 h-12">Add More</Button>
              <Button onClick={() => setStep("payment")} className="flex-1 h-12 font-semibold">Checkout P{cartTotal.toFixed(2)}</Button>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileProductSaleSheet;
