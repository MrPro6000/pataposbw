import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileTransportView from "@/components/dashboard/MobileTransportView";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bus, MapPin, ArrowRight, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

interface Route {
  id: string;
  from: string;
  to: string;
  fare: number;
  distance: string;
  status: "active" | "inactive";
}

const initialRoutes: Route[] = [
  { id: "RT001", from: "Gaborone", to: "Francistown", fare: 180.0, distance: "430 km", status: "active" },
  { id: "RT002", from: "Gaborone", to: "Maun", fare: 250.0, distance: "950 km", status: "active" },
  { id: "RT003", from: "Gaborone", to: "Kasane", fare: 320.0, distance: "960 km", status: "active" },
  { id: "RT004", from: "Gaborone", to: "Palapye", fare: 100.0, distance: "270 km", status: "active" },
  { id: "RT005", from: "Gaborone", to: "Serowe", fare: 120.0, distance: "330 km", status: "active" },
  { id: "RT006", from: "Gaborone", to: "Kanye", fare: 30.0, distance: "75 km", status: "active" },
  { id: "RT007", from: "Francistown", to: "Nata", fare: 80.0, distance: "190 km", status: "active" },
  { id: "RT008", from: "Francistown", to: "Maun", fare: 180.0, distance: "520 km", status: "active" },
  { id: "RT009", from: "Gaborone", to: "Lobatse", fare: 20.0, distance: "70 km", status: "active" },
  { id: "RT010", from: "Gaborone", to: "Molepolole", fare: 25.0, distance: "50 km", status: "active" },
];

const Transport = () => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({ from: "", to: "", fare: "", distance: "" });
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileTransportView />;
  }

  const handleOpenAdd = () => {
    setFormData({ from: "", to: "", fare: "", distance: "" });
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setFormData({ from: route.from, to: route.to, fare: route.fare.toString(), distance: route.distance });
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.from || !formData.to || !formData.fare) return;
    if (editingRoute) {
      setRoutes(
        routes.map((r) =>
          r.id === editingRoute.id
            ? {
                ...r,
                from: formData.from,
                to: formData.to,
                fare: parseFloat(formData.fare),
                distance: formData.distance,
              }
            : r,
        ),
      );
    } else {
      setRoutes([
        ...routes,
        {
          id: `RT${String(routes.length + 1).padStart(3, "0")}`,
          from: formData.from,
          to: formData.to,
          fare: parseFloat(formData.fare),
          distance: formData.distance || "—",
          status: "active",
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter((r) => r.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transport</h1>
          <p className="text-muted-foreground">Manage your routes and fares</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((route) => (
          <div key={route.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Bus className="w-6 h-6 text-primary" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card">
                  <DropdownMenuItem onClick={() => handleOpenEdit(route)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(route.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">{route.from}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">{route.to}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-3">{route.distance}</p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-foreground">P{route.fare.toFixed(2)}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600">Active</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoute ? "Edit Route" : "Add New Route"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                placeholder="e.g. Gaborone"
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                placeholder="e.g. Francistown"
              />
            </div>
            <div className="space-y-2">
              <Label>Fare (P)</Label>
              <Input
                type="number"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Distance</Label>
              <Input
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="e.g. 430 km"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingRoute ? "Save Changes" : "Add Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transport;
