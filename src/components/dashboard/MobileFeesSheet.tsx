import { X, ChevronLeft, CreditCard, Smartphone, Wallet, Zap, Building } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileFeesSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileFeesSheet = ({ open, onClose }: MobileFeesSheetProps) => {
  const feeCategories = [
    {
      title: "Card Payments",
      icon: CreditCard,
      fees: [
        { name: "Visa / Mastercard", rate: "2.9% + P1.50", description: "Per transaction" },
        { name: "Tap to Pay", rate: "2.9% + P1.50", description: "NFC contactless" },
        { name: "International Cards", rate: "3.5% + P1.50", description: "Foreign issued cards" },
      ]
    },
    {
      title: "Mobile Money",
      icon: Smartphone,
      fees: [
        { name: "Orange Money", rate: "1.5%", description: "Per transaction" },
        { name: "Smega", rate: "1.5%", description: "Per transaction" },
        { name: "MyZaka", rate: "1.5%", description: "Per transaction" },
        { name: "Mascom MyZaka", rate: "1.5%", description: "Per transaction" },
      ]
    },
    {
      title: "Digital Wallets",
      icon: Wallet,
      fees: [
        { name: "Payment Links", rate: "2.9% + P1.50", description: "Per transaction" },
        { name: "Invoices", rate: "2.9% + P1.50", description: "Per paid invoice" },
        { name: "QR Payments", rate: "1.5%", description: "Per transaction" },
      ]
    },
    {
      title: "Payouts",
      icon: Building,
      fees: [
        { name: "Standard Payout", rate: "Free", description: "2-3 business days" },
        { name: "Instant Payout", rate: "1%", description: "Within minutes" },
      ]
    },
  ];

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-white max-h-[90vh]">
        <DrawerHeader className="border-b border-[#E8E8E8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-[#141414]" />
                </button>
              </DrawerClose>
              <DrawerTitle className="text-[#141414]">Fees</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {/* Info Banner */}
          <div className="bg-[#00C8E6]/10 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#00C8E6]" />
              <p className="font-medium text-[#141414]">Transparent Pricing</p>
            </div>
            <p className="text-sm text-[#141414]/60">
              All fees related to your business. No hidden charges.
            </p>
          </div>

          {/* Fee Categories */}
          <div className="space-y-5">
            {feeCategories.map((category) => (
              <div key={category.title} className="bg-[#F5F5F5] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-[#E8E8E8]">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-[#141414]/60" />
                  </div>
                  <h3 className="font-semibold text-[#141414]">{category.title}</h3>
                </div>
                <div className="divide-y divide-[#E8E8E8]">
                  {category.fees.map((fee) => (
                    <div key={fee.name} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-[#141414]">{fee.name}</p>
                        <p className="text-xs text-[#141414]/50">{fee.description}</p>
                      </div>
                      <p className={`font-semibold ${fee.rate === "Free" ? "text-green-600" : "text-[#141414]"}`}>
                        {fee.rate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-5 text-center">
            <p className="text-xs text-[#141414]/50">
              Fees may vary based on your business volume. Contact us for custom rates.
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFeesSheet;
