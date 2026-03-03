import { useState } from "react";
import { X, Wallet, Building2, DollarSign, FileText, CheckCircle, ArrowRight, Smartphone, Calendar, Percent, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

type RepaymentType = "full" | "percentage" | "custom";
type RepaymentFrequency = "daily" | "weekly" | "monthly";

const MobileLoanApplicationSheet = ({ open, onClose }: MobileLoanApplicationSheetProps) => {
  // Business info
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("");

  // Repayment plan
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("monthly" as any);
  const [repaymentFrequency, setRepaymentFrequency] = useState<RepaymentFrequency>("monthly");
  const [repaymentPercentage, setRepaymentPercentage] = useState(10); // % of revenue
  const [customRepaymentAmount, setCustomRepaymentAmount] = useState("");
  const [repaymentDuration, setRepaymentDuration] = useState(""); // in months

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const loanAmountNum = parseFloat(loanAmount) || 0;
  const monthlyRevenueNum = parseFloat(monthlyRevenue) || 0;
  const interestRate = 0.15;
  const durationMonths = parseInt(repaymentDuration) || 12;
  const totalRepayable = loanAmountNum * (1 + interestRate);

  // Compute estimated payment based on repayment type
  const computedPayment = () => {
    if (loanAmountNum <= 0) return 0;
    if (repaymentType === "full") return totalRepayable;
    if (repaymentType === "percentage") {
      const perMonth = (monthlyRevenueNum * repaymentPercentage) / 100;
      return perMonth;
    }
    if (repaymentType === "custom") return parseFloat(customRepaymentAmount) || 0;
    return 0;
  };

  const estimatedMonths = () => {
    const payment = computedPayment();
    if (repaymentType === "full") return 1;
    if (repaymentType === "custom" && repaymentDuration) return parseInt(repaymentDuration);
    if (payment > 0 && loanAmountNum > 0) {
      const months = Math.ceil(totalRepayable / (repaymentFrequency === "daily" ? payment * 30 : repaymentFrequency === "weekly" ? payment * 4.3 : payment));
      return months;
    }
    return null;
  };

  const resetForm = () => {
    setLoanAmount(""); setPurpose(""); setBusinessName(""); setBusinessType("");
    setMonthlyRevenue(""); setYearsInBusiness(""); setMobileMoneyProvider("");
    setRepaymentType("monthly" as any); setRepaymentFrequency("monthly");
    setRepaymentPercentage(10); setCustomRepaymentAmount(""); setRepaymentDuration("");
    setIsSuccess(false);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const isRepaymentValid = () => {
    if (repaymentType === "full") return true;
    if (repaymentType === "percentage") return repaymentPercentage > 0 && monthlyRevenueNum > 0;
    if (repaymentType === "custom") return parseFloat(customRepaymentAmount) > 0 && parseInt(repaymentDuration) > 0;
    return false;
  };

  const isFormValid = loanAmount && loanAmountNum >= 1000 && loanAmountNum <= 500000
    && purpose && businessName.trim() && businessType
    && monthlyRevenue && monthlyRevenueNum > 0
    && yearsInBusiness && mobileMoneyProvider
    && isRepaymentValid();

  const handleSubmitApplication = async () => {
    if (!isFormValid) {
      toast({ title: "Incomplete form", description: "Please fill in all required fields including your repayment plan.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Error", description: "Please log in to apply for a loan", variant: "destructive" });
        return;
      }

      const repaymentPlanNote = repaymentType === "full"
        ? "Pay full amount at once"
        : repaymentType === "percentage"
        ? `Pay ${repaymentPercentage}% of monthly revenue (${repaymentFrequency}) — est. P${computedPayment().toFixed(2)} per period`
        : `Custom: P${customRepaymentAmount} every ${repaymentFrequency} for ${repaymentDuration} months`;

      const { error } = await supabase.from("loan_applications").insert({
        user_id: user.id,
        amount: loanAmountNum,
        purpose: `${purpose} | Repayment plan: ${repaymentPlanNote} | Provider: ${mobileMoneyProvider}`,
        business_name: businessName.trim(),
        business_type: businessType,
        monthly_revenue: monthlyRevenueNum,
        years_in_business: parseInt(yearsInBusiness),
        status: "pending",
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({ title: "Application Submitted!", description: "Our team will review and contact you within 24 hours." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const repaymentTypeOptions: { id: RepaymentType; label: string; desc: string; icon: typeof CreditCard }[] = [
    { id: "full", label: "Pay in Full", desc: "Single payment of total amount + interest", icon: CreditCard },
    { id: "percentage", label: "% of Revenue", desc: "A % of your monthly revenue each period", icon: Percent },
    { id: "custom", label: "Custom Amount", desc: "You decide how much & how long", icon: Calendar },
  ];

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && handleClose()} dismissible={false}>
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

        <div className="flex-1 overflow-y-auto p-4 pb-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Application Submitted!</p>
              <p className="text-muted-foreground text-center mb-6">
                Our team will review your application and repayment plan, then contact you within 24 hours.
              </p>
              <div className="w-full bg-muted rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Requested Amount</span>
                  <span className="font-bold text-foreground">P{loanAmountNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Repayable (15% p.a.)</span>
                  <span className="font-bold text-foreground">P{totalRepayable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Repayment Plan</span>
                  <span className="font-semibold text-foreground capitalize">
                    {repaymentType === "full" ? "Full payment" : repaymentType === "percentage" ? `${repaymentPercentage}% of revenue` : "Custom"}
                  </span>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full h-12">Done</Button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── Loan Amount ── */}
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Loan Amount (BWP) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">P</span>
                  <Input
                    type="number" inputMode="numeric" placeholder="0.00"
                    value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
                    className="pl-8 h-14 text-2xl font-bold bg-muted border-0"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Min: P1,000 · Max: P500,000</p>
              </div>

              {/* Interest summary */}
              {loanAmountNum >= 1000 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Interest (15% p.a.)</span>
                    <span className="text-foreground">P{(loanAmountNum * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Repayable</span>
                    <span className="text-amber-600 dark:text-amber-400">P{totalRepayable.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* ── REPAYMENT PLAN ── */}
              <div className="space-y-3">
                <Label className="text-foreground font-semibold">Your Repayment Plan *</Label>
                <p className="text-xs text-muted-foreground -mt-1">Choose how you want to repay this loan. You cannot proceed without this.</p>

                <div className="grid grid-cols-1 gap-2">
                  {repaymentTypeOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRepaymentType(opt.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        repaymentType === opt.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        repaymentType === opt.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                      }`}>
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Full — no extra fields needed, just show total */}
                {repaymentType === "full" && loanAmountNum > 0 && (
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">You will repay the full amount of <span className="font-bold text-foreground">P{totalRepayable.toFixed(2)}</span> in a single payment once the loan is disbursed and terms are agreed.</p>
                  </div>
                )}

                {/* Percentage of revenue */}
                {repaymentType === "percentage" && (
                  <div className="space-y-4 bg-muted rounded-xl p-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-foreground font-medium">% of your revenue per period</Label>
                        <span className="text-lg font-bold text-primary">{repaymentPercentage}%</span>
                      </div>
                      <Slider
                        min={1} max={50} step={1}
                        value={[repaymentPercentage]}
                        onValueChange={([v]) => setRepaymentPercentage(v)}
                        className="my-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1%</span><span>25%</span><span>50%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Payment Frequency *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["daily", "weekly", "monthly"] as RepaymentFrequency[]).map(f => (
                          <button key={f} type="button"
                            onClick={() => setRepaymentFrequency(f)}
                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                              repaymentFrequency === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                            }`}
                          >{f}</button>
                        ))}
                      </div>
                    </div>

                    {monthlyRevenueNum > 0 && (
                      <div className="bg-card rounded-lg p-3 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. {repaymentFrequency} payment</span>
                          <span className="font-bold text-foreground">
                            P{(
                              repaymentFrequency === "monthly" ? (monthlyRevenueNum * repaymentPercentage / 100) :
                              repaymentFrequency === "weekly" ? (monthlyRevenueNum * repaymentPercentage / 100 / 4.3) :
                              (monthlyRevenueNum * repaymentPercentage / 100 / 30)
                            ).toFixed(2)}
                          </span>
                        </div>
                        {estimatedMonths() && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. payoff time</span>
                            <span className="font-semibold text-foreground">{estimatedMonths()} months</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom amount */}
                {repaymentType === "custom" && (
                  <div className="space-y-4 bg-muted rounded-xl p-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">How much will you pay each time? *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">P</span>
                        <Input
                          type="number" inputMode="numeric" placeholder="0.00"
                          value={customRepaymentAmount} onChange={(e) => setCustomRepaymentAmount(e.target.value)}
                          className="pl-8 h-12 bg-card border-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Payment Frequency *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["daily", "weekly", "monthly"] as RepaymentFrequency[]).map(f => (
                          <button key={f} type="button"
                            onClick={() => setRepaymentFrequency(f)}
                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                              repaymentFrequency === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                            }`}
                          >{f}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">How many months to fully repay? *</Label>
                      <Input
                        type="number" inputMode="numeric" placeholder="e.g. 12"
                        value={repaymentDuration} onChange={(e) => setRepaymentDuration(e.target.value)}
                        className="h-12 bg-card border-0"
                      />
                    </div>

                    {parseFloat(customRepaymentAmount) > 0 && parseInt(repaymentDuration) > 0 && (
                      <div className="bg-card rounded-lg p-3 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment per {repaymentFrequency}</span>
                          <span className="font-bold text-foreground">P{parseFloat(customRepaymentAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-semibold text-foreground">{repaymentDuration} months</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-1">
                          <span className="text-muted-foreground">Total paid</span>
                          <span className={`font-bold ${parseFloat(customRepaymentAmount) * parseInt(repaymentDuration) * (repaymentFrequency === "monthly" ? 1 : repaymentFrequency === "weekly" ? 4.3 : 30) >= totalRepayable ? "text-green-600" : "text-destructive"}`}>
                            P{(parseFloat(customRepaymentAmount) * parseInt(repaymentDuration) * (repaymentFrequency === "monthly" ? 1 : repaymentFrequency === "weekly" ? 4.3 : 30)).toFixed(2)}
                          </span>
                        </div>
                        {parseFloat(customRepaymentAmount) * parseInt(repaymentDuration) * (repaymentFrequency === "monthly" ? 1 : repaymentFrequency === "weekly" ? 4.3 : 30) < totalRepayable && (
                          <p className="text-xs text-destructive">⚠ Total payments don't cover the full repayable amount.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Business Details ── */}
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
                    {loanPurposes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Business Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter your business name"
                    value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10 h-12 bg-muted border-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Business Type *</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="h-12 bg-muted border-0">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {businessTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Average Monthly Revenue (BWP) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">P</span>
                  <Input
                    type="number" inputMode="numeric" placeholder="0.00"
                    value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)}
                    className="pl-8 h-12 bg-muted border-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Years in Business *</Label>
                <Select value={yearsInBusiness} onValueChange={setYearsInBusiness}>
                  <SelectTrigger className="h-12 bg-muted border-0">
                    <SelectValue placeholder="How long in business?" />
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
                      key={provider.id} type="button"
                      onClick={() => setMobileMoneyProvider(provider.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        mobileMoneyProvider === provider.id ? "border-primary bg-primary/10" : "border-border bg-muted"
                      }`}
                    >
                      <img src={provider.img} alt={provider.name} className="w-10 h-10 rounded-lg object-contain" />
                      <span className="text-xs font-medium text-foreground">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  By submitting, you agree to our terms. Your application and repayment plan will be reviewed by our team before any funds are disbursed.
                </p>
              </div>

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
