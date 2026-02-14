import { useState } from "react";
import { X, ChevronLeft, Wallet, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

interface MobileCapitalSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileCapitalSheet = ({ open, onClose }: MobileCapitalSheetProps) => {
  const { toast } = useToast();
  const [view, setView] = useState<"info" | "apply">("info");
  const [applicationForm, setApplicationForm] = useState({
    amount: "",
    purpose: "",
    monthlyRevenue: "",
  });

  const benefits = [
    { icon: TrendingUp, title: "Grow Your Business", description: "Access capital to expand inventory or operations" },
    { icon: Clock, title: "Quick Approval", description: "Get approved within 24 hours" },
    { icon: CheckCircle, title: "Flexible Repayment", description: "Repay as a percentage of your sales" },
  ];

  const loanAmounts = ["P5,000", "P10,000", "P25,000", "P50,000", "P100,000"];

  const handleApply = () => {
    if (!applicationForm.amount) {
      toast({ title: "Error", description: "Please select a loan amount", variant: "destructive" });
      return;
    }
    toast({ 
      title: "Application Submitted", 
      description: "We'll review your application and contact you within 24 hours" 
    });
    setApplicationForm({ amount: "", purpose: "", monthlyRevenue: "" });
    setView("info");
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view === "apply" ? (
                <button 
                  onClick={() => setView("info")}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              ) : (
                <DrawerClose asChild>
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                </DrawerClose>
              )}
              <DrawerTitle className="text-foreground">
                {view === "apply" ? "Apply for Capital" : "Pata Capital"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {view === "info" ? (
            <>
              {/* Hero */}
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 mb-5 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Business Funding</h2>
                <p className="text-white/80 text-sm">Get capital to grow your business with flexible repayment</p>
              </div>

              {/* Eligibility */}
              <div className="bg-muted rounded-2xl p-4 mb-5">
                <h3 className="font-medium text-foreground mb-2">Your Eligibility</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Available amount</p>
                  <p className="font-bold text-foreground">Up to P50,000</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Based on your sales history</p>
              </div>

              {/* Benefits */}
              <h3 className="font-semibold text-foreground mb-3">Why Pata Capital?</h3>
              <div className="space-y-3 mb-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3 bg-muted rounded-xl p-4">
                    <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* How it Works */}
              <h3 className="font-semibold text-foreground mb-3">How it Works</h3>
              <div className="bg-muted rounded-2xl p-4 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <p className="text-sm text-foreground">Apply with your desired amount</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <p className="text-sm text-foreground">Get approved within 24 hours</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <p className="text-sm text-foreground">Receive funds directly to your account</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <p className="text-sm text-foreground">Repay automatically from your sales</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setView("apply")}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              {/* Application Form */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-foreground">Select Loan Amount</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {loanAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setApplicationForm({ ...applicationForm, amount })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          applicationForm.amount === amount
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-border bg-card"
                        }`}
                      >
                        <p className="font-bold text-foreground">{amount}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">What will you use the funds for?</Label>
                  <Input
                    placeholder="e.g., Expand inventory, hire staff"
                    value={applicationForm.purpose}
                    onChange={(e) => setApplicationForm({ ...applicationForm, purpose: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Average Monthly Revenue</Label>
                  <Input
                    placeholder="e.g., P50,000"
                    value={applicationForm.monthlyRevenue}
                    onChange={(e) => setApplicationForm({ ...applicationForm, monthlyRevenue: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    By applying, you agree to our terms and allow us to review your sales history for loan eligibility.
                  </p>
                </div>

                <Button
                  onClick={handleApply}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCapitalSheet;
