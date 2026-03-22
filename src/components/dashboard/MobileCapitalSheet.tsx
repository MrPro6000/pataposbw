import { useState } from "react";
import { X, ChevronLeft, Wallet, TrendingUp, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import MobileLoanApplicationSheet from "./MobileLoanApplicationSheet";

interface MobileCapitalSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileCapitalSheet = ({ open, onClose }: MobileCapitalSheetProps) => {
  const [loanApplicationOpen, setLoanApplicationOpen] = useState(false);

  const benefits = [
    { icon: TrendingUp, title: "Grow Your Business", description: "Access capital to expand inventory or operations" },
    { icon: Clock, title: "Quick Approval", description: "Get approved within 24 hours" },
    { icon: CheckCircle, title: "Flexible Repayment", description: "Repay as a percentage of your sales or a custom plan" },
  ];

  return (
    <>
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className="bg-background h-[95vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DrawerClose asChild>
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                </DrawerClose>
                <DrawerTitle className="text-foreground">Pata Capital</DrawerTitle>
              </div>
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-5 overflow-y-auto pb-10">
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
                <p className="font-bold text-foreground">Up to P100,000</p>
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
                {[
                  "Apply with your desired amount and repayment plan",
                  "Get approved within 24 hours",
                  "Receive funds directly to your mobile money account",
                  "Repay automatically from your sales — full, % of revenue, or custom",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Repayment options preview */}
            <div className="bg-muted rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-3">Repayment Options</h3>
              <div className="space-y-2">
                {[
                  { label: "Pay in Full", desc: "Single lump-sum payment" },
                  { label: "% of Revenue", desc: "A percentage of your monthly earnings" },
                  { label: "Custom Amount", desc: "You set the amount & frequency" },
                ].map((opt) => (
                  <div key={opt.label} className="flex items-center gap-3 bg-card rounded-xl p-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setLoanApplicationOpen(true)}
              className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <MobileLoanApplicationSheet
        open={loanApplicationOpen}
        onClose={() => setLoanApplicationOpen(false)}
      />
    </>
  );
};

export default MobileCapitalSheet;
