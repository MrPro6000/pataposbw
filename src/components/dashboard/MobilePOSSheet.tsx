import { useState } from "react";
import { X, ShoppingBag, Monitor, Keyboard, Receipt, Printer, Calculator, Settings, Wifi, Battery, Signal, Smartphone, Globe } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MobileProductSaleSheet from "./MobileProductSaleSheet";

interface MobilePOSSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobilePOSSheet = ({ open, onClose }: MobilePOSSheetProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [productSaleOpen, setProductSaleOpen] = useState(false);
  const { toast } = useToast();

  // POS device status
  const posDevices = [
    { id: "1", name: "Main Register", status: "online", lastSync: "2 min ago", battery: 85 },
    { id: "2", name: "Counter 2", status: "online", lastSync: "5 min ago", battery: 72 },
    { id: "3", name: "Mobile POS", status: "offline", lastSync: "1 hour ago", battery: 45 },
  ];

  // POS quick actions
  const posActions = [
    { id: "open-register", label: "Open Register", icon: Monitor, description: "Start a new shift" },
    { id: "close-register", label: "Close Register", icon: Calculator, description: "End shift & count cash" },
    { id: "print-receipt", label: "Print Receipt", icon: Printer, description: "Reprint last receipt" },
    { id: "view-transactions", label: "Transactions", icon: Receipt, description: "View today's sales" },
    { id: "settings", label: "POS Settings", icon: Settings, description: "Configure terminal" },
    { id: "pair-device", label: "Pair Device", icon: Keyboard, description: "Connect new hardware" },
  ];

  const handleAction = (actionId: string) => {
    console.log(`POS Action: ${actionId}`);
    toast({
      title: "Action triggered",
      description: `${actionId.replace("-", " ")} feature coming soon`,
    });
  };

  const handleInternationalTransfer = () => {
    toast({
      title: "Coming Soon",
      description: "International transfers (Western Union, Mukuru, WorldRemit) will be available soon!",
    });
  };

  const handleStartSale = () => {
    setProductSaleOpen(true);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className="bg-background max-h-[95vh]">
          <DrawerHeader className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-xl font-bold text-foreground">PataPOS</DrawerTitle>
                <DrawerDescription className="text-xs text-muted-foreground mt-0.5">Your store in your pocket</DrawerDescription>
              </div>
              <button onClick={onClose} className="p-2 -mr-2">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* POS Status Overview */}
            <div className="mb-6">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">PataPOS Ready</p>
                    <p className="text-sm text-muted-foreground">Sell products, scan & pay</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Connected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Synced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* POS Devices */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Devices</h3>
              <div className="space-y-2">
                {posDevices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={`w-full bg-card border rounded-xl p-4 text-left active:scale-98 transition-all ${
                      selectedDevice === device.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          device.status === "online" ? "bg-green-500/10" : "bg-muted"
                        }`}>
                          <Monitor className={`w-5 h-5 ${
                            device.status === "online" ? "text-green-500" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{device.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {device.status === "online" ? `Synced ${device.lastSync}` : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Battery className={`w-4 h-4 ${
                            device.battery > 50 ? "text-green-500" : device.battery > 20 ? "text-orange-500" : "text-red-500"
                          }`} />
                          <span className="text-xs text-muted-foreground">{device.battery}%</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          device.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                        }`} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {posActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className="bg-card border border-border rounded-xl p-4 text-left active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* International Transfers Placeholder */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Money Transfer</h3>
              <button 
                onClick={handleInternationalTransfer}
                className="w-full bg-card border border-border rounded-xl p-4 text-left active:scale-98 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">International Transfers</p>
                    <p className="text-xs text-muted-foreground">Western Union, Mukuru, WorldRemit</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>
            </div>

            {/* Today's Summary */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Today's Summary</h3>
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-foreground">24</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold text-foreground">P1,245</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg. Sale</p>
                    <p className="text-lg font-semibold text-foreground">P51.87</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items Sold</p>
                    <p className="text-lg font-semibold text-foreground">67</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-5 py-4 bg-background">
            <Button className="w-full" size="lg" onClick={handleStartSale}>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start New Sale
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Product Sale Sheet */}
      <MobileProductSaleSheet
        open={productSaleOpen}
        onClose={() => setProductSaleOpen(false)}
      />
    </>
  );
};

export default MobilePOSSheet;
