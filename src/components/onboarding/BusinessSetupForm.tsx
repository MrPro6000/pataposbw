import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PataLogo from "@/components/PataLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  CheckCircle,
  Briefcase,
  Clock,
  CreditCard,
  Banknote,
  LayoutGrid
} from "lucide-react";

interface BusinessSetupFormProps {
  userId: string;
  onComplete: () => void;
}

type SetupStep = "business" | "address" | "operations" | "banking" | "personalize" | "logo" | "complete";

const businessTypes = [
  "Retail Store",
  "Restaurant / Cafe",
  "Professional Services",
  "Healthcare",
  "Beauty & Wellness",
  "Transportation",
  "Construction",
  "Agriculture",
  "Manufacturing",
  "Other",
];

const currencies = [
  { code: "BWP", name: "Botswana Pula (P)" },
  { code: "ZAR", name: "South African Rand (R)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
];

const BusinessSetupForm = ({ userId, onComplete }: BusinessSetupFormProps) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>("business");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { refreshProfile } = useAuth();

  const handleLogoBack = () => {
    if (!isMobile) return;
    if (currentStep === "business") { navigate(-1); return; }
    handleBack();
  };

  // Form data
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  // Operations fields
  const [operatingHoursOpen, setOperatingHoursOpen] = useState("08:00");
  const [operatingHoursClose, setOperatingHoursClose] = useState("17:00");
  const [operatingDays, setOperatingDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [currency, setCurrency] = useState("BWP");
  
  // Banking fields
  const [bankSetupOption, setBankSetupOption] = useState<"now" | "later" | null>(null);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  
  // Terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Dashboard personalization
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

  const steps = [
    { key: "business", label: "Business Info", icon: Building2 },
    { key: "address", label: "Location", icon: MapPin },
    { key: "operations", label: "Operations", icon: Clock },
    { key: "banking", label: "Banking", icon: Banknote },
    { key: "personalize", label: "Dashboard", icon: LayoutGrid },
    { key: "logo", label: "Branding", icon: Upload },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    if (operatingDays.includes(day)) {
      setOperatingDays(operatingDays.filter(d => d !== day));
    } else {
      setOperatingDays([...operatingDays, day]);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/logo_${Date.now()}.${ext}`;
      console.log("Uploading logo to path:", filePath, "userId:", userId);
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("Logo upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast({
        title: "Logo uploaded",
        description: "Your business logo has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload logo. You can add it later from settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === "business") {
      if (!fullName.trim() || !businessName.trim() || !businessType) {
        toast({
          title: "Required fields",
          description: "Please enter your name, business name, and select a type.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("address");
    } else if (currentStep === "address") {
      setCurrentStep("operations");
    } else if (currentStep === "operations") {
      if (!currency) {
        toast({
          title: "Required field",
          description: "Please select your preferred currency.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("banking");
    } else if (currentStep === "banking") {
      if (!bankSetupOption) {
        toast({
          title: "Required selection",
          description: "Please choose whether to set up banking now or later.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep("personalize");
    } else if (currentStep === "personalize") {
      setCurrentStep("logo");
    } else if (currentStep === "logo") {
      if (!termsAccepted) {
        toast({
          title: "Terms Required",
          description: "You must accept the Terms and Conditions to continue.",
          variant: "destructive",
        });
        return;
      }
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === "address") {
      setCurrentStep("business");
    } else if (currentStep === "operations") {
      setCurrentStep("address");
    } else if (currentStep === "banking") {
      setCurrentStep("operations");
    } else if (currentStep === "personalize") {
      setCurrentStep("banking");
    } else if (currentStep === "logo") {
      setCurrentStep("personalize");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const businessData = {
        businessName: businessName.trim(),
        businessType: businessType === "Other" && customBusinessType.trim() ? customBusinessType.trim() : businessType,
        registrationNumber: registrationNumber.trim() || undefined,
        address: businessAddress.trim(),
        city: city.trim(),
        country: "Botswana",
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        logoUrl: logoUrl || undefined,
        operatingHours: {
          open: operatingHoursOpen,
          close: operatingHoursClose,
          days: operatingDays,
        },
        currency,
        bankDetails: bankSetupOption === "now" ? {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          branchCode: branchCode.trim(),
          accountHolder: accountHolder.trim(),
        } : undefined,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
      };

      // Save business profile to Supabase profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || undefined,
          business_name: businessData.businessName,
          phone: businessData.contactPhone ? `+267${businessData.contactPhone}` : undefined,
          email: businessData.contactEmail || undefined,
          avatar_url: businessData.logoUrl || undefined,
        })
        .eq("user_id", userId);

      if (error) throw new Error(error.message);

      // Save dashboard preferences
      await supabase
        .from("dashboard_preferences")
        .upsert({ user_id: userId, ...dashPrefs }, { onConflict: "user_id" });

      toast({
        title: "Business setup complete!",
        description: "Your merchant profile is ready. Welcome to Pata!",
      });

      // Refresh auth context so ProtectedRoute sees the updated business_name
      await refreshProfile();

      setCurrentStep("complete");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save business details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // No skip — onboarding is mandatory

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're all set!</h1>
          <p className="text-muted-foreground mb-4">
            Taking you to your dashboard...
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <button
          onClick={handleLogoBack}
          className={isMobile ? "cursor-pointer active:opacity-70 transition-opacity" : "cursor-default"}
          aria-label="Go back"
        >
          <PataLogo className="h-5" />
        </button>
        <ThemeToggle />
      </header>

      {/* Progress Steps — icon-only on mobile, compact */}
      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-center gap-1 max-w-md mx-auto overflow-x-auto">
          {steps.map((step, index) => {
            const isPast = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isClickable = index < currentStepIndex;
            return (
              <div key={step.key} className="flex items-center shrink-0">
                <button
                  disabled={!isClickable}
                  onClick={() => {
                    if (isClickable) {
                      const stepKeys: SetupStep[] = ["business", "address", "operations", "banking", "personalize", "logo"];
                      setCurrentStep(stepKeys[index]);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isPast
                      ? "bg-primary/15 text-primary cursor-pointer hover:bg-primary/25"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-4 h-0.5 mx-0.5 shrink-0 ${
                    index < currentStepIndex ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        {/* Step counter for mobile */}
        <p className="text-center text-xs text-muted-foreground mt-1.5">
          Step {currentStepIndex + 1} of {steps.length} — {steps[currentStepIndex]?.label}
        </p>
      </div>

      {/* Main Content — scrollable, padded so content doesn't hide behind fixed footer */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-md mx-auto px-4 py-6 pb-28">
          {currentStep === "business" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Tell us about your business
                </h1>
                <p className="text-muted-foreground">
                  This helps us customize Pata for your needs
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Your Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Kabo Mosweu"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Business Type *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setBusinessType(type)}
                        className={`p-3 rounded-xl text-sm text-left border transition-all ${
                          businessType === type
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {businessType === "Other" && (
                    <Input
                      value={customBusinessType}
                      onChange={(e) => setCustomBusinessType(e.target.value)}
                      placeholder="Enter your business type"
                      className="mt-3"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="regNumber">Registration Number (Optional)</Label>
                  <Input
                    id="regNumber"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g., BW12345678"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your company or business registration number
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "address" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Where's your business located?
                </h1>
                <p className="text-muted-foreground">
                  Your address appears on invoices and receipts
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Street address, building number, etc."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City / Town</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Gaborone"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="business@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Business Phone</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      +267
                    </span>
                    <Input
                      id="phone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder="71234567"
                      className="pl-14"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "operations" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Business Operations
                </h1>
                <p className="text-muted-foreground">
                  Tell us about your operating schedule and currency
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Operating Hours</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Opens</Label>
                      <Input
                        type="time"
                        value={operatingHoursOpen}
                        onChange={(e) => setOperatingHoursOpen(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Closes</Label>
                      <Input
                        type="time"
                        value={operatingHoursClose}
                        onChange={(e) => setOperatingHoursClose(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Operating Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          operatingDays.includes(day)
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Currency *</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((cur) => (
                        <SelectItem key={cur.code} value={cur.code}>
                          {cur.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary currency for your transactions
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "banking" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-cyan-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Bank Account Setup
                </h1>
                <p className="text-muted-foreground">
                  Where should we send your payouts?
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBankSetupOption("now")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      bankSetupOption === "now"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium text-sm">Add Now</p>
                  </button>
                  <button
                    onClick={() => setBankSetupOption("later")}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      bankSetupOption === "later"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-foreground hover:border-primary/50"
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium text-sm">Connect Later</p>
                  </button>
                </div>

                {bankSetupOption === "now" && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g., First National Bank"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolder">Account Holder Name</Label>
                      <Input
                        id="accountHolder"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Name on the account"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter account number"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="branchCode">Branch Code</Label>
                      <Input
                        id="branchCode"
                        value={branchCode}
                        onChange={(e) => setBranchCode(e.target.value)}
                        placeholder="e.g., 260050"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {bankSetupOption === "later" && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    You can add your bank account from Settings anytime.
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === "personalize" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Personalise your dashboard
                </h1>
                <p className="text-muted-foreground">
                  Choose the features you need. You can change these later in Settings.
                </p>
              </div>

              <div className="space-y-3">
                {([
                  { key: "show_sell_products", label: "Sell Products", desc: "POS, food, beverages, retail" },
                  { key: "show_transport", label: "Transport", desc: "Combi, taxi, bus fares" },
                  { key: "show_mobile_money", label: "Mobile Money", desc: "Orange, Smega, MyZaka" },
                  { key: "show_council_payments", label: "Council Payments", desc: "Rates, levies, licences" },
                  { key: "show_devices", label: "Pata Devices", desc: "Card machines & terminals" },
                  { key: "show_reports", label: "Reports", desc: "Sales analytics & insights" },
                  { key: "show_staff", label: "Staff Management", desc: "Payroll & team management" },
                  { key: "show_customers", label: "Customers", desc: "Customer directory & CRM" },
                  { key: "show_vouchers", label: "Vouchers", desc: "Create & manage vouchers" },
                  { key: "show_payment_links", label: "Payment Links", desc: "Share payment links" },
                  { key: "show_invoices", label: "Invoices", desc: "Create & send invoices" },
                  { key: "show_capital", label: "Pata Capital", desc: "Business loans & funding" },
                  { key: "show_mukuru", label: "Mukuru Transfer", desc: "International money transfers" },
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
            </div>
          )}

          {currentStep === "logo" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Add your logo
                </h1>
                <p className="text-muted-foreground">
                  Your logo appears on invoices, receipts, and the dashboard
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
                  {logoUrl ? (
                    <div className="space-y-4">
                      <img
                        src={logoUrl}
                        alt="Business logo"
                        className="w-24 h-24 object-contain mx-auto rounded-xl"
                      />
                      <p className="text-sm text-green-500">Logo uploaded!</p>
                      <label className="inline-block cursor-pointer">
                        <span className="text-sm text-primary hover:underline">
                          Change logo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-foreground font-medium mb-1">
                        Tap to upload your logo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  You can skip this step and add a logo later from Settings
                </p>

                {/* Terms and Conditions */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms and Conditions</a>
                      {" "}and{" "}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                      , and agree to join PATA as a merchant.
                    </label>
                  </div>
                  {!termsAccepted && (
                    <p className="text-xs text-destructive mt-2 ml-7">
                      * Required to complete setup
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating navigation — Back pill on left, Continue FAB on right */}
      {currentStep !== "business" && (
        <button
          onClick={handleBack}
          disabled={loading}
          className="fixed bottom-[max(env(safe-area-inset-bottom,24px),24px)] left-5 z-30 flex items-center gap-1.5 bg-background/90 backdrop-blur border border-border text-foreground shadow-lg rounded-full px-4 h-12 text-sm font-medium active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {currentStep === "logo" && !logoUrl && (
        <button
          onClick={() => {
            if (!termsAccepted) {
              toast({
                title: "Terms Required",
                description: "You must accept the Terms and Conditions to continue.",
                variant: "destructive",
              });
              return;
            }
            handleSubmit();
          }}
          disabled={loading}
          className="fixed bottom-[max(env(safe-area-inset-bottom,24px),24px)] left-1/2 -translate-x-1/2 z-30 bg-background/90 backdrop-blur border border-border text-muted-foreground shadow-lg rounded-full px-4 h-12 text-sm font-medium active:scale-95 transition-transform"
        >
          Skip Logo
        </button>
      )}

      {/* Continue / Complete — floating FAB, bottom-right */}
      <button
        onClick={handleNext}
        disabled={loading}
        className="fixed bottom-[max(env(safe-area-inset-bottom,24px),24px)] right-5 z-30 flex items-center gap-2 bg-primary text-primary-foreground shadow-xl rounded-full px-5 h-12 text-sm font-semibold active:scale-95 transition-transform"
      >
        {loading ? (
          "Saving..."
        ) : currentStep === "logo" ? (
          <>
            Complete Setup
            <CheckCircle className="w-4 h-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default BusinessSetupForm;

