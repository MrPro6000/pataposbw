import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Building2, 
  Store,
  CreditCard,
  Receipt,
  Bell,
  Percent,
  ChevronRight,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingsSection = "business" | "store" | "payments" | "tax" | "receipts" | "notifications";

const Settings = () => {
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<SettingsSection>("business");
  
  const [businessInfo, setBusinessInfo] = useState({
    name: "Pata Business (Pty) Ltd",
    registrationNumber: "2025/123456/07",
    email: "info@patabusiness.com",
    phone: "+27 11 123 4567",
    address: "123 Main Street, Sandton, Johannesburg, 2196",
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Main Branch",
    operatingHours: "08:00 - 18:00",
    currency: "ZAR",
    timezone: "Africa/Johannesburg",
  });

  const [taxSettings, setTaxSettings] = useState({
    vatEnabled: true,
    vatRate: "15",
    vatNumber: "4123456789",
    pricesIncludeVat: true,
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    footerMessage: "Thank you for your business!",
    includeVatBreakdown: true,
    emailReceipts: true,
  });

  const [notifications, setNotifications] = useState({
    dailySummary: true,
    lowStock: true,
    newSale: false,
    payoutComplete: true,
  });

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const sections = [
    { id: "business" as const, label: "Business Profile", icon: Building2 },
    { id: "store" as const, label: "Store Details", icon: Store },
    { id: "payments" as const, label: "Payment Methods", icon: CreditCard },
    { id: "tax" as const, label: "Tax / VAT", icon: Percent },
    { id: "receipts" as const, label: "Receipts", icon: Receipt },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "business":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input 
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input 
                value={businessInfo.registrationNumber}
                onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea 
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        );

      case "store":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input 
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Operating Hours</Label>
              <Input 
                value={storeSettings.operatingHours}
                onChange={(e) => setStoreSettings({ ...storeSettings, operatingHours: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={storeSettings.currency} onValueChange={(v) => setStoreSettings({ ...storeSettings, currency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={storeSettings.timezone} onValueChange={(v) => setStoreSettings({ ...storeSettings, timezone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-[#F6F6F6] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00C8E6]/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#00C8E6]" />
                </div>
                <div>
                  <p className="font-medium text-[#141414]">Card Payments</p>
                  <p className="text-sm text-[#141414]/60">Accept Visa, Mastercard, Amex</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="p-4 bg-[#F6F6F6] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-[#141414]">Tap to Pay</p>
                  <p className="text-sm text-[#141414]/60">NFC contactless payments</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="p-4 bg-[#F6F6F6] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#141414]">Online Payments</p>
                  <p className="text-sm text-[#141414]/60">Payment links & invoices</p>
                </div>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        );

      case "tax":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Enable VAT</p>
                <p className="text-sm text-[#141414]/60">Apply VAT to transactions</p>
              </div>
              <Switch 
                checked={taxSettings.vatEnabled} 
                onCheckedChange={(v) => setTaxSettings({ ...taxSettings, vatEnabled: v })}
              />
            </div>
            {taxSettings.vatEnabled && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>VAT Rate (%)</Label>
                    <Input 
                      value={taxSettings.vatRate}
                      onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>VAT Number</Label>
                    <Input 
                      value={taxSettings.vatNumber}
                      onChange={(e) => setTaxSettings({ ...taxSettings, vatNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#141414]">Prices Include VAT</p>
                    <p className="text-sm text-[#141414]/60">Product prices already include VAT</p>
                  </div>
                  <Switch 
                    checked={taxSettings.pricesIncludeVat} 
                    onCheckedChange={(v) => setTaxSettings({ ...taxSettings, pricesIncludeVat: v })}
                  />
                </div>
              </>
            )}
          </div>
        );

      case "receipts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Show Logo on Receipt</p>
                <p className="text-sm text-[#141414]/60">Display your business logo</p>
              </div>
              <Switch 
                checked={receiptSettings.showLogo} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, showLogo: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Footer Message</Label>
              <Input 
                value={receiptSettings.footerMessage}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })}
                placeholder="Thank you for your business!"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Include VAT Breakdown</p>
                <p className="text-sm text-[#141414]/60">Show VAT amount separately</p>
              </div>
              <Switch 
                checked={receiptSettings.includeVatBreakdown} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, includeVatBreakdown: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Email Receipts</p>
                <p className="text-sm text-[#141414]/60">Send receipts via email</p>
              </div>
              <Switch 
                checked={receiptSettings.emailReceipts} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, emailReceipts: v })}
              />
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F6F6F6] rounded-xl">
              <div>
                <p className="font-medium text-[#141414]">Daily Summary</p>
                <p className="text-sm text-[#141414]/60">Receive daily sales summary</p>
              </div>
              <Switch 
                checked={notifications.dailySummary} 
                onCheckedChange={(v) => setNotifications({ ...notifications, dailySummary: v })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F6F6F6] rounded-xl">
              <div>
                <p className="font-medium text-[#141414]">Low Stock Alerts</p>
                <p className="text-sm text-[#141414]/60">Get notified when stock is low</p>
              </div>
              <Switch 
                checked={notifications.lowStock} 
                onCheckedChange={(v) => setNotifications({ ...notifications, lowStock: v })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F6F6F6] rounded-xl">
              <div>
                <p className="font-medium text-[#141414]">New Sale Notifications</p>
                <p className="text-sm text-[#141414]/60">Notify on every new sale</p>
              </div>
              <Switch 
                checked={notifications.newSale} 
                onCheckedChange={(v) => setNotifications({ ...notifications, newSale: v })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F6F6F6] rounded-xl">
              <div>
                <p className="font-medium text-[#141414]">Payout Complete</p>
                <p className="text-sm text-[#141414]/60">Notify when payout is processed</p>
              </div>
              <Switch 
                checked={notifications.payoutComplete} 
                onCheckedChange={(v) => setNotifications({ ...notifications, payoutComplete: v })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Settings</h1>
          <p className="text-[#141414]/60">Configure your business preferences</p>
        </div>
        <Button className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-64 bg-white rounded-2xl p-3 h-fit">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                activeSection === section.id 
                  ? 'bg-[#00C8E6]/10 text-[#00C8E6]' 
                  : 'text-[#141414]/70 hover:bg-[#f0f0f0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#141414] mb-6">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
