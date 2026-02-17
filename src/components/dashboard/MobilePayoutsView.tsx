import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Zap, Building2, ChevronRight, Edit, Check, Copy, AlertTriangle, Smartphone, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import MobileBottomNav from "./MobileBottomNav";
import { useTransactions } from "@/hooks/useTransactions";
import { getConnectedAccounts, type ConnectedAccount } from "./MobileWalletSheet";

type PayoutStatus = "completed" | "processing" | "pending";

interface Payout {
  id: string;
  type: string;
  date: string;
  amount: string;
  amountNum: number;
  status: PayoutStatus;
  description: string | null;
  payment_method: string;
}

const MobilePayoutsView = () => {
  const navigate = useNavigate();
  const { balance, transactions, addTransaction } = useTransactions();
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [instantPayoutOpen, setInstantPayoutOpen] = useState(false);
  const [instantPayoutStep, setInstantPayoutStep] = useState<"select_account" | "confirm" | "processing" | "success">("select_account");
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");

  const connectedAccounts = getConnectedAccounts();

  const payoutsFromDB: Payout[] = transactions.map(tx => ({
    id: tx.id,
    type: tx.payment_method === "card" ? "Card Sale" : tx.payment_method === "mobile_money" ? "Mobile Money" : tx.payment_method === "cash" ? "Cash" : tx.payment_method === "payout" ? "Withdrawal" : tx.type,
    date: new Date(tx.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    amount: `P${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    amountNum: tx.amount,
    status: tx.status as PayoutStatus,
    description: tx.description,
    payment_method: tx.payment_method,
  }));

  const availableBalance = balance;
  const processingAmount = transactions
    .filter(t => t.status === "processing")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = transactions
    .filter(t => t.status === "completed" && t.amount > 0 && new Date(t.created_at) >= startOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const instantFee = Math.round((parseFloat(payoutAmount) || availableBalance) * 0.005 * 100) / 100;
  const payoutAmountNum = parseFloat(payoutAmount) || availableBalance;

  const getStatusBadge = (status: PayoutStatus) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    }
    if (status === "processing") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          <Clock className="w-3 h-3" /> Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank": return <Building2 className="w-5 h-5 text-muted-foreground" />;
      case "mobile_money": return <Smartphone className="w-5 h-5 text-muted-foreground" />;
      case "card": return <CreditCard className="w-5 h-5 text-muted-foreground" />;
      default: return <Wallet className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleStartPayout = () => {
    setInstantPayoutStep("select_account");
    setSelectedAccount(null);
    setPayoutAmount(String(availableBalance));
    setInstantPayoutOpen(true);
  };

  const handleSelectAccount = (account: ConnectedAccount) => {
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount first.");
      return;
    }
    if (amt > availableBalance) {
      toast.error("Insufficient funds. Your balance is P" + availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ".");
      return;
    }
    setSelectedAccount(account);
    setInstantPayoutStep("confirm");
  };

  const validatePayout = (): string | null => {
    if (!selectedAccount) return "No account selected.";
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) return "Enter a valid amount.";
    if (amt > availableBalance) return "Insufficient funds. Your balance is P" + availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ".";
    if (amt < 5) return "Minimum withdrawal is P5.00.";

    // Validate Botswana mobile numbers for mobile_money accounts
    if (selectedAccount.type === "mobile_money" && selectedAccount.details) {
      const digits = selectedAccount.details.replace(/\D/g, "").replace(/^267/, "");
      if (!/^7\d{7}$/.test(digits)) {
        return "Invalid Botswana mobile number. Must start with 7 and be 8 digits.";
      }
    }
    return null;
  };

  const handleInstantPayout = async () => {
    const error = validatePayout();
    if (error) {
      toast.error(error);
      return;
    }
    if (!selectedAccount) return;
    setInstantPayoutStep("processing");

    const destLabel = selectedAccount.type === "bank"
      ? `${selectedAccount.name} (${selectedAccount.details}) Branch: ${selectedAccount.branchCode || "N/A"}`
      : `${selectedAccount.name} - ${selectedAccount.details}`;

    await addTransaction({
      type: "payout",
      payment_method: "payout",
      amount: -(payoutAmountNum - instantFee),
      description: `Withdrawal to ${destLabel}`,
      status: "processing",
    });

    setTimeout(() => {
      setInstantPayoutStep("success");
    }, 2000);
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast.success("Reference copied");
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
          <p className="text-3xl font-bold">P{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm opacity-70 mt-1">Withdraw to your connected accounts</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Processing</span>
            </div>
            <p className="text-lg font-bold text-foreground">P{processingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Paid This Month</span>
            </div>
            <p className="text-lg font-bold text-foreground">P{paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="px-5 pb-3">
        <button
          onClick={handleStartPayout}
          className="w-full bg-card rounded-2xl py-4 flex items-center justify-center gap-2 text-foreground active:bg-muted transition-colors shadow-sm border border-border/50 font-medium"
        >
          <Zap className="w-5 h-5 text-warning" />
          <span>Withdraw Funds</span>
        </button>
      </div>

      {/* Connected Accounts Preview */}
      <div className="px-5 pb-3">
        <p className="text-xs text-muted-foreground mb-2">Withdrawals go to:</p>
        {connectedAccounts.filter(a => a.isDefault).map(account => (
          <div key={account.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                {account.providerImg ? (
                  <img src={account.providerImg} alt={account.name} className="w-6 h-6 rounded object-contain" />
                ) : (
                  getAccountIcon(account.type)
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.details} {account.branchCode ? `• Branch ${account.branchCode}` : ""}</p>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>
            </div>
          </div>
        ))}
        {connectedAccounts.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">No accounts connected. Go to Wallet to add one.</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="px-5">
        <h2 className="font-semibold text-foreground mb-3">Payout History</h2>
        {payoutsFromDB.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payoutsFromDB.map((payout) => (
              <button
                key={payout.id}
                onClick={() => setSelectedPayout(payout)}
                className="w-full bg-card border border-border rounded-2xl p-4 active:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{payout.type}</p>
                  <p className={`font-semibold ${payout.amountNum < 0 ? "text-destructive" : "text-foreground"}`}>{payout.amountNum < 0 ? "-" : ""}P{Math.abs(payout.amountNum).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{payout.date}</p>
                    {payout.description && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{payout.description}</p>
                      </>
                    )}
                  </div>
                  {getStatusBadge(payout.status)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Payout Detail Sheet */}
      <Sheet open={!!selectedPayout} onOpenChange={(o) => { if (!o) setSelectedPayout(null); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader><SheetTitle>Transaction Details</SheetTitle></SheetHeader>
          {selectedPayout && (
            <div className="py-4 space-y-4">
              <div className="text-center">
                <p className={`text-3xl font-bold ${selectedPayout.amountNum < 0 ? "text-destructive" : "text-foreground"}`}>
                  {selectedPayout.amountNum < 0 ? "-" : ""}P{Math.abs(selectedPayout.amountNum).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-2">{getStatusBadge(selectedPayout.status)}</div>
              </div>
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Type</span><span className="text-sm font-medium text-foreground">{selectedPayout.type}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm font-medium text-foreground">{selectedPayout.date}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <button onClick={() => handleCopyReference(selectedPayout.id.slice(0, 8))} className="flex items-center gap-1 text-sm font-medium text-primary">
                    {selectedPayout.id.slice(0, 8)} <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Method</span><span className="text-sm font-medium text-foreground capitalize">{selectedPayout.payment_method.replace("_", " ")}</span></div>
                {selectedPayout.description && (
                  <div className="flex justify-between"><span className="text-sm text-muted-foreground">Destination</span><span className="text-sm font-medium text-foreground text-right max-w-[180px]">{selectedPayout.description}</span></div>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedPayout(null)} className="w-full">Close</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Withdraw Funds Sheet */}
      <Sheet open={instantPayoutOpen} onOpenChange={(o) => { if (!o) setInstantPayoutOpen(false); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {instantPayoutStep === "select_account" && "Withdraw To"}
              {instantPayoutStep === "confirm" && "Confirm Withdrawal"}
              {instantPayoutStep === "processing" && "Processing..."}
              {instantPayoutStep === "success" && "Withdrawal Sent!"}
            </SheetTitle>
          </SheetHeader>

          {instantPayoutStep === "select_account" && (
            <div className="py-4 space-y-3">
              <div className="space-y-2 mb-4">
                <Label>Amount (P)</Label>
                <Input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="Enter amount" className="text-xl font-bold h-12 text-center" />
                <p className="text-xs text-muted-foreground text-center">Available: P{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <p className="text-sm text-muted-foreground">Select destination account:</p>
              {connectedAccounts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">No connected accounts.</p>
                  <p className="text-xs">Go to Wallet to connect a bank or mobile money account.</p>
                </div>
              ) : (
                connectedAccounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(account)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      {account.providerImg ? (
                        <img src={account.providerImg} alt={account.name} className="w-6 h-6 rounded object-contain" />
                      ) : (
                        getAccountIcon(account.type)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.details} {account.branchCode ? `• Branch ${account.branchCode}` : ""}</p>
                    </div>
                    {account.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))
              )}
              <Button variant="outline" onClick={() => setInstantPayoutOpen(false)} className="w-full">Cancel</Button>
            </div>
          )}

          {instantPayoutStep === "confirm" && selectedAccount && (
            <div className="py-4 space-y-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">You will receive</p>
                <p className="text-3xl font-bold text-foreground">P{(payoutAmountNum - instantFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Withdrawal Amount</span><span className="text-sm font-medium text-foreground">P{payoutAmountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Instant Fee (0.5%)</span><span className="text-sm font-medium text-destructive">-P{instantFee.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-2"><span className="text-sm font-semibold text-foreground">Net Amount</span><span className="text-sm font-bold text-foreground">P{(payoutAmountNum - instantFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Sending to:</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center">
                    {selectedAccount.providerImg ? <img src={selectedAccount.providerImg} alt="" className="w-5 h-5 rounded object-contain" /> : getAccountIcon(selectedAccount.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedAccount.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedAccount.details} {selectedAccount.branchCode ? `• Branch ${selectedAccount.branchCode}` : ""}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">Instant withdrawals are processed within minutes. A 0.5% fee applies.</p>
              </div>
              <Button onClick={handleInstantPayout} className="w-full"><Zap className="w-4 h-4 mr-2" /> Confirm Withdrawal</Button>
              <Button variant="outline" onClick={() => setInstantPayoutStep("select_account")} className="w-full">Back</Button>
            </div>
          )}

          {instantPayoutStep === "processing" && (
            <div className="py-12 text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">Processing your withdrawal...</p>
            </div>
          )}

          {instantPayoutStep === "success" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Withdrawal Sent!</h3>
              <p className="text-sm text-muted-foreground">P{(payoutAmountNum - instantFee).toLocaleString(undefined, { minimumFractionDigits: 2 })} is on its way to {selectedAccount?.name}</p>
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
