import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Banknote
} from "lucide-react";

interface BusinessSetupFormProps {
  userId: string;
  onComplete: () => void;
}

type SetupStep = "business" | "address" | "operations" | "banking" | "logo" | "complete";

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

  // Form data
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  // New fields
  const [operatingHours, setOperatingHours] = useState("");
  const [currency, setCurrency] = useState("BWP");
  const [bankSetupOption, setBankSetupOption] = useState<"now" | "later" | null>(null);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const steps = [
    { key: "business", label: "Business Info", icon: Building2 },
    { key: "address", label: "Location", icon: MapPin },
    { key: "operations", label: "Operations", icon: Clock },
    { key: "banking", label: "Banking", icon: Banknote },
    { key: "logo", label: "Branding", icon: Upload },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

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

    setLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/logo.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("business-logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("business-logos")
        .getPublicUrl(fileName);

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
      if (!businessName.trim() || !businessType) {
        toast({
          title: "Required fields",
          description: "Please enter your business name and select a type.",
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
    } else if (currentStep === "logo") {
      setCurrentStep("banking");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          business_name: businessName.trim(),
          phone: contactPhone.trim() || null,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Business setup complete!",
        description: "Your merchant profile is ready. Welcome to Pata!",
      });

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

  const handleSkip = () => {
    toast({
      title: "Setup skipped",
      description: "You can complete your business profile later from Settings.",
    });
    onComplete();
  };

  if (currentStep === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-8">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <PataLogo className="h-5" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                index <= currentStepIndex 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  index < currentStepIndex ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-md mx-auto">
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
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="e.g., Mon-Fri 8:00 AM - 5:00 PM"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your regular business hours
                  </p>
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
                      <p className="text-sm text-success">Logo uploaded!</p>
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

      {/* Footer */}
      <footer className="px-6 pb-8 pt-4 border-t border-border">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep !== "business" && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            className="flex-1"
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : currentStep === "logo" ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default BusinessSetupForm;
