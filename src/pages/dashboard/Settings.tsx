import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Building2, Store, CreditCard, Receipt, Bell, Percent, ChevronRight, Save, Palette, Sun, Moon, LayoutGrid, Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type SettingsSection = "business" | "store" | "payments" | "tax" | "receipts" | "notifications" | "theme" | "dashboard";

const Settings = () => {
  const isMobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<SettingsSection>("business");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
  });
  const [storeSettings, setStoreSettings] = useState({ storeName: "Main Branch", operatingHours: "08:00 - 18:00", currency: "BWP", timezone: "Africa/Gaborone" });
  const [taxSettings, setTaxSettings] = useState({ vatEnabled: true, vatRate: "15", vatNumber: "4123456789", pricesIncludeVat: true });
  const [receiptSettings, setReceiptSettings] = useState({ showLogo: true, footerMessage: "Thank you for your business!", includeVatBreakdown: true, emailReceipts: true });
  const [notifications, setNotifications] = useState({ dailySummary: true, lowStock: true, newSale: false, payoutComplete: true });

  // Dashboard preferences
  const [dashPrefs, setDashPrefs] = useState({
    show_sell_products: true, show_transport: true, show_mobile_money: true,
    show_council_payments: true, show_devices: true, show_reports: true,
    show_staff: true, show_customers: true, show_vouchers: true,
    show_payment_links: true, show_invoices: true, show_capital: true, show_mukuru: true,
  });

  // Load dashboard preferences
  useEffect(() => {
    if (user) {
      supabase.from("dashboard_preferences").select("*").eq("user_id", user.id).single()
        .then(({ data }) => {
          if (data) {
            const { id, user_id, created_at, updated_at, ...prefs } = data;
            setDashPrefs(prefs as typeof dashPrefs);
          }
        });
    }
  }, [user]);

  // Pre-fill business info from saved profile
  useEffect(() => {
    if (userProfile) {
      setBusinessInfo({
        name: userProfile.business_name || "",
        registrationNumber: "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        address: "",
      });
    }
  }, [userProfile]);

  if (isMobile) { return <MobileDashboardHome />; }

  const sections = [
    { id: "business" as const, label: "Business Profile", icon: Building2 },
    { id: "store" as const, label: "Store Details", icon: Store },
    { id: "payments" as const, label: "Payment Methods", icon: CreditCard },
    { id: "tax" as const, label: "Tax / VAT", icon: Percent },
    { id: "receipts" as const, label: "Receipts", icon: Receipt },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "theme" as const, label: "Appearance", icon: Palette },
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutGrid },
  ];

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (activeSection === "business") {
        const { error } = await supabase
          .from("profiles")
          .update({
            business_name: businessInfo.name || null,
            email: businessInfo.email || null,
            phone: businessInfo.phone || null,
          })
          .eq("user_id", user.id);
        if (error) throw error;
        await refreshProfile();
      } else if (activeSection === "dashboard") {
        const { error } = await supabase
          .from("dashboard_preferences")
          .upsert({ user_id: user.id, ...dashPrefs }, { onConflict: "user_id" });
        if (error) throw error;
      }
      toast({ title: "Saved", description: "Settings updated successfully." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "business":
        return (
          <div className="space-y-6">
            <div className="space-y-2"><Label>Business Name</Label><Input value={businessInfo.name} onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Registration Number</Label><Input value={businessInfo.registrationNumber} onChange={(e) => setBusinessInfo({ ...businessInfo, registrationNumber: e.target.value })} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={businessInfo.email} onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={businessInfo.phone} onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Textarea value={businessInfo.address} onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })} rows={2} /></div>
          </div>
        );
      case "store":
        return (
          <div className="space-y-6">
            <div className="space-y-2"><Label>Store Name</Label><Input value={storeSettings.storeName} onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Operating Hours</Label><Input value={storeSettings.operatingHours} onChange={(e) => setStoreSettings({ ...storeSettings, operatingHours: e.target.value })} /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={storeSettings.currency} onValueChange={(v) => setStoreSettings({ ...storeSettings, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border border-border"><SelectItem value="BWP">BWP - Botswana Pula</SelectItem><SelectItem value="ZAR">ZAR - South African Rand</SelectItem><SelectItem value="USD">USD - US Dollar</SelectItem><SelectItem value="EUR">EUR - Euro</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={storeSettings.timezone} onValueChange={(v) => setStoreSettings({ ...storeSettings, timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border border-border"><SelectItem value="Africa/Gaborone">Africa/Gaborone (CAT)</SelectItem><SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "payments":
        return (
          <div className="space-y-4">
            {[
              { label: "Card Payments", desc: "Accept Visa, Mastercard, Amex", color: "bg-primary/20", iconColor: "text-primary" },
              { label: "Tap to Pay", desc: "NFC contactless payments", color: "bg-purple-500/20", iconColor: "text-purple-500" },
              { label: "Mobile Money", desc: "Orange Money, Smega, MyZaka", color: "bg-amber-500/20", iconColor: "text-amber-500" },
              { label: "Online Payments", desc: "Payment links & invoices", color: "bg-green-500/20", iconColor: "text-green-500" },
            ].map(item => (
              <div key={item.label} className="p-4 bg-muted rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}><CreditCard className={`w-5 h-5 ${item.iconColor}`} /></div>
                  <div><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                </div>
                <Switch checked={true} />
              </div>
            ))}
          </div>
        );
      case "tax":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Enable VAT</p><p className="text-sm text-muted-foreground">Apply VAT to transactions</p></div><Switch checked={taxSettings.vatEnabled} onCheckedChange={(v) => setTaxSettings({ ...taxSettings, vatEnabled: v })} /></div>
            {taxSettings.vatEnabled && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>VAT Rate (%)</Label><Input value={taxSettings.vatRate} onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: e.target.value })} /></div>
                  <div className="space-y-2"><Label>VAT Number</Label><Input value={taxSettings.vatNumber} onChange={(e) => setTaxSettings({ ...taxSettings, vatNumber: e.target.value })} /></div>
                </div>
                <div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Prices Include VAT</p><p className="text-sm text-muted-foreground">Product prices already include VAT</p></div><Switch checked={taxSettings.pricesIncludeVat} onCheckedChange={(v) => setTaxSettings({ ...taxSettings, pricesIncludeVat: v })} /></div>
              </>
            )}
          </div>
        );
      case "receipts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Show Logo on Receipt</p><p className="text-sm text-muted-foreground">Display your business logo</p></div><Switch checked={receiptSettings.showLogo} onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, showLogo: v })} /></div>
            <div className="space-y-2"><Label>Footer Message</Label><Input value={receiptSettings.footerMessage} onChange={(e) => setReceiptSettings({ ...receiptSettings, footerMessage: e.target.value })} placeholder="Thank you for your business!" /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Include VAT Breakdown</p><p className="text-sm text-muted-foreground">Show VAT amount separately</p></div><Switch checked={receiptSettings.includeVatBreakdown} onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, includeVatBreakdown: v })} /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium text-foreground">Email Receipts</p><p className="text-sm text-muted-foreground">Send receipts via email</p></div><Switch checked={receiptSettings.emailReceipts} onCheckedChange={(v) => setReceiptSettings({ ...receiptSettings, emailReceipts: v })} /></div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-4">
            {[
              { key: "dailySummary", label: "Daily Summary", desc: "Receive daily sales summary", val: notifications.dailySummary, set: (v: boolean) => setNotifications({ ...notifications, dailySummary: v }) },
              { key: "lowStock", label: "Low Stock Alerts", desc: "Get notified when stock is low", val: notifications.lowStock, set: (v: boolean) => setNotifications({ ...notifications, lowStock: v }) },
              { key: "newSale", label: "New Sale Notifications", desc: "Notify on every new sale", val: notifications.newSale, set: (v: boolean) => setNotifications({ ...notifications, newSale: v }) },
              { key: "payoutComplete", label: "Payout Complete", desc: "Notify when payout is processed", val: notifications.payoutComplete, set: (v: boolean) => setNotifications({ ...notifications, payoutComplete: v }) },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                <Switch checked={item.val} onCheckedChange={item.set} />
              </div>
            ))}
          </div>
        );
      case "theme":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                {theme === "light" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                <div><p className="font-medium text-foreground">Theme Mode</p><p className="text-sm text-muted-foreground">{theme === "light" ? "Light mode" : "Dark mode"}</p></div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>
        );
      case "dashboard":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Choose which features appear on your dashboard.</p>
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
              <button key={item.key} onClick={() => setDashPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${dashPrefs[item.key] ? "bg-primary/10 border-primary" : "bg-muted border-border"}`}>
                <div className="text-left">
                  <p className={`font-medium text-sm ${dashPrefs[item.key] ? "text-primary" : "text-foreground"}`}>{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Checkbox checked={dashPrefs[item.key]} className="pointer-events-none" />
              </button>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business preferences</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button key={section.id} onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${activeSection === section.id ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted border border-border"}`}>
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
              <ChevronRight className={`w-4 h-4 ml-auto ${activeSection === section.id ? "opacity-100" : "opacity-30"}`} />
            </button>
          ))}
        </div>

        <div className="flex-1 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">{sections.find(s => s.id === activeSection)?.label}</h2>
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
