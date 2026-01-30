import { Percent, CreditCard, Smartphone, Zap, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeesDialogProps {
  open: boolean;
  onClose: () => void;
}

const FeesDialog = ({ open, onClose }: FeesDialogProps) => {
  const feeCategories = [
    {
      title: "Card Payments",
      icon: CreditCard,
      iconBg: "bg-[#00C8E6]/10",
      iconColor: "text-[#00C8E6]",
      fees: [
        { name: "Visa / Mastercard", rate: "2.5% + P1.50" },
        { name: "Amex", rate: "3.0% + P1.50" },
        { name: "Local cards", rate: "2.0% + P1.00" },
      ]
    },
    {
      title: "Mobile Money",
      icon: Smartphone,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      fees: [
        { name: "Orange Money", rate: "1.5%" },
        { name: "Smega", rate: "1.5%" },
        { name: "MyZaka", rate: "1.5%" },
        { name: "Mascom MyZaka", rate: "1.5%" },
      ]
    },
    {
      title: "Payouts",
      icon: Zap,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      fees: [
        { name: "Standard payout (next day)", rate: "Free" },
        { name: "Instant payout", rate: "1.0% (min P5)" },
      ]
    },
    {
      title: "Online Payments",
      icon: Globe,
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      fees: [
        { name: "Payment links", rate: "2.5% + P1.50" },
        { name: "Invoice payments", rate: "2.5% + P1.50" },
        { name: "Website checkout", rate: "2.5% + P1.50" },
      ]
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-[#141414]">Fees</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#F5F5F5] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#00C8E6]/10 rounded-xl flex items-center justify-center">
                <Percent className="w-5 h-5 text-[#00C8E6]" />
              </div>
              <div>
                <p className="font-semibold text-[#141414]">Transaction Fees</p>
                <p className="text-sm text-[#141414]/60">All fees related to your business</p>
              </div>
            </div>
          </div>

          {feeCategories.map((category) => (
            <div key={category.title} className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-[#E8E8E8] bg-[#F9F9F9]">
                <div className={`w-10 h-10 ${category.iconBg} rounded-xl flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                </div>
                <p className="font-semibold text-[#141414]">{category.title}</p>
              </div>
              <div className="divide-y divide-[#E8E8E8]">
                {category.fees.map((fee) => (
                  <div key={fee.name} className="flex items-center justify-between p-4">
                    <p className="text-[#141414]">{fee.name}</p>
                    <p className="font-medium text-[#141414]">{fee.rate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[#141414]/5 rounded-xl p-4 text-center">
            <p className="text-sm text-[#141414]/70">
              All fees are deducted automatically from your transactions before payout.
              <br />
              <span className="text-[#00C8E6] font-medium">Contact support</span> for volume discounts.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeesDialog;
