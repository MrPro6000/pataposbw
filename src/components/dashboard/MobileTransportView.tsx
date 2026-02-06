import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";
import { Bus, MapPin, ArrowRight, Plus, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

const MobileTransportView = () => {
  const [routes, setRoutes] = useState<Route[]>(defaultRoutes);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ from: "", to: "", fare: "", distance: "" });

  const handleAdd = () => {
    if (!formData.from || !formData.to || !formData.fare) return;
    setRoutes([...routes, {
      id: `RT${String(routes.length + 1).padStart(3, "0")}`,
      from: formData.from,
      to: formData.to,
      fare: parseFloat(formData.fare),
      distance: formData.distance || "—",
    }]);
    setFormData({ from: "", to: "", fare: "", distance: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Transport</h1>
            <p className="text-xs text-muted-foreground">Routes & Fares</p>
          </div>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Routes list */}
      <div className="p-4 space-y-3">
        {routes.map((route) => (
          <div key={route.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
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
          </div>
        ))}
      </div>

      {/* Add Route Sheet */}
      <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Add New Route</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} placeholder="e.g. Gaborone" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} placeholder="e.g. Francistown" />
            </div>
            <div className="space-y-2">
              <Label>Fare (P)</Label>
              <Input type="number" value={formData.fare} onChange={(e) => setFormData({ ...formData, fare: e.target.value })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Distance</Label>
              <Input value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} placeholder="e.g. 430 km" />
            </div>
            <Button onClick={handleAdd} className="w-full bg-primary text-primary-foreground">
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
