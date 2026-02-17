import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import CapitalDialog from "@/components/dashboard/CapitalDialog";
import FeesDialog from "@/components/dashboard/FeesDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { Wallet, Building2, ArrowUpRight, Clock, CheckCircle, Edit, ChevronRight, Percent, Zap, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Payout history now derived from transactions

const Payouts = () => {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [feesOpen, setFeesOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "First National Bank",
    accountNumber: "•••• •••• 4532",
    branchCode: "250655",
    accountHolder: "Pata Business (Pty) Ltd",
  });
  const isMobile = useIsMobile();
  const { balance, transactions } = useTransactions();

  const processingAmount = transactions
    .filter(t => t.status === "processing")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = transactions
    .filter(t => t.status === "completed" && t.amount > 0 && new Date(t.created_at) >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "processing":
        return "bg-orange-500/20 text-orange-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
        <p className="text-muted-foreground">Track your earnings and bank transfers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-muted-foreground">Available Balance</span>
          </div>
          <p className="text-3xl font-bold">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-2">Next payout: Monday</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-muted-foreground">Processing</span>
          </div>
          <p className="text-3xl font-bold text-foreground">P{processingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-2">Expected in 1-2 days</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-muted-foreground">Paid Out (This Month)</span>
          </div>
          <p className="text-3xl font-bold text-foreground">P{paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-2">{transactions.filter(t => t.status === "completed" && t.amount > 0 && new Date(t.created_at) >= startOfMonth).length} payouts completed</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Bank Account</h2>
          <Button variant="outline" size="sm" onClick={() => setIsBankModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{bankDetails.bankName}</p>
            <p className="text-sm text-muted-foreground">
              {bankDetails.accountNumber} • {bankDetails.accountHolder}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCapitalOpen(true)}
          className="bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Pata Capital</p>
              <p className="text-sm text-muted-foreground">Get business funding with flexible repayment</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </div>
        </button>

        <button
          onClick={() => setFeesOpen(true)}
          className="bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Fees</p>
              <p className="text-sm text-muted-foreground">All the fees related to your business</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </div>
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((tx) => (
                  <tr key={tx.id} className="border-t border-border hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedTx(tx)}>
                    <td className="p-4">
                      <span className="font-medium text-foreground">{tx.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 font-semibold text-foreground">P{tx.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(tx.status)}`}
                      >
                        {getStatusIcon(tx.status)}
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              <Input id="accountNumber" placeholder="Enter full account number" />
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
            <Button variant="outline" onClick={() => setIsBankModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsBankModalOpen(false)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-foreground">P{selectedTx.amount.toFixed(2)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTx.status)}`}>
                  {selectedTx.status}
                </span>
              </div>
              <div className="space-y-3 bg-muted rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium text-foreground">{selectedTx.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{new Date(selectedTx.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{new Date(selectedTx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-foreground capitalize">{selectedTx.payment_method.replace("_", " ")}</span>
                </div>
                {selectedTx.description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="font-medium text-foreground text-right max-w-[200px]">{selectedTx.description}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CapitalDialog open={capitalOpen} onClose={() => setCapitalOpen(false)} />
      <FeesDialog open={feesOpen} onClose={() => setFeesOpen(false)} />
    </DashboardLayout>
  );
};

export default Payouts;
