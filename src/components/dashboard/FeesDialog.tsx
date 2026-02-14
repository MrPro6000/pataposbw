import { Percent, CreditCard, Smartphone, Zap, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FeesDialogProps { open: boolean; onClose: () => void; }

const FeesDialog = ({ open, onClose }: FeesDialogProps) => {
  const feeCategories = [
    { title: "Card Payments", icon: CreditCard, iconBg: "bg-primary/10", iconColor: "text-primary", fees: [{ name: "Visa / Mastercard", rate: "2.5% + P1.50" }, { name: "Amex", rate: "3.0% + P1.50" }, { name: "Local cards", rate: "2.0% + P1.00" }] },
    { title: "Mobile Money", icon: Smartphone, iconBg: "bg-orange-500/20", iconColor: "text-orange-500", fees: [{ name: "Orange Money", rate: "1.5%" }, { name: "Smega", rate: "1.5%" }, { name: "MyZaka", rate: "1.5%" }, { name: "Mascom MyZaka", rate: "1.5%" }] },
    { title: "Payouts", icon: Zap, iconBg: "bg-purple-500/20", iconColor: "text-purple-500", fees: [{ name: "Standard payout (next day)", rate: "Free" }, { name: "Instant payout", rate: "1.0% (min P5)" }] },
    { title: "Online Payments", icon: Globe, iconBg: "bg-green-500/20", iconColor: "text-green-500", fees: [{ name: "Payment links", rate: "2.5% + P1.50" }, { name: "Invoice payments", rate: "2.5% + P1.50" }, { name: "Website checkout", rate: "2.5% + P1.50" }] },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-foreground">Fees</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Percent className="w-5 h-5 text-primary" /></div>
              <div><p className="font-semibold text-foreground">Transaction Fees</p><p className="text-sm text-muted-foreground">All fees related to your business</p></div>
            </div>
          </div>
          {feeCategories.map((category) => (
            <div key={category.title} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border bg-muted">
                <div className={`w-10 h-10 ${category.iconBg} rounded-xl flex items-center justify-center`}><category.icon className={`w-5 h-5 ${category.iconColor}`} /></div>
                <p className="font-semibold text-foreground">{category.title}</p>
              </div>
              <div className="divide-y divide-border">
                {category.fees.map((fee) => (
                  <div key={fee.name} className="flex items-center justify-between p-4">
                    <p className="text-foreground">{fee.name}</p>
                    <p className="font-medium text-foreground">{fee.rate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">All fees are deducted automatically from your transactions before payout.<br /><span className="text-primary font-medium">Contact support</span> for volume discounts.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeesDialog;
