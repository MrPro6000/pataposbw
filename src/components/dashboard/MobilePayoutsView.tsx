import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Zap, Building2, ChevronRight, Edit, X, Check, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import MobileBottomNav from "./MobileBottomNav";

type PayoutStatus = "completed" | "processing";

interface Payout {
  id: string;
  type: string;
  date: string;
  amount: string;
  amountNum: number;
  status: PayoutStatus;
  reference: string;
  bankName: string;
  accountEnding: string;
  fees: string;
}

const payoutsData: Payout[] = [
  { id: "PAY001", type: "Payout", date: "28 Jan 2025", amount: "P5,420.00", amountNum: 5420, status: "processing", reference: "PAYOUT-2025-001", bankName: "First National Bank", accountEnding: "4532", fees: "P0.00" },
  { id: "PAY002", type: "Payout", date: "21 Jan 2025", amount: "P8,930.00", amountNum: 8930, status: "completed", reference: "PAYOUT-2025-002", bankName: "First National Bank", accountEnding: "4532", fees: "P0.00" },
  { id: "PAY003", type: "Instant Payout", date: "14 Jan 2025", amount: "P6,780.00", amountNum: 6780, status: "completed", reference: "PAYOUT-2025-003", bankName: "First National Bank", accountEnding: "4532", fees: "P35.00" },
  { id: "PAY004", type: "Payout", date: "7 Jan 2025", amount: "P4,560.00", amountNum: 4560, status: "completed", reference: "PAYOUT-2025-004", bankName: "First National Bank", accountEnding: "4532", fees: "P0.00" },
  { id: "PAY005", type: "Payout", date: "31 Dec 2024", amount: "P12,340.00", amountNum: 12340, status: "completed", reference: "PAYOUT-2024-052", bankName: "First National Bank", accountEnding: "4532", fees: "P0.00" },
  { id: "PAY006", type: "Instant Payout", date: "24 Dec 2024", amount: "P3,210.00", amountNum: 3210, status: "completed", reference: "PAYOUT-2024-051", bankName: "First National Bank", accountEnding: "4532", fees: "P18.50" },
];

const MobilePayoutsView = () => {
  const navigate = useNavigate();
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [bankSheetOpen, setBankSheetOpen] = useState(false);
  const [instantPayoutOpen, setInstantPayoutOpen] = useState(false);
  const [instantPayoutStep, setInstantPayoutStep] = useState<"confirm" | "processing" | "success">("confirm");
  const [bankDetails, setBankDetails] = useState({
    bankName: "First National Bank",
    accountNumber: "",
    branchCode: "250655",
    accountHolder: "Pata Business (Pty) Ltd",
  });

  const availableBalance = 12450;
  const instantFee = 62.25; // 0.5% fee

  const getStatusBadge = (status: PayoutStatus) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
        <Clock className="w-3 h-3" /> Processing
      </span>
    );
  };

  const handleInstantPayout = () => {
    setInstantPayoutStep("processing");
    setTimeout(() => {
      setInstantPayoutStep("success");
    }, 2000);
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success("Reference copied");
  };

  const handleSaveBank = () => {
    toast.success("Bank details updated");
    setBankSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-5 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard/payouts")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Payouts</h1>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-5 py-4 space-y-3">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground">
          <p className="text-sm opacity-80 mb-1">Available Balance</p>
          <p className="text-3xl font-bold">P{availableBalance.toLocaleString()}.00</p>
          <p className="text-sm opacity-70 mt-1">Next payout: Monday</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => {}} className="bg-card border border-border rounded-2xl p-4 text-left active:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Processing</span>
            </div>
            <p className="text-lg font-bold text-foreground">P5,420.00</p>
          </button>
          <button onClick={() => {}} className="bg-card border border-border rounded-2xl p-4 text-left active:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Paid This Month</span>
            </div>
            <p className="text-lg font-bold text-foreground">P67,890.00</p>
          </button>
        </div>
      </div>

      {/* Instant Payout */}
      <div className="px-5 pb-3">
        <button
          onClick={() => { setInstantPayoutStep("confirm"); setInstantPayoutOpen(true); }}
          className="w-full bg-card rounded-2xl py-4 flex items-center justify-center gap-2 text-foreground active:bg-muted transition-colors shadow-sm border border-border/50 font-medium"
        >
          <Zap className="w-5 h-5 text-warning" />
          <span>Instant Payout</span>
        </button>
      </div>

      {/* Bank Account */}
      <div className="px-5 pb-3">
        <button
          onClick={() => setBankSheetOpen(true)}
          className="w-full bg-card border border-border rounded-2xl p-4 active:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">{bankDetails.bankName}</p>
              <p className="text-xs text-muted-foreground">•••• •••• {bankDetails.branchCode.slice(-4)}</p>
            </div>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      </div>

      {/* Payout History */}
      <div className="px-5">
        <h2 className="font-semibold text-foreground mb-3">Payout History</h2>
        <div className="space-y-2">
          {payoutsData.map((payout) => (
            <button
              key={payout.id}
              onClick={() => setSelectedPayout(payout)}
              className="w-full bg-card border border-border rounded-2xl p-4 active:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{payout.type}</p>
                <p className="font-semibold text-foreground">{payout.amount}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{payout.date}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{payout.reference}</p>
                </div>
                {getStatusBadge(payout.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payout Detail Sheet */}
      <Sheet open={!!selectedPayout} onOpenChange={(o) => { if (!o) setSelectedPayout(null); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Payout Details</SheetTitle>
          </SheetHeader>
          {selectedPayout && (
            <div className="py-4 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{selectedPayout.amount}</p>
                <div className="mt-2">{getStatusBadge(selectedPayout.status)}</div>
              </div>

              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium text-foreground">{selectedPayout.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium text-foreground">{selectedPayout.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <button onClick={() => handleCopyReference(selectedPayout.reference)} className="flex items-center gap-1 text-sm font-medium text-primary">
                    {selectedPayout.reference} <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="text-sm font-medium text-foreground">{selectedPayout.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="text-sm font-medium text-foreground">•••• {selectedPayout.accountEnding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fees</span>
                  <span className="text-sm font-medium text-foreground">{selectedPayout.fees}</span>
                </div>
              </div>

              <Button variant="outline" onClick={() => setSelectedPayout(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Bank Account Edit Sheet */}
      <Sheet open={bankSheetOpen} onOpenChange={setBankSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Bank Details</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="Enter full account number" />
            </div>
            <div className="space-y-2">
              <Label>Branch Code</Label>
              <Input value={bankDetails.branchCode} onChange={(e) => setBankDetails({ ...bankDetails, branchCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Account Holder</Label>
              <Input value={bankDetails.accountHolder} onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })} />
            </div>
            <Button onClick={handleSaveBank} className="w-full">Save Changes</Button>
            <Button variant="outline" onClick={() => setBankSheetOpen(false)} className="w-full">Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Instant Payout Sheet */}
      <Sheet open={instantPayoutOpen} onOpenChange={(o) => { if (!o) setInstantPayoutOpen(false); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {instantPayoutStep === "confirm" && "Instant Payout"}
              {instantPayoutStep === "processing" && "Processing..."}
              {instantPayoutStep === "success" && "Payout Sent!"}
            </SheetTitle>
          </SheetHeader>

          {instantPayoutStep === "confirm" && (
            <div className="py-4 space-y-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">You will receive</p>
                <p className="text-3xl font-bold text-foreground">P{(availableBalance - instantFee).toLocaleString()}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payout Amount</span>
                  <span className="text-sm font-medium text-foreground">P{availableBalance.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Instant Fee (0.5%)</span>
                  <span className="text-sm font-medium text-destructive">-P{instantFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Net Amount</span>
                  <span className="text-sm font-bold text-foreground">P{(availableBalance - instantFee).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">Instant payouts are processed within minutes. A 0.5% fee applies. Funds will be sent to your registered bank account.</p>
              </div>

              <Button onClick={handleInstantPayout} className="w-full">
                <Zap className="w-4 h-4 mr-2" /> Confirm Instant Payout
              </Button>
              <Button variant="outline" onClick={() => setInstantPayoutOpen(false)} className="w-full">Cancel</Button>
            </div>
          )}

          {instantPayoutStep === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">Processing your instant payout...</p>
            </div>
          )}

          {instantPayoutStep === "success" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Payout Sent!</h3>
              <p className="text-sm text-muted-foreground">P{(availableBalance - instantFee).toLocaleString()} is on its way to your bank account</p>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Expected arrival: Within 30 minutes</p>
              </div>
              <Button onClick={() => setInstantPayoutOpen(false)} className="w-full">Done</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <MobileBottomNav />
    </div>
  );
};

export default MobilePayoutsView;
