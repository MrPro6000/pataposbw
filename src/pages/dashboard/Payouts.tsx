import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import CapitalDialog from "@/components/dashboard/CapitalDialog";
import FeesDialog from "@/components/dashboard/FeesDialog";
import MobileMoneyTransferSheet from "@/components/dashboard/MobileMoneyTransferSheet";
import MobileLoanApplicationSheet from "@/components/dashboard/MobileLoanApplicationSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { Wallet, Building2, ArrowUpRight, Clock, CheckCircle, Edit, ChevronRight, Percent, Zap, Eye, Smartphone, CreditCard, Plus, Trash2, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getConnectedAccounts, setConnectedAccounts, type ConnectedAccount } from "@/components/dashboard/MobileWalletSheet";
import orangeMoneyImg from "@/assets/mobile-money/orange-money.png";
import smegaImg from "@/assets/mobile-money/smega.png";
import myzakaImg from "@/assets/mobile-money/myzaka.png";
import posoMoneyImg from "@/assets/mobile-money/poso-money.png";

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", img: orangeMoneyImg },
  { id: "smega", name: "Smega", img: smegaImg },
  { id: "myzaka", name: "MyZaka", img: myzakaImg },
  { id: "poso", name: "POSO Money", img: posoMoneyImg },
];

const Payouts = () => {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [feesOpen, setFeesOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [addAccountType, setAddAccountType] = useState<"" | "bank" | "mobile" | "card">("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<"select" | "confirm" | "processing" | "success">("select");
  const [withdrawAccount, setWithdrawAccount] = useState<ConnectedAccount | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(getConnectedAccounts());
  const [form, setForm] = useState({ bankName: "", accountNumber: "", branchCode: "", accountHolder: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardHolder: "", phoneNumber: "" });
  const [loanOpen, setLoanOpen] = useState(false);
  const [moneyTransferOpen, setMoneyTransferOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const { balance, transactions, addTransaction } = useTransactions();

  const processingAmount = transactions.filter(t => t.status === "processing").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = transactions.filter(t => (t.status === "completed" || t.status === "processing") && t.amount < 0 && new Date(t.created_at) >= startOfMonth).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (isMobile) return <MobileDashboardHome />;

  const syncAccounts = (updated: ConnectedAccount[]) => { setAccounts(updated); setConnectedAccounts(updated); };

  const handleAddBank = () => {
    if (!form.bankName) { toast.error("Enter a bank name"); return; }
    const digits = form.accountNumber.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 13) { toast.error("Account number must be 8-13 digits"); return; }
    syncAccounts([...accounts, { id: crypto.randomUUID(), type: "bank", name: form.bankName, details: `•••• ${digits.slice(-4)}`, bankName: form.bankName, branchCode: form.branchCode, accountHolder: form.accountHolder, isDefault: accounts.length === 0 }]);
    toast.success("Bank account connected"); setAddAccountType(""); setForm({ bankName: "", accountNumber: "", branchCode: "", accountHolder: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardHolder: "", phoneNumber: "" });
  };

  const handleAddMobile = () => {
    if (!form.phoneNumber) { toast.error("Enter phone number"); return; }
    const digits = form.phoneNumber.replace(/\D/g, "").replace(/^267/, "");
    if (!/^7\d{7}$/.test(digits)) { toast.error("Invalid Botswana mobile number. Must start with 7 and be 8 digits."); return; }
    const provider = mobileMoneyProviders.find(p => p.id === selectedProvider);
    syncAccounts([...accounts, { id: crypto.randomUUID(), type: "mobile_money", name: provider?.name || "Mobile Money", details: form.phoneNumber, provider: selectedProvider, providerImg: provider?.img, isDefault: accounts.length === 0 }]);
    toast.success(`${provider?.name} connected`); setAddAccountType(""); setSelectedProvider(""); setForm({ ...form, phoneNumber: "" });
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handleAddCard = () => {
    const digits = form.cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 16) { toast.error("Card number must be 13-16 digits"); return; }
    if (!form.cardExpiry || !/^\d{2}\/\d{2}$/.test(form.cardExpiry)) { toast.error("Enter a valid expiry date (MM/YY)"); return; }
    if (!form.cardCvv || !/^\d{3,4}$/.test(form.cardCvv)) { toast.error("Enter a valid CVV (3 or 4 digits)"); return; }
    if (!form.cardHolder.trim()) { toast.error("Enter the cardholder name"); return; }
    syncAccounts([...accounts, { id: crypto.randomUUID(), type: "card", name: form.cardHolder.trim(), details: `•••• ${digits.slice(-4)}`, isDefault: accounts.length === 0 }]);
    toast.success("Card connected"); setAddAccountType(""); setForm({ ...form, cardNumber: "", cardExpiry: "", cardCvv: "", cardHolder: "" });
  };

  const handleRemoveAccount = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) updated[0].isDefault = true;
    syncAccounts(updated); toast.success("Account removed");
  };

  const handleSetDefault = (id: string) => { syncAccounts(accounts.map(a => ({ ...a, isDefault: a.id === id }))); toast.success("Default updated"); };

  const getAccountIcon = (type: string) => {
    switch (type) { case "bank": return <Building2 className="w-5 h-5 text-muted-foreground" />; case "mobile_money": return <Smartphone className="w-5 h-5 text-muted-foreground" />; case "card": return <CreditCard className="w-5 h-5 text-muted-foreground" />; default: return <Wallet className="w-5 h-5 text-muted-foreground" />; }
  };

  const getStatusColor = (status: string) => {
    switch (status) { case "completed": return "bg-green-500/20 text-green-400"; case "processing": return "bg-orange-500/20 text-orange-400"; case "pending": return "bg-yellow-500/20 text-yellow-400"; default: return "bg-muted text-muted-foreground"; }
  };

  const getStatusIcon = (status: string) => {
    switch (status) { case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />; case "processing": return <Clock className="w-4 h-4 text-orange-500" />; default: return <Clock className="w-4 h-4 text-yellow-500" />; }
  };

  const withdrawAmountNum = parseFloat(withdrawAmount) || balance;
  const withdrawFee = Math.round(withdrawAmountNum * 0.005 * 100) / 100;

  const validateWithdraw = (): string | null => {
    if (!withdrawAccount) return "No account selected.";
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) return "Enter a valid amount.";
    if (amt > balance) return "Insufficient funds. Your balance is P" + balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ".";
    if (amt < 5) return "Minimum withdrawal is P5.00.";
    if (withdrawAccount.type === "mobile_money" && withdrawAccount.details) {
      const digits = withdrawAccount.details.replace(/\D/g, "").replace(/^267/, "");
      if (!/^7\d{7}$/.test(digits)) return "Invalid Botswana mobile number. Must start with 7 and be 8 digits.";
    }
    return null;
  };

  const handleWithdraw = async () => {
    const error = validateWithdraw();
    if (error) { toast.error(error); return; }
    if (!withdrawAccount) return;
    setWithdrawStep("processing");
    const destLabel = withdrawAccount.type === "bank"
      ? `${withdrawAccount.name} (${withdrawAccount.details}) Branch: ${withdrawAccount.branchCode || "N/A"}`
      : `${withdrawAccount.name} - ${withdrawAccount.details}`;
    await addTransaction({ type: "payout", payment_method: "payout", amount: -(withdrawAmountNum - withdrawFee), description: `Withdrawal to ${destLabel}`, status: "processing" });
    setTimeout(() => setWithdrawStep("success"), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
        <p className="text-muted-foreground">Withdraw earnings to your connected accounts</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"><Wallet className="w-5 h-5 text-primary-foreground" /></div><span className="text-muted-foreground">Available Balance</span></div>
          <p className="text-3xl font-bold">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <Button size="sm" className="mt-3" onClick={() => { setWithdrawAmount(String(balance)); setWithdrawStep("select"); setWithdrawAccount(null); setWithdrawOpen(true); }}><Zap className="w-4 h-4 mr-2" /> Withdraw</Button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-orange-500" /></div><span className="text-muted-foreground">Processing</span></div>
          <p className="text-3xl font-bold text-foreground">P{processingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-2">Expected in 1-2 days</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-green-500" /></div><span className="text-muted-foreground">Paid Out (This Month)</span></div>
          <p className="text-3xl font-bold text-foreground">P{paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Connected Accounts / Wallet */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Wallet — Connected Accounts</h2>
          <Button variant="outline" size="sm" onClick={() => setWalletOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
        </div>
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground"><Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No accounts connected</p><p className="text-sm">Add a bank, mobile money, or card to start withdrawals</p></div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center">
                  {account.providerImg ? <img src={account.providerImg} alt={account.name} className="w-6 h-6 rounded object-contain" /> : getAccountIcon(account.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.details} {account.branchCode ? `• Branch ${account.branchCode}` : ""} {account.accountHolder ? `• ${account.accountHolder}` : ""}</p>
                </div>
                {account.isDefault ? (
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Default</span>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleSetDefault(account.id)}>Set default</Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleRemoveAccount(account.id)}><Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <button onClick={() => setLoanOpen(true)} className="w-full bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center"><Smartphone className="w-6 h-6 text-amber-500" /></div><div><p className="font-semibold text-foreground">Mobile Money Loans</p><p className="text-sm text-muted-foreground">Apply & set your own repayment plan</p></div><ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" /></div>
        </button>
        <button onClick={() => setCapitalOpen(true)} className="w-full bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center"><Wallet className="w-6 h-6 text-amber-500" /></div><div><p className="font-semibold text-foreground">Pata Capital</p><p className="text-sm text-muted-foreground">Business funding — find out more</p></div><ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" /></div>
        </button>
        <button onClick={() => setMoneyTransferOpen(true)} className="w-full bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center"><Send className="w-6 h-6 text-orange-500" /></div><div><p className="font-semibold text-foreground">Send Money</p><p className="text-sm text-muted-foreground">International transfers via Mukuru</p></div><ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" /></div>
        </button>
        <button onClick={() => setFeesOpen(true)} className="w-full bg-card border border-border rounded-2xl p-6 text-left hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center"><Percent className="w-6 h-6 text-muted-foreground" /></div><div><p className="font-semibold text-foreground">Fees</p><p className="text-sm text-muted-foreground">All fees related to your business</p></div><ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" /></div>
        </button>
      </div>

      {/* Payout History - only withdrawals, cash-ins, outgoing transfers */}
      {(() => {
        const payoutTxs = transactions.filter(tx => tx.amount < 0 || tx.payment_method === "payout" || tx.type === "payout" || tx.type === "withdrawal" || tx.type === "cash_in");
        return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border"><h2 className="text-lg font-semibold text-foreground">Payout History</h2></div>
        {payoutTxs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground"><Wallet className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No payouts yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted"><tr><th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Destination</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th><th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th></tr></thead>
              <tbody>
                {payoutTxs.slice(0, 20).map((tx) => (
                  <tr key={tx.id} className="border-t border-border hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedTx(tx)}>
                    <td className="p-4"><span className="font-medium text-foreground capitalize">{tx.payment_method === "payout" ? "Withdrawal" : tx.payment_method.replace("_", " ")}</span></td>
                    <td className="p-4 text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className={`p-4 font-semibold ${tx.amount < 0 ? "text-destructive" : "text-foreground"}`}>{tx.amount < 0 ? "-" : ""}P{Math.abs(tx.amount).toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground text-sm max-w-[200px] truncate">{tx.description || "—"}</td>
                    <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>{getStatusIcon(tx.status)}{tx.status}</span></td>
                    <td className="p-4"><button className="p-2 hover:bg-muted rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedTx(tx); }}><Eye className="w-4 h-4 text-muted-foreground" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        );
      })()}

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          {selectedTx && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className={`text-3xl font-bold ${selectedTx.amount < 0 ? "text-destructive" : "text-foreground"}`}>{selectedTx.amount < 0 ? "-" : ""}P{Math.abs(selectedTx.amount).toFixed(2)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTx.status)}`}>{selectedTx.status}</span>
              </div>
              <div className="space-y-3 bg-muted rounded-xl p-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-medium text-foreground">{selectedTx.id.slice(0, 8)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{new Date(selectedTx.created_at).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium text-foreground capitalize">{selectedTx.payment_method.replace("_", " ")}</span></div>
                {selectedTx.description && <div className="flex justify-between"><span className="text-muted-foreground">Destination</span><span className="font-medium text-foreground text-right max-w-[200px]">{selectedTx.description}</span></div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{addAccountType ? `Add ${addAccountType === "bank" ? "Bank Account" : addAccountType === "mobile" ? "Mobile Money" : "Card"}` : "Connect Account"}</DialogTitle></DialogHeader>
          {!addAccountType && (
            <div className="space-y-3 py-2">
              <button onClick={() => setAddAccountType("bank")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Building2 className="w-5 h-5 text-muted-foreground" /><div className="text-left"><p className="font-medium">Bank Account</p><p className="text-xs text-muted-foreground">FNB, Access Bank, Stanbic</p></div></button>
              <button onClick={() => setAddAccountType("mobile")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Smartphone className="w-5 h-5 text-muted-foreground" /><div className="text-left"><p className="font-medium">Mobile Money</p><p className="text-xs text-muted-foreground">Orange, Smega, MyZaka</p></div></button>
              <button onClick={() => setAddAccountType("card")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"><CreditCard className="w-5 h-5 text-muted-foreground" /><div className="text-left"><p className="font-medium">Debit/Credit Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard</p></div></button>
            </div>
          )}
          {addAccountType === "bank" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Bank Name</Label><Input value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} placeholder="e.g. First National Bank" /></div>
              <div className="space-y-2"><Label>Account Number</Label><Input value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} placeholder="Enter account number" /></div>
              <div className="space-y-2"><Label>Branch Code</Label><Input value={form.branchCode} onChange={e => setForm({ ...form, branchCode: e.target.value })} placeholder="e.g. 250655" /></div>
              <div className="space-y-2"><Label>Account Holder</Label><Input value={form.accountHolder} onChange={e => setForm({ ...form, accountHolder: e.target.value })} placeholder="Account holder name" /></div>
              <DialogFooter><Button variant="outline" onClick={() => setAddAccountType("")}>Back</Button><Button onClick={handleAddBank}>Connect</Button></DialogFooter>
            </div>
          )}
          {addAccountType === "mobile" && !selectedProvider && (
            <div className="space-y-3 py-2">
              {mobileMoneyProviders.map(p => (
                <button key={p.id} onClick={() => setSelectedProvider(p.id)} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50"><img src={p.img} alt={p.name} className="w-8 h-8 rounded object-contain" /><span className="font-medium">{p.name}</span></button>
              ))}
              <Button variant="outline" onClick={() => setAddAccountType("")} className="w-full">Back</Button>
            </div>
          )}
          {addAccountType === "mobile" && selectedProvider && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl"><img src={mobileMoneyProviders.find(p => p.id === selectedProvider)?.img} alt="" className="w-8 h-8 rounded object-contain" /><span className="font-medium">{mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}</span></div>
              <div className="space-y-2"><Label>Phone Number</Label><Input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="e.g. 71234567" inputMode="tel" /></div>
              <DialogFooter><Button variant="outline" onClick={() => setSelectedProvider("")}>Back</Button><Button onClick={handleAddMobile}>Connect</Button></DialogFooter>
            </div>
          )}
          {addAccountType === "card" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Card Number</Label><Input value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })} placeholder="4242 4242 4242 4242" maxLength={19} inputMode="numeric" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Expiry Date</Label><Input value={form.cardExpiry} onChange={e => setForm({ ...form, cardExpiry: formatExpiry(e.target.value) })} placeholder="MM/YY" maxLength={5} inputMode="numeric" /></div>
                <div className="space-y-2"><Label>CVV</Label><Input value={form.cardCvv} onChange={e => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" maxLength={4} inputMode="numeric" type="password" /></div>
              </div>
              <div className="space-y-2"><Label>Cardholder Name</Label><Input value={form.cardHolder} onChange={e => setForm({ ...form, cardHolder: e.target.value })} placeholder="Name on card" /></div>
              <DialogFooter><Button variant="outline" onClick={() => setAddAccountType("")}>Back</Button><Button onClick={handleAddCard}>Connect</Button></DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={(o) => { if (!o) setWithdrawOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>
            {withdrawStep === "select" && "Withdraw Funds"}
            {withdrawStep === "confirm" && "Confirm Withdrawal"}
            {withdrawStep === "processing" && "Processing..."}
            {withdrawStep === "success" && "Withdrawal Sent!"}
          </DialogTitle></DialogHeader>
          {withdrawStep === "select" && (
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Amount (P)</Label><Input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="text-xl font-bold h-12 text-center" /><p className="text-xs text-muted-foreground text-center">Available: P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
              <p className="text-sm text-muted-foreground">Select destination:</p>
              {accounts.length === 0 ? <p className="text-center py-4 text-muted-foreground text-sm">No connected accounts. Add one first.</p> : accounts.map(a => (
                <button key={a.id} onClick={() => { setWithdrawAccount(a); setWithdrawStep("confirm"); }} className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 text-left">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">{a.providerImg ? <img src={a.providerImg} alt="" className="w-6 h-6 rounded object-contain" /> : getAccountIcon(a.type)}</div>
                  <div className="flex-1"><p className="font-medium text-foreground">{a.name}</p><p className="text-xs text-muted-foreground">{a.details} {a.branchCode ? `• Branch ${a.branchCode}` : ""}</p></div>
                  {a.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                </button>
              ))}
            </div>
          )}
          {withdrawStep === "confirm" && withdrawAccount && (
            <div className="space-y-4 py-2">
              <div className="bg-muted rounded-xl p-4 text-center"><p className="text-sm text-muted-foreground">You will receive</p><p className="text-3xl font-bold text-foreground">P{(withdrawAmountNum - withdrawFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Amount</span><span className="text-sm font-medium">P{withdrawAmountNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Fee (0.5%)</span><span className="text-sm font-medium text-destructive">-P{withdrawFee.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-2"><span className="text-sm font-semibold">Net</span><span className="text-sm font-bold">P{(withdrawAmountNum - withdrawFee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>
              <div className="bg-muted rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center">{withdrawAccount.providerImg ? <img src={withdrawAccount.providerImg} alt="" className="w-5 h-5 rounded object-contain" /> : getAccountIcon(withdrawAccount.type)}</div>
                <div><p className="text-sm font-medium">{withdrawAccount.name}</p><p className="text-xs text-muted-foreground">{withdrawAccount.details} {withdrawAccount.branchCode ? `• Branch ${withdrawAccount.branchCode}` : ""}</p></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setWithdrawStep("select")}>Back</Button><Button onClick={handleWithdraw}><Zap className="w-4 h-4 mr-2" /> Confirm</Button></DialogFooter>
            </div>
          )}
          {withdrawStep === "processing" && (
            <div className="py-12 text-center space-y-4"><div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" /><p className="text-muted-foreground">Processing withdrawal...</p></div>
          )}
          {withdrawStep === "success" && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-lg font-bold">Withdrawal Sent!</h3>
              <p className="text-sm text-muted-foreground">P{(withdrawAmountNum - withdrawFee).toLocaleString(undefined, { minimumFractionDigits: 2 })} is on its way to {withdrawAccount?.name}</p>
              <Button onClick={() => setWithdrawOpen(false)} className="w-full">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CapitalDialog open={capitalOpen} onClose={() => setCapitalOpen(false)} />
      <FeesDialog open={feesOpen} onClose={() => setFeesOpen(false)} />
      <MobileMoneyTransferSheet open={moneyTransferOpen} onClose={() => setMoneyTransferOpen(false)} />
      <MobileLoanApplicationSheet open={loanOpen} onClose={() => setLoanOpen(false)} />
    </DashboardLayout>
  );
};

export default Payouts;
