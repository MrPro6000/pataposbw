import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import { Bus, MapPin, ArrowRight, Plus, ChevronLeft, User, CreditCard, Banknote, Smartphone, QrCode, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PataLogo from "@/components/PataLogo";
import orangeMoneyImg from "@/assets/mobile-money/orange-money.png";
import smegaImg from "@/assets/mobile-money/smega.png";
import myzakaImg from "@/assets/mobile-money/myzaka.png";

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", img: orangeMoneyImg },
  { id: "smega", name: "Smega", img: smegaImg },
  { id: "myzaka", name: "MyZaka", img: myzakaImg },
];

interface Route {
  id: string;
  from: string;
  to: string;
  fare: number;
  distance: string;
}

const defaultRoutes: Route[] = [
  { id: "RT001", from: "Gaborone", to: "Francistown", fare: 180.00, distance: "430 km" },
  { id: "RT002", from: "Gaborone", to: "Maun", fare: 250.00, distance: "950 km" },
  { id: "RT003", from: "Gaborone", to: "Kasane", fare: 320.00, distance: "960 km" },
  { id: "RT004", from: "Gaborone", to: "Palapye", fare: 100.00, distance: "270 km" },
  { id: "RT005", from: "Gaborone", to: "Serowe", fare: 120.00, distance: "330 km" },
  { id: "RT006", from: "Gaborone", to: "Kanye", fare: 30.00, distance: "75 km" },
  { id: "RT007", from: "Francistown", to: "Nata", fare: 80.00, distance: "190 km" },
  { id: "RT008", from: "Francistown", to: "Maun", fare: 180.00, distance: "520 km" },
  { id: "RT009", from: "Gaborone", to: "Lobatse", fare: 20.00, distance: "70 km" },
  { id: "RT010", from: "Gaborone", to: "Molepolole", fare: 25.00, distance: "50 km" },
];

const paymentMethods = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { id: "qr", label: "QR Payment", icon: QrCode },
];

