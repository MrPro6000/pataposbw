import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDevicesView from "@/components/dashboard/MobileDevicesView";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Wifi, WifiOff, Battery, MoreVertical, Trash2, RefreshCw, QrCode, ArrowRight, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDeviceImage, deviceModels } from "@/data/devices";
import { useToast } from "@/hooks/use-toast";

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
];

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pairingStep, setPairingStep] = useState<"name" | "scan">("name");
  const [deviceName, setDeviceName] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedShopDevice, setSelectedShopDevice] = useState<string | null>(null);
  const [buyStep, setBuyStep] = useState<"confirm" | "name" | "done">("confirm");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "account">("wallet");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  if (isMobile) { return <MobileDevicesView profile={null} userEmail="" />; }

  const handleRemoveDevice = (id: string) => { setDevices(devices.filter(d => d.id !== id)); };
  const getBatteryColor = (level: number) => { if (level > 50) return "text-green-500"; if (level > 20) return "text-yellow-500"; return "text-red-500"; };

  const openAddModal = () => {
    setPairingStep("name");
    setDeviceName("");
    setIsAddModalOpen(true);
  };

  const handleLinkDevice = () => {
    setIsAddModalOpen(false);
    setPairingStep("name");
    setDeviceName("");
  };

  const shopDevices = Object.values(deviceModels);

  const handleBuyDevice = (modelKey: string) => {
    setSelectedShopDevice(modelKey);
    setBuyStep("confirm");
    setNewDeviceName("");
    setPaymentMethod("wallet");
    setIsBuyModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedShopDevice) return;
    const model = deviceModels[selectedShopDevice];
    if (!model) return;

    const newDevice: Device = {
      id: `DEV${String(devices.length + 1).padStart(3, "0")}`,
      name: newDeviceName || model.name,
      model: model.model,
      status: "offline",
      battery: 100,
      lastSeen: "Just purchased",
      serialNumber: `${model.id.toUpperCase()}-${Date.now().toString().slice(-6)}`,
    };

    setDevices(prev => [...prev, newDevice]);
    setBuyStep("done");
    toast({ title: "Terminal purchased!", description: `${model.name} has been added to My Machines.` });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Devices</h1>
          <p className="text-muted-foreground">Manage your POS terminals and card machines</p>
        </div>
      </div>

      <Tabs defaultValue="my-machines" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-machines">My Machines</TabsTrigger>
          <TabsTrigger value="shop">Shop Terminals</TabsTrigger>
        </TabsList>

        {/* My Machines Tab */}
        <TabsContent value="my-machines">
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
              <span className="text-muted-foreground font-medium">Connect Existing Device</span>
            </button>
          </div>
        </TabsContent>

        {/* Shop Terminals Tab */}
        <TabsContent value="shop">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopDevices.map((device) => (
              <div key={device.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-muted to-secondary rounded-xl mb-4 flex items-center justify-center p-4">
                  <img src={device.image} alt={device.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{device.name}</h3>
                <p className="text-2xl font-bold text-foreground mb-2">{device.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{device.description}</p>
                <Button
                  onClick={() => handleBuyDevice(device.model)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy & Add to My Machines
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Connect Existing Device Dialog */}
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
                  Find the QR code on the back of your Pata terminal and scan it to link <span className="font-semibold text-foreground">"{deviceName}"</span>.
                </p>
                <div className="bg-muted rounded-xl p-4 text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary">1</span></div>
                    <p className="text-sm text-foreground">Turn on your Pata terminal</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary">2</span></div>
                    <p className="text-sm text-foreground">Find the QR code sticker on the back</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-xs font-bold text-primary">3</span></div>
                    <p className="text-sm text-foreground">Scan with your phone camera</p>
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
                <Button onClick={handleLinkDevice} className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Device Dialog */}
      <Dialog open={isBuyModalOpen} onOpenChange={(open) => { setIsBuyModalOpen(open); if (!open) setBuyStep("confirm"); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {buyStep === "confirm" ? "Purchase Terminal" : buyStep === "name" ? "Name Your Terminal" : "Purchase Complete"}
            </DialogTitle>
          </DialogHeader>

          {buyStep === "confirm" && selectedShopDevice && deviceModels[selectedShopDevice] && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center p-2">
                  <img src={deviceModels[selectedShopDevice].image} alt={deviceModels[selectedShopDevice].name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{deviceModels[selectedShopDevice].name}</h3>
                  <p className="text-2xl font-bold text-primary">{deviceModels[selectedShopDevice].price}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Label>Pay with</Label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "wallet" ? "border-primary" : "border-muted-foreground"}`}>
                      {paymentMethod === "wallet" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="font-medium text-foreground">Wallet Balance</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("account")}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${paymentMethod === "account" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "account" ? "border-primary" : "border-muted-foreground"}`}>
                      {paymentMethod === "account" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="font-medium text-foreground">Connected Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {buyStep === "name" && (
            <div className="py-4">
              <p className="text-muted-foreground mb-4">Give your new terminal a name so you can identify it.</p>
              <div className="space-y-2">
                <Label htmlFor="newDeviceName">Device Name</Label>
                <Input id="newDeviceName" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} placeholder='e.g. "Front Counter"' />
              </div>
            </div>
          )}

          {buyStep === "done" && (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Terminal Added!</h3>
              <p className="text-muted-foreground">Your new terminal has been added to My Machines. Connect it by scanning the QR code on the back.</p>
            </div>
          )}

          <DialogFooter>
            {buyStep === "confirm" && (
              <>
                <Button variant="outline" onClick={() => setIsBuyModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setBuyStep("name")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue
                </Button>
              </>
            )}
            {buyStep === "name" && (
              <>
                <Button variant="outline" onClick={() => setBuyStep("confirm")}>Back</Button>
                <Button onClick={handleConfirmPurchase} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!newDeviceName.trim()}>
                  Confirm Purchase
                </Button>
              </>
            )}
            {buyStep === "done" && (
              <Button onClick={() => setIsBuyModalOpen(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Devices;
