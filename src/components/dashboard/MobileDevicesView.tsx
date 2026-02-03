import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Wifi, 
  WifiOff, 
  Battery,
  MoreVertical 
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import { getDeviceImage } from "@/data/devices";
import PataLogo from "@/components/PataLogo";

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

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600 dark:text-green-400";
    if (level > 20) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
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
          <button className="w-10 h-10 flex items-center justify-center">
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
                    <img 
                      src={getDeviceImage(device.model)} 
                      alt={device.model}
                      className="w-full h-full object-cover"
                    />
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
                  <span className={`text-sm font-medium capitalize ${
                    device.status === "online" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  }`}>
                    {device.status}
                  </span>
                </div>
                {device.status === "online" && (
                  <div className="flex items-center gap-1.5">
                    <Battery className={`w-4 h-4 ${getBatteryColor(device.battery)}`} />
                    <span className={`text-sm font-medium ${getBatteryColor(device.battery)}`}>
                      {device.battery}%
                    </span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground ml-auto">{device.lastSeen}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Device Card */}
        <button className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add New Device</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileDevicesView;
