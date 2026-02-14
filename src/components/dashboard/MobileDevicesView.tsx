import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Wifi, 
  WifiOff, 
  Battery,
  MoreVertical,
  QrCode,
  ArrowRight,
  X
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import { getDeviceImage } from "@/data/devices";
import PataLogo from "@/components/PataLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileDevicesViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

interface Device {
  id: string;
  name: string;
  model: string;
  status: "online" | "offline";
  battery: number;
  lastSeen: string;
}

const MobileDevicesView = ({ profile, userEmail }: MobileDevicesViewProps) => {
  const [devices] = useState<Device[]>([
    { id: "DEV001", name: "Counter Terminal", model: "Pata Spaza", status: "online", battery: 85, lastSeen: "Now" },
    { id: "DEV002", name: "Mobile Device", model: "Go Pata", status: "online", battery: 42, lastSeen: "2 min ago" },
    { id: "DEV003", name: "Pro Terminal", model: "Pata Pro", status: "online", battery: 78, lastSeen: "5 min ago" },
    { id: "DEV004", name: "Silver POS", model: "Patapos Silver", status: "offline", battery: 0, lastSeen: "2 days ago" },
    { id: "DEV005", name: "Diamond Terminal", model: "Pata Diamond", status: "online", battery: 95, lastSeen: "Now" },
    { id: "DEV006", name: "Platinum Station", model: "Pata Platinum", status: "offline", battery: 0, lastSeen: "1 week ago" },
  ]);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [pairingStep, setPairingStep] = useState<"name" | "scan">("name");
  const [deviceName, setDeviceName] = useState("");

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600 dark:text-green-400";
    if (level > 20) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

  const openAddSheet = () => {
    setPairingStep("name");
    setDeviceName("");
    setShowAddSheet(true);
  };

  const handleLinkDevice = () => {
    setShowAddSheet(false);
    setPairingStep("name");
    setDeviceName("");
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <button onClick={openAddSheet} className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Device Summary */}
      <div className="px-5 py-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active devices</p>
              <p className="text-2xl font-bold text-foreground">
                {devices.filter(d => d.status === "online").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Devices List */}
      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">Your devices</h2>
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="bg-card rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    <img src={getDeviceImage(device.model)} alt={device.model} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.model}</p>
                  </div>
                </div>
                <button className="p-2">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {device.status === "online" ? (
                    <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-medium capitalize ${device.status === "online" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {device.status}
                  </span>
                </div>
                {device.status === "online" && (
                  <div className="flex items-center gap-1.5">
                    <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                    <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>{device.battery}%</span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground ml-auto">{device.lastSeen}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Device Card */}
        <button onClick={openAddSheet} className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add New Device</span>
        </button>
      </div>

      {/* Add Device Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8 max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{pairingStep === "name" ? "Name Your Device" : "Link Your Device"}</SheetTitle>
          </SheetHeader>

          {pairingStep === "name" ? (
            <div className="py-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img src={getDeviceImage("Go Pata")} alt="Device" className="w-12 h-12 object-contain" />
                </div>
                <p className="text-muted-foreground text-sm">Give your device a friendly name so you can identify it easily.</p>
              </div>
              <div className="space-y-2 mb-6">
                <Label htmlFor="mobileDeviceName">Device Name</Label>
                <Input id="mobileDeviceName" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder='e.g. "Front Counter" or "Delivery Van"' />
              </div>
              <Button onClick={() => setPairingStep("scan")} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!deviceName.trim()}>
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="py-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Scan QR Code</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Find the QR code on the back of your Pata terminal and scan it to link <span className="font-semibold text-foreground">"{deviceName}"</span>.
                </p>
                <div className="bg-muted rounded-xl p-4 text-left space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm text-foreground">Turn on your Pata terminal</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm text-foreground">Find the QR code sticker on the back</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-foreground">Scan with your phone camera</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setPairingStep("name")} className="flex-1">Back</Button>
                  <Button onClick={handleLinkDevice} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileDevicesView;
