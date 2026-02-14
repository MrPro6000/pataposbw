import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDevicesView from "@/components/dashboard/MobileDevicesView";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Wifi, WifiOff, Battery, MoreVertical, Trash2, RefreshCw, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDeviceImage } from "@/data/devices";

interface Device {
  id: string;
  name: string;
  model: string;
  status: "online" | "offline";
  battery: number;
  lastSeen: string;
  serialNumber: string;
}

const initialDevices: Device[] = [
  { id: "DEV001", name: "Counter Terminal", model: "Pata Spaza", status: "online", battery: 85, lastSeen: "Now", serialNumber: "SPAZA-2025-001234" },
  { id: "DEV002", name: "Mobile Device", model: "Go Pata", status: "online", battery: 42, lastSeen: "2 min ago", serialNumber: "GOPATA-2025-005678" },
  { id: "DEV003", name: "Pro Terminal", model: "Pata Pro", status: "online", battery: 78, lastSeen: "5 min ago", serialNumber: "PRO-2025-007890" },
  { id: "DEV004", name: "Silver POS", model: "Patapos Silver", status: "offline", battery: 0, lastSeen: "2 days ago", serialNumber: "SILVER-2024-009012" },
  { id: "DEV005", name: "Diamond Terminal", model: "Pata Diamond", status: "online", battery: 95, lastSeen: "Now", serialNumber: "DIAMOND-2025-003456" },
  { id: "DEV006", name: "Platinum Station", model: "Pata Platinum", status: "offline", battery: 0, lastSeen: "1 week ago", serialNumber: "PLATINUM-2024-001122" },
];

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pairingStep, setPairingStep] = useState<"name" | "scan">("name");
  const [deviceName, setDeviceName] = useState("");
  const isMobile = useIsMobile();

  if (isMobile) { return <MobileDevicesView profile={null} userEmail="" />; }

  const handleRemoveDevice = (id: string) => { setDevices(devices.filter(d => d.id !== id)); };
  const getBatteryColor = (level: number) => { if (level > 50) return "text-green-500"; if (level > 20) return "text-yellow-500"; return "text-red-500"; };

  const openAddModal = () => {
    setPairingStep("name");
    setDeviceName("");
    setIsAddModalOpen(true);
  };

  const handleLinkDevice = () => {
    // Simulate linking
    setIsAddModalOpen(false);
    setPairingStep("name");
    setDeviceName("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground">Manage your POS terminals and card machines</p>
        </div>
        <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Device
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  <img src={getDeviceImage(device.model)} alt={device.model} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{device.name}</h3>
                  <p className="text-sm text-muted-foreground">{device.model}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-muted rounded-lg"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border border-border">
                  <DropdownMenuItem><RefreshCw className="w-4 h-4 mr-2" /> Refresh Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRemoveDevice(device.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Remove Device</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                {device.status === "online" ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-muted-foreground" />}
                <span className={`text-sm font-medium capitalize ${device.status === "online" ? "text-green-500" : "text-muted-foreground"}`}>{device.status}</span>
              </div>
              {device.status === "online" && (
                <div className="flex items-center gap-1.5">
                  <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                  <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>{device.battery}%</span>
                </div>
              )}
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Serial</span>
                <span className="font-medium text-foreground">{device.serialNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Seen</span>
                <span className="font-medium text-foreground">{device.lastSeen}</span>
              </div>
            </div>
          </div>
        ))}

        <button onClick={openAddModal} className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center"><Plus className="w-6 h-6 text-muted-foreground" /></div>
          <span className="text-muted-foreground font-medium">Add New Device</span>
        </button>
      </div>

      {/* Add Device Dialog - Step Flow */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pairingStep === "name" ? "Name Your Device" : "Link Your Device"}</DialogTitle>
          </DialogHeader>

          {pairingStep === "name" ? (
            <div className="py-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <img src={getDeviceImage("Go Pata")} alt="Device" className="w-12 h-12 object-contain" />
                </div>
                <p className="text-muted-foreground">Give your device a friendly name so you can identify it easily.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name</Label>
                <Input id="deviceName" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder='e.g. "Front Counter" or "Delivery Van"' />
              </div>
            </div>
          ) : (
            <div className="py-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Scan QR Code</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Find the QR code on the back of your Pata terminal and scan it with your phone camera to link <span className="font-semibold text-foreground">"{deviceName}"</span>.
                </p>
                <div className="bg-muted rounded-xl p-4 text-left space-y-3">
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
                    <p className="text-sm text-foreground">Find the QR code sticker on the back of the device</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm text-foreground">Scan the QR code using your phone's camera</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {pairingStep === "name" ? (
              <>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setPairingStep("scan")} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!deviceName.trim()}>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setPairingStep("name")}>Back</Button>
                <Button onClick={handleLinkDevice} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Done
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Devices;
