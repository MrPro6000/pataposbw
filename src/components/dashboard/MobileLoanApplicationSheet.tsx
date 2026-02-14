import { useState } from "react";
import { X, Wallet, Building2, DollarSign, FileText, CheckCircle, ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import orangeMoneyImg from "@/assets/mobile-money/orange-money.png";
import smegaImg from "@/assets/mobile-money/smega.png";
import myzakaImg from "@/assets/mobile-money/myzaka.png";
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
import { supabase } from "@/integrations/supabase/client";

interface MobileLoanApplicationSheetProps {
  open: boolean;
  onClose: () => void;
}

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", img: orangeMoneyImg },
  { id: "smega", name: "Smega", img: smegaImg },
  { id: "myzaka", name: "MyZaka", img: myzakaImg },
];

const loanPurposes = [
  "Working capital",
  "Equipment purchase",
  "Inventory",
  "Business expansion",
  "Marketing",
  "Other",
];

const businessTypes = [
  "Retail",
  "Food & Beverage",
  "Services",
  "Manufacturing",
  "Technology",
  "Other",
];

const MobileLoanApplicationSheet = ({ open, onClose }: MobileLoanApplicationSheetProps) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const loanAmountNum = parseFloat(loanAmount) || 0;
  const monthlyRevenueNum = parseFloat(monthlyRevenue) || 0;
  const interestRate = 0.15;
  const termMonths = 12;
  const monthlyPayment = loanAmountNum > 0 
    ? (loanAmountNum * (1 + interestRate)) / termMonths 
    : 0;

  const resetForm = () => {
    setLoanAmount("");
    setPurpose("");
    setBusinessName("");
    setBusinessType("");
    setMonthlyRevenue("");
    setYearsInBusiness("");
    setMobileMoneyProvider("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = loanAmount && loanAmountNum >= 1000 && loanAmountNum <= 500000 && purpose && businessName.trim() && businessType && monthlyRevenue && monthlyRevenueNum > 0 && yearsInBusiness && mobileMoneyProvider;

  const handleSubmitApplication = async () => {
    if (!isFormValid) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Error", description: "Please log in to apply for a loan", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from("loan_applications").insert({
        user_id: user.id,
        amount: loanAmountNum,
        purpose,
        business_name: businessName.trim(),
        business_type: businessType,
        monthly_revenue: monthlyRevenueNum,
        years_in_business: parseInt(yearsInBusiness),
        status: "pending",
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({ title: "Application Submitted", description: "We'll review your application within 24 hours" });
    } catch (error) {
      console.error("Loan application error:", error);
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DrawerContent className="bg-background h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-foreground">Loan Application</DrawerTitle>
                <p className="text-xs text-muted-foreground">Pata Capital</p>
              </div>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Application Submitted!</p>
              <p className="text-muted-foreground text-center mb-6">
                We'll review your application and get back to you within 24 hours.
              </p>
              <div className="w-full bg-muted rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-muted-foreground">Requested Amount</p>
                <p className="text-2xl font-bold text-foreground">P{loanAmountNum.toLocaleString()}</p>
              </div>
              <Button onClick={handleClose} className="w-full h-12">Done</Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Loan Amount */}
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="text-foreground font-semibold">Loan Amount (BWP) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">P</span>
                  <Input
                    id="loanAmount"
                    type="number"
                    inputMode="numeric"
                    placeholder="0.00"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-8 h-14 text-2xl font-bold bg-muted border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Min: P1,000 • Max: P500,000</p>
              </div>

              {/* Estimated Monthly Payment */}
              {loanAmountNum > 0 && (
                <div className="bg-muted rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interest rate</span>
                    <span className="text-foreground">15% per annum</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Repayment term</span>
                    <span className="text-foreground">12 months</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-muted-foreground">Est. monthly payment</span>
                    <span className="font-bold text-foreground text-lg">P{monthlyPayment.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Loan Purpose */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Loan Purpose *</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="h-12 bg-muted border-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <SelectValue placeholder="What will you use this loan for?" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {loanPurposes.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-foreground font-semibold">Business Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10 h-12 bg-muted border-0"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Business Type *</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="h-12 bg-muted border-0">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {businessTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly Revenue */}
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue" className="text-foreground font-semibold">Average Monthly Revenue (BWP) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">P</span>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    inputMode="numeric"
                    placeholder="0.00"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    className="pl-8 h-12 bg-muted border-0"
                  />
                </div>
              </div>

              {/* Years in Business */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Years in Business *</Label>
                <Select value={yearsInBusiness} onValueChange={setYearsInBusiness}>
                  <SelectTrigger className="h-12 bg-muted border-0">
                    <SelectValue placeholder="How long have you been in business?" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="0">Less than 1 year</SelectItem>
                    <SelectItem value="1">1-2 years</SelectItem>
                    <SelectItem value="3">3-5 years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Money Provider */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Preferred Mobile Money Provider *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {mobileMoneyProviders.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => setMobileMoneyProvider(provider.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        mobileMoneyProvider === provider.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted"
                      }`}
                    >
                      <img src={provider.img} alt={provider.name} className="w-10 h-10 rounded-lg object-contain" />
                      <span className="text-xs font-medium text-foreground">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms notice */}
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  By submitting, you agree to our terms and authorize us to verify your business information.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitApplication}
                className="w-full h-14 font-semibold text-lg"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileLoanApplicationSheet;
