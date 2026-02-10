import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Building2, Store, CreditCard, Receipt, Bell, Percent, ChevronRight, Save, Palette, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SettingsSection = "business" | "store" | "payments" | "tax" | "receipts" | "notifications" | "theme";

const Settings = () => {
  const isMobile = useIsMobile();
  const { theme, toggleTheme, colors, setColors, colorPresets } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>("business");
  
  const [businessInfo, setBusinessInfo] = useState({ name: "Pata Business (Pty) Ltd", registrationNumber: "2025/123456/07", email: "info@patabusiness.com", phone: "+27 11 123 4567", address: "123 Main Street, Sandton, Johannesburg, 2196" });
  const [storeSettings, setStoreSettings] = useState({ storeName: "Main Branch", operatingHours: "08:00 - 18:00", currency: "ZAR", timezone: "Africa/Johannesburg" });
  const [taxSettings, setTaxSettings] = useState({ vatEnabled: true, vatRate: "15", vatNumber: "4123456789", pricesIncludeVat: true });
  const [receiptSettings, setReceiptSettings] = useState({ showLogo: true, footerMessage: "Thank you for your business!", includeVatBreakdown: true, emailReceipts: true });
  const [notifications, setNotifications] = useState({ dailySummary: true, lowStock: true, newSale: false, payoutComplete: true });

  if (isMobile) { return <MobileDashboardHome />; }

  const sections = [
    { id: "business" as const, label: "Business Profile", icon: Building2 },
    { id: "store" as const, label: "Store Details", icon: Store },
    { id: "payments" as const, label: "Payment Methods", icon: CreditCard },
    { id: "tax" as const, label: "Tax / VAT", icon: Percent },
    { id: "receipts" as const, label: "Receipts", icon: Receipt },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "theme" as const, label: "Appearance", icon: Palette },
  ];

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
                  <SelectContent className="bg-popover border border-border"><SelectItem value="ZAR">ZAR - South African Rand</SelectItem><SelectItem value="USD">USD - US Dollar</SelectItem><SelectItem value="EUR">EUR - Euro</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={storeSettings.timezone} onValueChange={(v) => setStoreSettings({ ...storeSettings, timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border border-border"><SelectItem value="Africa/Johannesburg">Africa/Johannesburg (SAST)</SelectItem><SelectItem value="UTC">UTC</SelectItem></SelectContent>
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
            <div>
              <h3 className="font-medium text-foreground mb-4">Accent Color</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose a color theme for your dashboard</p>
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((preset) => {
                  const isSelected = colors.primary === preset.primary;
                  const hslMatch = preset.primary.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
                  const bgColor = hslMatch ? `hsl(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%)` : '#0066FF';
                  return (
                    <button key={preset.name} onClick={() => setColors({ primary: preset.primary, accent: preset.accent })}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${isSelected ? "border-primary" : "border-border"}`}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-medium text-foreground">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-3">Preview</p>
              <div className="flex gap-3">
                <Button className="text-white" style={{ backgroundColor: `hsl(${colors.primary})` }}>Primary Button</Button>
                <Button variant="outline">Secondary Button</Button>
              </div>
            </div>
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
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
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
