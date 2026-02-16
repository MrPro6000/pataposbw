import { useState } from "react";
import { X, ChevronLeft, CreditCard, RefreshCw, CheckCircle, Clock, XCircle, Smartphone, Banknote, Wallet } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

interface MobileSalesHistorySheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileSalesHistorySheet = ({ open, onClose }: MobileSalesHistorySheetProps) => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "completed" | "pending">("all");
  const { transactions, loading } = useTransactions();

  const filteredHistory = selectedFilter === "all"
    ? transactions
    : transactions.filter(t => t.status === selectedFilter);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card": return CreditCard;
      case "mobile_money": return Smartphone;
      case "cash": return Banknote;
      case "wallet": return Wallet;
      default: return CreditCard;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "card": return "Card";
      case "mobile_money": return "Mobile Money";
      case "cash": return "Cash";
      case "wallet": return "Wallet";
      case "payment_link": return "Payment Link";
      case "invoice": return "Invoice";
      default: return method;
    }
  };

  const getStatusIcon = (status: string, amount: number) => {
    if (amount < 0) return <RefreshCw className="w-4 h-4 text-orange-500" />;
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string, amount: number) => {
    if (amount < 0) return "text-orange-600 bg-orange-500/10 dark:text-orange-400";
    switch (status) {
      case "completed": return "text-green-600 bg-green-500/10 dark:text-green-400";
      case "pending": return "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400";
      default: return "text-red-600 bg-red-500/10 dark:text-red-400";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Pending" },
  ] as const;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
              <DrawerTitle className="text-foreground">Sales History</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sales List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              filteredHistory.map((sale) => {
                const Icon = getMethodIcon(sale.payment_method);
                const statusLabel = sale.amount < 0 ? "Refunded" : sale.status === "completed" ? "Approved" : sale.status;
                return (
                  <div
                    key={sale.id}
                    className="w-full bg-muted rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{getMethodLabel(sale.payment_method)}</p>
                          <p className="text-xs text-muted-foreground">{sale.description || "Transaction"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${sale.amount < 0 ? "text-orange-500" : "text-foreground"}`}>
                          {sale.amount < 0 ? "-" : ""}P{Math.abs(sale.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(sale.created_at), "MMM d, h:mm a")}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(sale.status, sale.amount)}`}>
                          {getStatusIcon(sale.status, sale.amount)}
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No sales found</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSalesHistorySheet;
