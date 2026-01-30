import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import CapitalDialog from "@/components/dashboard/CapitalDialog";
import FeesDialog from "@/components/dashboard/FeesDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Wallet, 
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Edit,
  ChevronRight,
  Percent,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "processing";
  reference: string;
}

const payouts: Payout[] = [
  { id: "PAY001", date: "2025-01-28", amount: 5420.00, status: "processing", reference: "PAYOUT-2025-001" },
  { id: "PAY002", date: "2025-01-21", amount: 8930.00, status: "completed", reference: "PAYOUT-2025-002" },
  { id: "PAY003", date: "2025-01-14", amount: 6780.00, status: "completed", reference: "PAYOUT-2025-003" },
  { id: "PAY004", date: "2025-01-07", amount: 4560.00, status: "completed", reference: "PAYOUT-2025-004" },
  { id: "PAY005", date: "2024-12-31", amount: 12340.00, status: "completed", reference: "PAYOUT-2024-052" },
];

const Payouts = () => {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [feesOpen, setFeesOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "First National Bank",
    accountNumber: "•••• •••• 4532",
    branchCode: "250655",
    accountHolder: "Pata Business (Pty) Ltd",
  });
  const isMobile = useIsMobile();

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing": return <Clock className="w-4 h-4 text-orange-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "processing": return "bg-orange-100 text-orange-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#141414]">Payouts</h1>
        <p className="text-[#141414]/60">Track your earnings and bank transfers</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#141414] text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0066FF] rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/70">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">P12,450.00</p>
          <p className="text-sm text-white/60 mt-2">Next payout: Monday</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-[#141414]/70">Processing</span>
          </div>
          <p className="text-3xl font-bold text-[#141414]">P5,420.00</p>
          <p className="text-sm text-[#141414]/60 mt-2">Expected in 1-2 days</p>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-[#141414]/70">Paid Out (This Month)</span>
          </div>
          <p className="text-3xl font-bold text-[#141414]">P67,890.00</p>
          <p className="text-sm text-[#141414]/60 mt-2">4 payouts completed</p>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#141414]">Bank Account</h2>
          <Button variant="outline" size="sm" onClick={() => setIsBankModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F6F6F6] rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#141414]/60" />
          </div>
          <div>
            <p className="font-medium text-[#141414]">{bankDetails.bankName}</p>
            <p className="text-sm text-[#141414]/60">{bankDetails.accountNumber} • {bankDetails.accountHolder}</p>
          </div>
        </div>
      </div>

      {/* Pata Capital & Fees Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCapitalOpen(true)}
          className="bg-white rounded-2xl p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-[#141414]">Pata Capital</p>
              <p className="text-sm text-[#141414]/60">Get business funding with flexible repayment</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#141414]/30 ml-auto" />
          </div>
        </button>

        <button
          onClick={() => setFeesOpen(true)}
          className="bg-white rounded-2xl p-6 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-[#141414]/60" />
            </div>
            <div>
              <p className="font-semibold text-[#141414]">Fees</p>
              <p className="text-sm text-[#141414]/60">All the fees related to your business</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#141414]/30 ml-auto" />
          </div>
        </button>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f0f0]">
          <h2 className="text-lg font-semibold text-[#141414]">Payout History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F6F6]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Reference</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Date</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                  <td className="p-4">
                    <span className="font-medium text-[#141414]">{payout.reference}</span>
                  </td>
                  <td className="p-4 text-[#141414]/70">{payout.date}</td>
                  <td className="p-4 font-semibold text-[#141414]">P{payout.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Details Modal */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bank Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input 
                id="bankName"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input 
                id="accountNumber"
                placeholder="Enter full account number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input 
                id="branchCode"
                value={bankDetails.branchCode}
                onChange={(e) => setBankDetails({ ...bankDetails, branchCode: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input 
                id="accountHolder"
                value={bankDetails.accountHolder}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsBankModalOpen(false)} className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Capital Dialog */}
      <CapitalDialog
        open={capitalOpen}
        onClose={() => setCapitalOpen(false)}
      />

      {/* Fees Dialog */}
      <FeesDialog
        open={feesOpen}
        onClose={() => setFeesOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Payouts;