const MobileTransportView = () => {
  const [routes] = useState<Route[]>(defaultRoutes);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [checkoutData, setCheckoutData] = useState({
    customerName: "",
    passengers: "1",
    paymentMethod: "",
    mobileMoneyProvider: "",
  });
  const [showProviderSelect, setShowProviderSelect] = useState(false);
  const [addForm, setAddForm] = useState({ from: "", to: "", fare: "", distance: "" });
  const [allRoutes, setAllRoutes] = useState<Route[]>(defaultRoutes);

  const handleSelectRoute = (route: Route) => {
    setSelectedRoute(route);
    setIsCheckoutOpen(true);
    setIsConfirmed(false);
    setCheckoutData({ customerName: "", passengers: "1", paymentMethod: "", mobileMoneyProvider: "" });
    setShowProviderSelect(false);
  };

  const totalAmount = selectedRoute
    ? selectedRoute.fare * parseInt(checkoutData.passengers || "1")
    : 0;

  const handleCheckout = () => {
    if (!checkoutData.customerName || !checkoutData.paymentMethod) return;
    if (checkoutData.paymentMethod === "mobile_money" && !checkoutData.mobileMoneyProvider) return;
    setIsConfirmed(true);
  };

  const handlePaymentMethodSelect = (id: string) => {
    if (id === "mobile_money") {
      setCheckoutData({ ...checkoutData, paymentMethod: id, mobileMoneyProvider: "" });
      setShowProviderSelect(true);
    } else {
      setCheckoutData({ ...checkoutData, paymentMethod: id, mobileMoneyProvider: "" });
      setShowProviderSelect(false);
    }
  };

  const handleAddRoute = () => {
    if (!addForm.from || !addForm.to || !addForm.fare) return;
    setAllRoutes([...allRoutes, {
      id: `RT${String(allRoutes.length + 1).padStart(3, "0")}`,
      from: addForm.from,
      to: addForm.to,
      fare: parseFloat(addForm.fare),
      distance: addForm.distance || "—",
    }]);
    setAddForm({ from: "", to: "", fare: "", distance: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Transport</h1>
            <p className="text-xs text-muted-foreground">Select a route to checkout</p>
          </div>
          <div className="flex items-center gap-2">
            <PataLogo className="h-5" />
            <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Route
            </Button>
          </div>
        </div>
      </div>

      {/* Routes list */}
      <div className="p-4 space-y-3">
        {allRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => handleSelectRoute(route)}
            className="w-full bg-card border border-border rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {route.from}
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  {route.to}
                </div>
                <p className="text-xs text-muted-foreground">{route.distance}</p>
              </div>
              <span className="text-lg font-bold text-foreground">P{route.fare.toFixed(2)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Checkout Sheet */}
      <Sheet open={isCheckoutOpen} onOpenChange={(open) => { setIsCheckoutOpen(open); if (!open) setIsConfirmed(false); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isConfirmed ? "Booking Confirmed" : "Checkout"}</SheetTitle>
          </SheetHeader>

          {isConfirmed ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Payment Successful</h3>
              <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                <p className="text-sm text-muted-foreground">Customer: <span className="text-foreground font-medium">{checkoutData.customerName}</span></p>
                <p className="text-sm text-muted-foreground">Route: <span className="text-foreground font-medium">{selectedRoute?.from} → {selectedRoute?.to}</span></p>
                <p className="text-sm text-muted-foreground">Passengers: <span className="text-foreground font-medium">{checkoutData.passengers}</span></p>
                <p className="text-sm text-muted-foreground">Payment: <span className="text-foreground font-medium capitalize">{checkoutData.paymentMethod.replace("_", " ")}</span></p>
                <p className="text-base font-bold text-foreground mt-2">Total: P{totalAmount.toFixed(2)}</p>
              </div>
              <Button onClick={() => { setIsCheckoutOpen(false); setIsConfirmed(false); }} className="w-full bg-primary text-primary-foreground">
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Route summary */}
              {selectedRoute && (
                <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
                  <Bus className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-xs text-muted-foreground">{selectedRoute.distance}</p>
                  </div>
                  <span className="font-bold text-foreground">P{selectedRoute.fare.toFixed(2)}</span>
                </div>
              )}

              {/* Customer name */}
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={checkoutData.customerName}
                    onChange={(e) => setCheckoutData({ ...checkoutData, customerName: e.target.value })}
                    placeholder="Enter passenger name"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label>Number of Passengers</Label>
                <Select value={checkoutData.passengers} onValueChange={(val) => setCheckoutData({ ...checkoutData, passengers: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} passenger{n > 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold text-foreground">P{totalAmount.toFixed(2)}</p>
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => handlePaymentMethodSelect(pm.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                        checkoutData.paymentMethod === pm.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      <pm.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Money Provider Selection */}
              {showProviderSelect && (
                <div className="space-y-2">
                  <Label>Select Provider</Label>
                  <div className="space-y-2">
                    {mobileMoneyProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setCheckoutData({ ...checkoutData, mobileMoneyProvider: provider.id })}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors active:scale-[0.98] ${
                          checkoutData.mobileMoneyProvider === provider.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card"
                        }`}
                      >
                        <img src={provider.img} alt={provider.name} className="w-8 h-8 rounded-lg object-contain" />
                        <span className="text-sm font-semibold text-foreground">{provider.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={!checkoutData.customerName || !checkoutData.paymentMethod || (checkoutData.paymentMethod === "mobile_money" && !checkoutData.mobileMoneyProvider)}
                className="w-full bg-primary text-primary-foreground"
              >
                Pay P{totalAmount.toFixed(2)}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Route Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Add New Route</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={addForm.from} onChange={(e) => setAddForm({ ...addForm, from: e.target.value })} placeholder="e.g. Gaborone" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={addForm.to} onChange={(e) => setAddForm({ ...addForm, to: e.target.value })} placeholder="e.g. Francistown" />
            </div>
            <div className="space-y-2">
              <Label>Fare (P)</Label>
              <Input type="number" inputMode="numeric" value={addForm.fare} onChange={(e) => setAddForm({ ...addForm, fare: e.target.value })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Distance</Label>
              <Input value={addForm.distance} onChange={(e) => setAddForm({ ...addForm, distance: e.target.value })} placeholder="e.g. 430 km" />
            </div>
            <Button onClick={handleAddRoute} className="w-full bg-primary text-primary-foreground">
              Add Route
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <MobileBottomNav />
    </div>
  );
};

export default MobileTransportView;
