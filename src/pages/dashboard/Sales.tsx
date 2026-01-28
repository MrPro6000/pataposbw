import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard,
  Smartphone,
  Globe,
  ChevronDown,
  RotateCcw,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: "card" | "online" | "tap";
  amount: number;
  status: "success" | "pending" | "failed";
  cardLast4?: string;
  customer?: string;
  reference: string;
}

const transactions: Transaction[] = [
  { id: "TXN001", date: "2025-01-28", time: "14:32", type: "card", amount: 150.00, status: "success", cardLast4: "4532", reference: "PAY-001234" },
  { id: "TXN002", date: "2025-01-28", time: "13:45", type: "tap", amount: 89.00, status: "success", cardLast4: "8821", reference: "PAY-001233" },
  { id: "TXN003", date: "2025-01-28", time: "12:20", type: "online", amount: 450.00, status: "success", customer: "john@email.com", reference: "PAY-001232" },
  { id: "TXN004", date: "2025-01-28", time: "11:15", type: "card", amount: 75.00, status: "pending", cardLast4: "9912", reference: "PAY-001231" },
  { id: "TXN005", date: "2025-01-28", time: "10:30", type: "card", amount: 320.00, status: "success", cardLast4: "5567", reference: "PAY-001230" },
  { id: "TXN006", date: "2025-01-27", time: "16:45", type: "online", amount: 890.00, status: "success", customer: "sarah@email.com", reference: "PAY-001229" },
  { id: "TXN007", date: "2025-01-27", time: "15:20", type: "tap", amount: 45.00, status: "failed", cardLast4: "3345", reference: "PAY-001228" },
  { id: "TXN008", date: "2025-01-27", time: "14:00", type: "card", amount: 1250.00, status: "success", cardLast4: "7788", reference: "PAY-001227" },
];

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "card": return <CreditCard className="w-4 h-4" />;
      case "online": return <Globe className="w-4 h-4" />;
      case "tap": return <Smartphone className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cardLast4?.includes(searchQuery) ||
      tx.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Sales & Transactions</h1>
          <p className="text-[#141414]/60">View and manage all your transactions</p>
        </div>
        <Button className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40" />
            <Input 
              placeholder="Search by reference, card, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="tap">Tap to Pay</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F6F6]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Reference</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Date & Time</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Type</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Status</th>
                <th className="text-right p-4 text-sm font-medium text-[#141414]/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                  <td className="p-4">
                    <span className="font-medium text-[#141414]">{tx.reference}</span>
                  </td>
                  <td className="p-4 text-[#141414]/70">
                    {tx.date} • {tx.time}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#00C8E6]/20 rounded-full flex items-center justify-center text-[#00C8E6]">
                        {getTypeIcon(tx.type)}
                      </div>
                      <span className="capitalize text-[#141414]">{tx.type}</span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#141414]">
                    R{tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedTransaction(tx)}
                        className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[#141414]/60" />
                      </button>
                      {tx.status === "success" && (
                        <button className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors">
                          <RotateCcw className="w-4 h-4 text-orange-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-[#00C8E6]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <p className="text-3xl font-bold text-[#141414]">R{selectedTransaction.amount.toFixed(2)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status}
                </span>
              </div>
              
              <div className="space-y-3 bg-[#F6F6F6] rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Reference</span>
                  <span className="font-medium">{selectedTransaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Date</span>
                  <span className="font-medium">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Time</span>
                  <span className="font-medium">{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Type</span>
                  <span className="font-medium capitalize">{selectedTransaction.type}</span>
                </div>
                {selectedTransaction.cardLast4 && (
                  <div className="flex justify-between">
                    <span className="text-[#141414]/60">Card</span>
                    <span className="font-medium">•••• {selectedTransaction.cardLast4}</span>
                  </div>
                )}
                {selectedTransaction.customer && (
                  <div className="flex justify-between">
                    <span className="text-[#141414]/60">Customer</span>
                    <span className="font-medium">{selectedTransaction.customer}</span>
                  </div>
                )}
              </div>

              {selectedTransaction.status === "success" && (
                <Button variant="outline" className="w-full text-orange-500 border-orange-500 hover:bg-orange-50">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Issue Refund
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Sales;
