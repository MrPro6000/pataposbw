import { useState } from "react";
import { X, ChevronLeft, CreditCard, RefreshCw, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MobileSalesHistorySheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileSalesHistorySheet = ({ open, onClose }: MobileSalesHistorySheetProps) => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "approved" | "refunded" | "pending">("all");

  const salesHistory = [
    { id: "1", type: "Card", customer: "Walk-in", amount: 12.00, status: "approved", date: "Today, 10:45 AM", method: "Visa •••• 4532" },
    { id: "2", type: "Card", customer: "John Doe", amount: 45.50, status: "refunded", date: "Today, 09:30 AM", method: "Mastercard •••• 8721" },
    { id: "3", type: "Cash", customer: "Walk-in", amount: 5.00, status: "approved", date: "Yesterday, 4:15 PM", method: "Cash" },
    { id: "4", type: "Mobile Money", customer: "Mary Smith", amount: 120.00, status: "approved", date: "Yesterday, 2:30 PM", method: "Orange Money" },
    { id: "5", type: "Card", customer: "Walk-in", amount: 35.00, status: "pending", date: "Yesterday, 11:00 AM", method: "Visa •••• 9012" },
    { id: "6", type: "Payment Link", customer: "Tech Corp", amount: 500.00, status: "approved", date: "2 days ago", method: "Online Payment" },
  ];

  const filteredHistory = selectedFilter === "all" 
    ? salesHistory 
    : salesHistory.filter(s => s.status === selectedFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "refunded": return <RefreshCw className="w-4 h-4 text-orange-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-50";
      case "refunded": return "text-orange-600 bg-orange-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-red-600 bg-red-50";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "approved", label: "Approved" },
    { id: "refunded", label: "Refunded" },
    { id: "pending", label: "Pending" },
  ] as const;

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
              <DrawerTitle className="text-[#141414]">Sales History</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === filter.id
                    ? "bg-[#00C8E6] text-[#141414]"
                    : "bg-[#F5F5F5] text-[#141414]/60"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sales List */}
          <div className="space-y-3">
            {filteredHistory.map((sale) => (
              <button
                key={sale.id}
                className="w-full bg-[#F5F5F5] rounded-2xl p-4 text-left active:bg-[#E8E8E8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#141414]/60" />
                    </div>
                    <div>
                      <p className="font-medium text-[#141414]">{sale.type}</p>
                      <p className="text-xs text-[#141414]/60">{sale.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${sale.status === "refunded" ? "text-orange-500" : "text-[#141414]"}`}>
                      {sale.status === "refunded" ? "-" : ""}P{sale.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#141414]/50">{sale.method}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(sale.status)}`}>
                      {getStatusIcon(sale.status)}
                      {sale.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#141414]/40 mt-2">{sale.date}</p>
              </button>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#141414]/60">No sales found</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSalesHistorySheet;
