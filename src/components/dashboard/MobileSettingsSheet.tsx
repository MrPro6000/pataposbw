import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

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
  | "dashboard"
  | "theme";

interface MobileSettingsSheetProps {
  open: boolean;
  onClose: () => void;
  section: SettingsSection;
  title: string;
  profile?: { full_name: string | null; business_name: string | null; email?: string | null; phone?: string | null } | null;
  userId?: string;
  onProfileUpdated?: () => void;
}

const MobileSettingsSheet = ({ open, onClose, section, title, profile, userId, onProfileUpdated }: MobileSettingsSheetProps) => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  // Business settings state — pre-filled from real profile
  const [businessInfo, setBusinessInfo] = useState({
    name: profile?.business_name || "",
    registrationNumber: "",
    email: (profile as any)?.email || "",
    phone: (profile as any)?.phone || "",
    address: "",
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

  // Dashboard preferences state
  const [dashPrefs, setDashPrefs] = useState({
    show_sell_products: true,
    show_transport: true,
    show_mobile_money: true,
    show_council_payments: true,
    show_devices: true,
    show_reports: true,
    show_staff: true,
    show_customers: true,
    show_vouchers: true,
    show_payment_links: true,
    show_invoices: true,
    show_capital: true,
    show_mukuru: true,
  });
  const [dashPrefsLoaded, setDashPrefsLoaded] = useState(false);

  // Load dashboard prefs when section is dashboard
  useEffect(() => {
    if (section === "dashboard" && userId && !dashPrefsLoaded) {
      supabase
        .from("dashboard_preferences")
        .select("*")
        .eq("user_id", userId)
        .single()
        .then(({ data }) => {
          if (data) {
            const { id, user_id, created_at, updated_at, ...prefs } = data;
            setDashPrefs(prefs as typeof dashPrefs);
          }
          setDashPrefsLoaded(true);
        });
    }
  }, [section, userId, dashPrefsLoaded]);

  const handleSave = async () => {
    if (section === "business" && userId) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            business_name: businessInfo.name || null,
            email: businessInfo.email || null,
            phone: businessInfo.phone || null,
          })
          .eq("user_id", userId);
        if (error) throw error;
        onProfileUpdated?.();
        toast({ title: "Saved", description: "Business profile updated successfully." });
        onClose();
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setSaving(false);
      }
    } else if (section === "dashboard" && userId) {
      setSaving(true);
      try {
        const { error } = await supabase
          .from("dashboard_preferences")
          .upsert({ user_id: userId, ...dashPrefs }, { onConflict: "user_id" });
        if (error) throw error;
        toast({ title: "Saved", description: "Dashboard preferences updated." });
        onClose();
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setSaving(false);
      }
    } else {
      toast({
        title: "Settings Saved",
        description: `${title} settings have been updated`,
      });
      onClose();
    }
  };

  const renderContent = () => {
    switch (section) {
      case "business":
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-foreground">Business Name</Label>
              <Input 
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Registration Number</Label>
              <Input 
                value={businessInfo.registrationNumber}
                onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input 
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Phone</Label>
              <Input 
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Address</Label>
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
              <Label className="text-foreground">Store Name</Label>
              <Input 
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Operating Hours</Label>
              <Input 
                value={storeSettings.operatingHours}
                onChange={(e) => setStoreSettings({ ...storeSettings, operatingHours: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Currency</Label>
              <Select value={storeSettings.currency} onValueChange={(v) => setStoreSettings({ ...storeSettings, currency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BWP">BWP - Botswana Pula</SelectItem>
                  <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Timezone</Label>
              <Select value={storeSettings.timezone} onValueChange={(v) => setStoreSettings({ ...storeSettings, timezone: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Card Payments</p>
                <p className="text-sm text-muted-foreground">Accept Visa, Mastercard</p>
              </div>
              <Switch 
                checked={paymentMethods.card} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, card: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Tap to Pay</p>
                <p className="text-sm text-muted-foreground">NFC contactless</p>
              </div>
              <Switch 
                checked={paymentMethods.tapToPay} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, tapToPay: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Mobile Money</p>
                <p className="text-sm text-muted-foreground">Orange, Smega, MyZaka</p>
              </div>
              <Switch 
                checked={paymentMethods.mobileMoney} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, mobileMoney: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Online Payments</p>
                <p className="text-sm text-muted-foreground">Payment links & invoices</p>
              </div>
              <Switch 
                checked={paymentMethods.online} 
                onCheckedChange={(v) => setPaymentMethods({ ...paymentMethods, online: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Cash</p>
                <p className="text-sm text-muted-foreground">Record cash transactions</p>
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
                <p className="font-medium text-foreground">Enable VAT</p>
                <p className="text-sm text-muted-foreground">Apply VAT to transactions</p>
              </div>
              <Switch 
                checked={taxSettings.vatEnabled} 
                onCheckedChange={(v) => setTaxSettings({ ...taxSettings, vatEnabled: v })}
              />
            </div>
            {taxSettings.vatEnabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">VAT Rate (%)</Label>
                  <Input 
                    value={taxSettings.vatRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">VAT Number</Label>
                  <Input 
                    value={taxSettings.vatNumber}
                    onChange={(e) => setTaxSettings({ ...taxSettings, vatNumber: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Prices Include VAT</p>
                    <p className="text-sm text-muted-foreground">Prices already include VAT</p>
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
                <p className="font-medium text-foreground">Show Logo</p>
                <p className="text-sm text-muted-foreground">Display business logo</p>
              </div>
              <Switch 
                checked={receiptSettings.showLogo} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, showLogo: v })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Footer Message</Label>
              <Input 
                value={receiptSettings.footerMessage}
                onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">VAT Breakdown</p>
                <p className="text-sm text-muted-foreground">Show VAT separately</p>
              </div>
              <Switch 
                checked={receiptSettings.includeVatBreakdown} 
                onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, includeVatBreakdown: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Receipts</p>
                <p className="text-sm text-muted-foreground">Send via email</p>
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
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Receive daily sales summary</p>
              </div>
              <Switch 
                checked={notifications.dailySummary} 
                onCheckedChange={(v) => setNotifications({ ...notifications, dailySummary: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when stock is low</p>
              </div>
              <Switch 
                checked={notifications.lowStock} 
                onCheckedChange={(v) => setNotifications({ ...notifications, lowStock: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">New Sale</p>
                <p className="text-sm text-muted-foreground">Notify on every sale</p>
              </div>
              <Switch 
                checked={notifications.newSale} 
                onCheckedChange={(v) => setNotifications({ ...notifications, newSale: v })}
              />
            </div>
            <div className="bg-muted rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Payout Complete</p>
                <p className="text-sm text-muted-foreground">When payout is processed</p>
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
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="font-medium text-foreground mb-2">Need Help?</p>
              <p className="text-sm text-muted-foreground mb-4">
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
                <Button className="w-full">
                  💬 Start Live Chat
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">FAQ Topics</p>
              {["Getting Started", "Payments", "Devices", "Account & Billing"].map((topic) => (
                <button 
                  key={topic}
                  className="w-full text-left p-4 bg-muted rounded-xl active:bg-muted/70 transition-colors"
                >
                  <p className="font-medium text-foreground">{topic}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case "devices":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="font-medium text-foreground mb-1">Your Devices</p>
              <p className="text-sm text-muted-foreground">Manage your POS terminals and card machines</p>
            </div>
            {[
              { name: "Counter Terminal", model: "Pata Spaza", status: "online" },
              { name: "Mobile Device", model: "Go Pata", status: "online" },
              { name: "Pro Terminal", model: "Pata Pro", status: "online" },
              { name: "Silver POS", model: "Patapos Silver", status: "offline" },
              { name: "Diamond Terminal", model: "Pata Diamond", status: "online" },
              { name: "Platinum Station", model: "Pata Platinum", status: "offline" },
            ].map((device, index) => (
              <div key={index} className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{device.name}</p>
                  <p className="text-sm text-muted-foreground">{device.model}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  device.status === "online" 
                    ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                    : "bg-muted-foreground/20 text-muted-foreground"
                }`}>
                  {device.status}
                </span>
              </div>
            ))}
            <Button className="w-full">
              + Add New Device
            </Button>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-xl p-4">
              <p className="font-medium text-foreground mb-1">Customer Database</p>
              <p className="text-sm text-muted-foreground">View and manage your customers</p>
            </div>
            {[
              { name: "John Smith", email: "john@email.com", spent: 2450 },
              { name: "Sarah Johnson", email: "sarah@email.com", spent: 1890 },
              { name: "Michael Brown", email: "michael@email.com", spent: 3200 },
              { name: "Emily Davis", email: "emily@email.com", spent: 950 },
              { name: "David Wilson", email: "david@email.com", spent: 4100 },
            ].map((customer, index) => (
              <div key={index} className="bg-muted rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  P{customer.spent.toLocaleString()}
                </span>
              </div>
            ))}
            <Button className="w-full">
              + Add Customer
            </Button>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Choose which features appear on your dashboard. You can toggle them on or off anytime.</p>
            {([
              { key: "show_sell_products", label: "Sell Products", desc: "POS, food, beverages, retail" },
              { key: "show_transport", label: "Transport", desc: "Combi, taxi, bus fares" },
              { key: "show_mobile_money", label: "Mobile Money", desc: "Orange, Smega, MyZaka" },
              { key: "show_council_payments", label: "Council Payments", desc: "Rates, levies, licences" },
              { key: "show_devices", label: "Pata Devices", desc: "Card machines & terminals" },
              { key: "show_reports", label: "Reports", desc: "Sales analytics & insights" },
              { key: "show_staff", label: "Staff Management", desc: "Payroll & team" },
              { key: "show_customers", label: "Customers", desc: "Customer directory" },
              { key: "show_vouchers", label: "Vouchers", desc: "Create & manage vouchers" },
              { key: "show_payment_links", label: "Payment Links", desc: "Share payment links" },
              { key: "show_invoices", label: "Invoices", desc: "Create & send invoices" },
              { key: "show_capital", label: "Pata Capital", desc: "Business loans & funding" },
              { key: "show_mukuru", label: "Mukuru Transfer", desc: "International transfers" },
            ] as { key: keyof typeof dashPrefs; label: string; desc: string }[]).map(item => (
              <button
                key={item.key}
                onClick={() => setDashPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  dashPrefs[item.key]
                    ? "bg-primary/10 border-primary"
                    : "bg-muted border-border"
                }`}
              >
                <div className="text-left">
                  <p className={`font-medium text-sm ${dashPrefs[item.key] ? "text-primary" : "text-foreground"}`}>{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Checkbox checked={dashPrefs[item.key]} className="pointer-events-none" />
              </button>
            ))}
          </div>
        );

      case "theme":
        return (
          <div className="space-y-5">
            {/* Theme Mode - Light/Dark only */}
            <div>
              <p className="font-medium text-foreground mb-3">Appearance</p>
              <p className="text-sm text-muted-foreground mb-4">Choose between light and dark mode</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme === "dark" && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    theme === "light" ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center">
                    <Sun className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="font-medium text-foreground">Light</span>
                  {theme === "light" && <Check className="w-5 h-5 text-primary" />}
                </button>
                
                <button
                  onClick={() => theme === "light" && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                    theme === "dark" ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <Moon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="font-medium text-foreground">Dark</span>
                  {theme === "dark" && <Check className="w-5 h-5 text-primary" />}
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
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
              <DrawerTitle className="text-foreground">{title}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-24">
          {renderContent()}
        </div>

        {section !== "support" && section !== "devices" && section !== "customers" && section !== "theme" && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSettingsSheet;