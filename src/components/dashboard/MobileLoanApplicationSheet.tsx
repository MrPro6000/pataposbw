import { useState } from "react";
import { X, Wallet, Building2, DollarSign, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";

interface MobileLoanApplicationSheetProps {
  open: boolean;
  onClose: () => void;
}

type Step = "amount" | "business" | "review" | "submitting" | "success";

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
  const [step, setStep] = useState<Step>("amount");
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const loanAmountNum = parseFloat(loanAmount) || 0;
  const monthlyRevenueNum = parseFloat(monthlyRevenue) || 0;
  
  // Simple loan calculator
  const interestRate = 0.15; // 15% annual
  const termMonths = 12;
  const monthlyPayment = loanAmountNum > 0 
    ? (loanAmountNum * (1 + interestRate)) / termMonths 
    : 0;

  const resetForm = () => {
    setStep("amount");
    setLoanAmount("");
    setPurpose("");
    setBusinessName("");
    setBusinessType("");
    setMonthlyRevenue("");
    setYearsInBusiness("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateAmount = () => {
    if (!loanAmount || loanAmountNum <= 0) {
      toast({ title: "Error", description: "Please enter a valid loan amount", variant: "destructive" });
      return false;
    }
    if (loanAmountNum < 1000) {
      toast({ title: "Error", description: "Minimum loan amount is P1,000", variant: "destructive" });
      return false;
    }
    if (loanAmountNum > 500000) {
      toast({ title: "Error", description: "Maximum loan amount is P500,000", variant: "destructive" });
      return false;
    }
    if (!purpose) {
      toast({ title: "Error", description: "Please select loan purpose", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateBusiness = () => {
    if (!businessName.trim()) {
      toast({ title: "Error", description: "Please enter business name", variant: "destructive" });
      return false;
    }
    if (!businessType) {
      toast({ title: "Error", description: "Please select business type", variant: "destructive" });
      return false;
    }
    if (!monthlyRevenue || monthlyRevenueNum <= 0) {
      toast({ title: "Error", description: "Please enter monthly revenue", variant: "destructive" });
      return false;
    }
    if (!yearsInBusiness) {
      toast({ title: "Error", description: "Please select years in business", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleContinueAmount = () => {
    if (validateAmount()) {
      setStep("business");
    }
  };

  const handleContinueBusiness = () => {
    if (validateBusiness()) {
      setStep("review");
    }
  };

  const handleSubmitApplication = async () => {
    setStep("submitting");
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: "Error", description: "Please log in to apply for a loan", variant: "destructive" });
        setStep("amount");
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

      setStep("success");
      toast({ title: "Application Submitted", description: "We'll review your application within 24 hours" });
    } catch (error) {
      console.error("Loan application error:", error);
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
      setStep("review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-foreground">
                  {step === "amount" && "Loan Amount"}
                  {step === "business" && "Business Details"}
                  {step === "review" && "Review Application"}
                  {step === "submitting" && "Submitting..."}
                  {step === "success" && "Application Sent!"}
                </DrawerTitle>
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
          {/* AMOUNT STEP */}
          {step === "amount" && (
            <div className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">How much do you need?</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-foreground">Loan Amount (BWP)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">P</span>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="0.00"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="pl-8 h-14 text-2xl font-bold bg-muted border-0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Min: P1,000 • Max: P500,000</p>
                </div>

                {loanAmountNum > 0 && (
                  <div className="bg-muted rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Interest rate</span>
                      <span className="text-foreground">15% per annum</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Repayment term</span>
                      <span className="text-foreground">12 months</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-muted-foreground">Est. monthly payment</span>
                      <span className="font-bold text-foreground text-lg">
                        P{monthlyPayment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-foreground">Loan Purpose</Label>
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
              </div>

              <Button
                onClick={handleContinueAmount}
                className="w-full h-14 font-semibold text-lg"
                disabled={!loanAmount || !purpose}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* BUSINESS STEP */}
          {step === "business" && (
            <div className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Tell us about your business</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-foreground">Business Name</Label>
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

                <div className="space-y-2">
                  <Label className="text-foreground">Business Type</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue" className="text-foreground">Average Monthly Revenue (BWP)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">P</span>
                    <Input
                      id="monthlyRevenue"
                      type="number"
                      placeholder="0.00"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="pl-8 h-12 bg-muted border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Years in Business</Label>
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
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("amount")}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinueBusiness}
                  className="flex-1 h-12 font-semibold"
                  disabled={!businessName || !businessType || !monthlyRevenue || !yearsInBusiness}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === "review" && (
            <div className="space-y-5">
              <div className="bg-muted rounded-2xl p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Loan Request</p>
                <p className="text-4xl font-bold text-foreground">P{loanAmountNum.toLocaleString()}</p>
                <p className="text-muted-foreground mt-1">over 12 months</p>
              </div>

              <div className="bg-card rounded-2xl border border-border divide-y divide-border">
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-medium text-foreground">{purpose}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Business</span>
                  <span className="font-medium text-foreground">{businessName}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Business Type</span>
                  <span className="font-medium text-foreground">{businessType}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-muted-foreground">Monthly Revenue</span>
                  <span className="font-medium text-foreground">P{monthlyRevenueNum.toLocaleString()}</span>
                </div>
                <div className="p-4 flex justify-between bg-muted/50">
                  <span className="font-semibold text-foreground">Est. Monthly Payment</span>
                  <span className="font-bold text-foreground text-lg">P{monthlyPayment.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our terms and authorize us to verify your business information.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("business")}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  className="flex-1 h-12 font-semibold"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          )}

          {/* SUBMITTING STEP */}
          {step === "submitting" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-xl font-semibold text-foreground">Submitting Application...</p>
              <p className="text-muted-foreground mt-2">Please wait</p>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === "success" && (
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

              <Button onClick={handleClose} className="w-full h-12">
                Done
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileLoanApplicationSheet;
