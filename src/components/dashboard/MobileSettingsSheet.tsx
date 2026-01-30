import { useState } from "react";
import { X, ChevronLeft, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

type SettingsSection = 
  | "business" 
  | "store" 
  | "payments" 
  | "tax" 
  | "receipts" 
  | "notifications"
  | "support"
  | "devices"
  | "customers"
  | "theme";

interface MobileSettingsSheetProps {
  open: boolean;
  onClose: () => void;
  section: SettingsSection;
  title: string;
}

const MobileSettingsSheet = ({ open, onClose, section, title }: MobileSettingsSheetProps) => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  // Business settings state
  const [businessInfo, setBusinessInfo] = useState({
    name: "Pata Business (Pty) Ltd",
    registrationNumber: "2025/123456/07",
    email: "info@patabusiness.com",
    phone: "+267 71 234 5678",
    address: "Plot 123, Main Mall, Gaborone",
  });

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Main Branch",
    operatingHours: "08:00 - 18:00",
    currency: "BWP",
    timezone: "Africa/Gaborone",
  });

  // Tax settings state
  const [taxSettings, setTaxSettings] = useState({
    vatEnabled: true,
    vatRate: "14",
    vatNumber: "P00123456789",
    pricesIncludeVat: true,
  });

  // Receipt settings state
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    footerMessage: "Thank you for your business!",
    includeVatBreakdown: true,
    emailReceipts: true,
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    dailySummary: true,
    lowStock: true,
    newSale: false,
    payoutComplete: true,
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    tapToPay: true,
    online: true,
    mobileMoney: true,
    cash: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: `${title} settings have been updated`,
    });
    onClose();
  };

  const renderContent = () => {
    switch (section) {
      case "business":
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[#141414]">Business Name</Label>
              <Input 
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Registration Number</Label>
              <Input 
                value={businessInfo.registrationNumber}
                onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Email</Label>
              <Input 
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Phone</Label>
              <Input 
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Address</Label>
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
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[#141414]">Store Name</Label>
              <Input 
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Operating Hours</Label>
              <Input 
                value={storeSettings.operatingHours}
                onChange={(e) => setStoreSettings({ ...storeSettings, operatingHours: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Currency</Label>
              <Select value={storeSettings.currency} onValueChange={(v) => setStoreSettings({ ...storeSettings, currency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="BWP">BWP - Botswana Pula</SelectItem>
                  <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Timezone</Label>
              <Select value={storeSettings.timezone} onValueChange={(v) => setStoreSettings({ ...storeSettings, timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Africa/Gaborone">Africa/Gaborone (CAT)</SelectItem>
                  <SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-4">
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Card Payments</p>
                <p className="text-sm text-[#141414]/60">Accept Visa, Mastercard</p>
              </div>
              <Switch 
                checked={paymentMethods.card} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, card: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Tap to Pay</p>
                <p className="text-sm text-[#141414]/60">NFC contactless</p>
              </div>
              <Switch 
                checked={paymentMethods.tapToPay} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, tapToPay: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Mobile Money</p>
                <p className="text-sm text-[#141414]/60">Orange, Smega, MyZaka</p>
              </div>
              <Switch 
                checked={paymentMethods.mobileMoney} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, mobileMoney: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Online Payments</p>
                <p className="text-sm text-[#141414]/60">Payment links & invoices</p>
              </div>
              <Switch 
                checked={paymentMethods.online} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, online: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Cash</p>
                <p className="text-sm text-[#141414]/60">Record cash transactions</p>
              </div>
              <Switch 
                checked={paymentMethods.cash} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, cash: v })}
              />
            </div>
          </div>
        );

      case "tax":
        return (
          <div className="space-y-5">
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
                <div className="space-y-2">
                  <Label className="text-[#141414]">VAT Rate (%)</Label>
                  <Input 
                    value={taxSettings.vatRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#141414]">VAT Number</Label>
                  <Input 
                    value={taxSettings.vatNumber}
                    onChange={(e) => setTaxSettings({ ...taxSettings, vatNumber: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#141414]">Prices Include VAT</p>
                    <p className="text-sm text-[#141414]/60">Prices already include VAT</p>
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
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Show Logo</p>
                <p className="text-sm text-[#141414]/60">Display business logo</p>
              </div>
              <Switch 
                checked={receiptSettings.showLogo} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, showLogo: v })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#141414]">Footer Message</Label>
              <Input 
                value={receiptSettings.footerMessage}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">VAT Breakdown</p>
                <p className="text-sm text-[#141414]/60">Show VAT separately</p>
              </div>
              <Switch 
                checked={receiptSettings.includeVatBreakdown} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, includeVatBreakdown: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Email Receipts</p>
                <p className="text-sm text-[#141414]/60">Send via email</p>
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
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Daily Summary</p>
                <p className="text-sm text-[#141414]/60">Receive daily sales summary</p>
              </div>
              <Switch 
                checked={notifications.dailySummary} 
                onCheckedChange={(v) => setNotifications({ ...notifications, dailySummary: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Low Stock Alerts</p>
                <p className="text-sm text-[#141414]/60">Get notified when stock is low</p>
              </div>
              <Switch 
                checked={notifications.lowStock} 
                onCheckedChange={(v) => setNotifications({ ...notifications, lowStock: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">New Sale</p>
                <p className="text-sm text-[#141414]/60">Notify on every sale</p>
              </div>
              <Switch 
                checked={notifications.newSale} 
                onCheckedChange={(v) => setNotifications({ ...notifications, newSale: v })}
              />
            </div>
            <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#141414]">Payout Complete</p>
                <p className="text-sm text-[#141414]/60">When payout is processed</p>
              </div>
              <Switch 
                checked={notifications.payoutComplete} 
                onCheckedChange={(v) => setNotifications({ ...notifications, payoutComplete: v })}
              />
            </div>
          </div>
        );

      case "support":
        return (
          <div className="space-y-5">
            <div className="bg-[#00C8E6]/10 rounded-xl p-4">
              <p className="font-medium text-[#141414] mb-2">Need Help?</p>
              <p className="text-sm text-[#141414]/60 mb-4">
                Our support team is available 24/7 to assist you.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("tel:+2673001234")}
                >
                  📞 Call +267 300 1234
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open("mailto:support@pata.co.bw")}
                >
                  ✉️ Email support@pata.co.bw
                </Button>
                <Button 
                  className="w-full bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]"
                >
                  💬 Start Live Chat
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-[#141414]">FAQ Topics</p>
              {["Getting Started", "Payments", "Devices", "Account & Billing"].map((topic) => (
                <button 
                  key={topic}
                  className="w-full text-left p-4 bg-[#F5F5F5] rounded-xl active:bg-[#E8E8E8] transition-colors"
                >
                  <p className="font-medium text-[#141414]">{topic}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "devices":
        return (
          <div className="space-y-4">
            <div className="bg-[#00C8E6]/10 rounded-xl p-4">
              <p className="font-medium text-[#141414] mb-1">Your Devices</p>
              <p className="text-sm text-[#141414]/60">Manage your POS terminals and card machines</p>
            </div>
            {[
              { name: "Counter Terminal", model: "Pata Spaza", status: "online" },
              { name: "Mobile Device", model: "Go Pata", status: "online" },
              { name: "Pro Terminal", model: "Pata Pro", status: "online" },
              { name: "Silver POS", model: "Patapos Silver", status: "offline" },
              { name: "Diamond Terminal", model: "Pata Diamond", status: "online" },
              { name: "Platinum Station", model: "Pata Platinum", status: "offline" },
            ].map((device, index) => (
              <div key={index} className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#141414]">{device.name}</p>
                  <p className="text-sm text-[#141414]/60">{device.model}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  device.status === "online" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {device.status}
                </span>
              </div>
            ))}
            <Button className="w-full bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
              + Add New Device
            </Button>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-4">
            <div className="bg-[#00C8E6]/10 rounded-xl p-4">
              <p className="font-medium text-[#141414] mb-1">Customer Database</p>
              <p className="text-sm text-[#141414]/60">View and manage your customers</p>
            </div>
            {[
              { name: "John Smith", email: "john@email.com", spent: 2450 },
              { name: "Sarah Johnson", email: "sarah@email.com", spent: 1890 },
              { name: "Michael Brown", email: "michael@email.com", spent: 3200 },
              { name: "Emily Davis", email: "emily@email.com", spent: 950 },
              { name: "David Wilson", email: "david@email.com", spent: 4100 },
            ].map((customer, index) => (
              <div key={index} className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#141414]">{customer.name}</p>
                  <p className="text-sm text-[#141414]/60">{customer.email}</p>
                </div>
                <span className="text-sm font-semibold text-[#00C8E6]">
                  P{customer.spent.toLocaleString()}
                </span>
              </div>
            ))}
            <Button className="w-full bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
              + Add Customer
            </Button>
          </div>
        );

      case "theme":
        return (
          <div className="space-y-5">
            {/* Theme Mode - Light/Dark only */}
            <div>
              <p className="font-medium text-[#141414] mb-3">Appearance</p>
              <p className="text-sm text-[#141414]/60 mb-4">Choose between light and dark mode</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme === "dark" && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    theme === "light" ? "border-[#0066FF] bg-[#0066FF]/10" : "border-[#E8E8E8]"
                  }`}
                >
                  <div className="w-12 h-12 bg-white border border-[#E8E8E8] rounded-xl flex items-center justify-center">
                    <Sun className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="font-medium text-[#141414]">Light</span>
                  {theme === "light" && <Check className="w-5 h-5 text-[#0066FF]" />}
                </button>
                
                <button
                  onClick={() => theme === "light" && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    theme === "dark" ? "border-[#0066FF] bg-[#0066FF]/10" : "border-[#E8E8E8]"
                  }`}
                >
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="font-medium text-[#141414]">Dark</span>
                  {theme === "dark" && <Check className="w-5 h-5 text-[#0066FF]" />}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-white max-h-[90vh]">
        <DrawerHeader className="border-b border-[#E8E8E8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-[#141414]" />
                </button>
              </DrawerClose>
              <DrawerTitle className="text-[#141414]">{title}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-24">
          {renderContent()}
        </div>

        {section !== "support" && section !== "devices" && section !== "customers" && section !== "theme" && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-[#E8E8E8]">
            <Button
              onClick={handleSave}
              className="w-full h-12 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold"
            >
              Save Changes
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSettingsSheet;