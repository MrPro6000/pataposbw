import { useState } from "react";
import { Wallet, CreditCard, Smartphone, Plus, Building2, Check, Trash2, ChevronRight, ArrowDownLeft, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import orangeMoneyImg from "@/assets/mobile-money/orange-money.png";
import smegaImg from "@/assets/mobile-money/smega.png";
import myzakaImg from "@/assets/mobile-money/myzaka.png";
import posoMoneyImg from "@/assets/mobile-money/poso-money.png";
import { useTransactions } from "@/hooks/useTransactions";

interface MobileWalletSheetProps {
  open: boolean;
  onClose: () => void;
}

export interface ConnectedAccount {
  id: string;
  type: "bank" | "mobile_money" | "card";
  name: string;
  details: string;
  bankName?: string;
  branchCode?: string;
  accountHolder?: string;
  provider?: string;
  providerImg?: string;
  isDefault: boolean;
}

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", img: orangeMoneyImg },
  { id: "smega", name: "Smega", img: smegaImg },
  { id: "myzaka", name: "MyZaka", img: myzakaImg },
];

// Shared state for connected accounts (in production this would be in DB)
let sharedAccounts: ConnectedAccount[] = [
  {
    id: "default-fnb",
    type: "bank",
    name: "First National Bank",
    details: "•••• 4532",
    bankName: "First National Bank",
    branchCode: "250655",
    accountHolder: "Pata Business (Pty) Ltd",
    isDefault: true,
  },
];

export const getConnectedAccounts = () => sharedAccounts;
export const setConnectedAccounts = (accounts: ConnectedAccount[]) => {
  sharedAccounts = accounts;
};

type WalletView = "main" | "add_type" | "add_bank" | "add_mobile" | "add_card" | "provider_select"
  | "deposit_select" | "deposit_confirm" | "deposit_processing" | "deposit_success";

const MobileWalletSheet = ({ open, onClose }: MobileWalletSheetProps) => {
  const { balance, addTransaction } = useTransactions();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(sharedAccounts);
  const [view, setView] = useState<WalletView>("main");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    branchCode: "",
    accountHolder: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
    phoneNumber: "",
  });

  // Deposit state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositAccount, setDepositAccount] = useState<ConnectedAccount | null>(null);

  const syncAccounts = (updated: ConnectedAccount[]) => {
    setAccounts(updated);
    setConnectedAccounts(updated);
  };

  const resetForm = () => {
    setView("main");
    setSelectedProvider("");
    setForm({ bankName: "", accountNumber: "", branchCode: "", accountHolder: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardHolder: "", phoneNumber: "" });
  };

  const handleClose = () => {
    resetForm();
    setDepositAmount("");
    setDepositAccount(null);
    onClose();
  };

  const handleAddBank = () => {
    if (!form.bankName) {
      toast.error("Please enter a bank name");
      return;
    }
    const digits = form.accountNumber.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 13) {
      toast.error("Account number must be 8-13 digits");
      return;
    }
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      type: "bank",
      name: form.bankName,
      details: `•••• ${digits.slice(-4)}`,
      bankName: form.bankName,
      branchCode: form.branchCode,
      accountHolder: form.accountHolder,
      isDefault: accounts.length === 0,
    };
    syncAccounts([...accounts, newAccount]);
    toast.success("Bank account connected");
    resetForm();
  };

  const handleAddMobile = () => {
    if (!form.phoneNumber) {
      toast.error("Please enter phone number");
      return;
    }
    const digits = form.phoneNumber.replace(/\D/g, "").replace(/^267/, "");
    if (!/^7\d{7}$/.test(digits)) {
      toast.error("Invalid Botswana mobile number. Must start with 7 and be 8 digits.");
      return;
    }
    const provider = mobileMoneyProviders.find(p => p.id === selectedProvider);
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      type: "mobile_money",
      name: provider?.name || "Mobile Money",
      details: form.phoneNumber,
      provider: selectedProvider,
      providerImg: provider?.img,
      isDefault: accounts.length === 0,
    };
    syncAccounts([...accounts, newAccount]);
    toast.success(`${provider?.name} connected`);
    resetForm();
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
    if (digits.length < 13 || digits.length > 16) {
      toast.error("Card number must be 13-16 digits");
      return;
    }
    if (!form.cardExpiry || !/^\d{2}\/\d{2}$/.test(form.cardExpiry)) {
      toast.error("Enter a valid expiry date (MM/YY)");
      return;
    }
    if (!form.cardCvv || !/^\d{3,4}$/.test(form.cardCvv)) {
      toast.error("Enter a valid CVV (3 or 4 digits)");
      return;
    }
    if (!form.cardHolder.trim()) {
      toast.error("Enter the cardholder name");
      return;
    }
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      type: "card",
      name: form.cardHolder.trim(),
      details: `•••• ${digits.slice(-4)}`,
      isDefault: accounts.length === 0,
    };
    syncAccounts([...accounts, newAccount]);
    toast.success("Card connected");
    resetForm();
  };

  const handleSetDefault = (id: string) => {
    const updated = accounts.map(a => ({ ...a, isDefault: a.id === id }));
    syncAccounts(updated);
    toast.success("Default account updated");
  };

  const handleRemove = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    syncAccounts(updated);
    toast.success("Account removed");
  };

  const handleStartDeposit = () => {
    setDepositAmount("");
    setDepositAccount(null);
    setView("deposit_select");
  };

  const handleSelectDepositAccount = (account: ConnectedAccount) => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount first.");
      return;
    }
    setDepositAccount(account);
    setView("deposit_confirm");
  };

  const handleConfirmDeposit = async () => {
    if (!depositAccount) return;
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) { toast.error("Invalid amount"); return; }

    setView("deposit_processing");

    const sourceLabel = depositAccount.type === "bank"
      ? `${depositAccount.name} (${depositAccount.details})`
      : `${depositAccount.name} - ${depositAccount.details}`;

    await addTransaction({
      type: "deposit",
      payment_method: depositAccount.type === "bank" ? "bank_transfer" : depositAccount.type === "mobile_money" ? "mobile_money" : "card",
      amount: amt,
      description: `Top up from ${sourceLabel}`,
      status: "processing",
    });

    setTimeout(() => {
      setView("deposit_success");
    }, 2000);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank": return <Building2 className="w-5 h-5 text-muted-foreground" />;
      case "mobile_money": return <Smartphone className="w-5 h-5 text-muted-foreground" />;
      case "card": return <CreditCard className="w-5 h-5 text-muted-foreground" />;
      default: return <Wallet className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case "main": return "Wallet";
      case "add_type": return "Connect Account";
      case "add_bank": return "Add Bank Account";
      case "provider_select": return "Select Provider";
      case "add_mobile": return "Add Mobile Money";
      case "add_card": return "Add Card";
      case "deposit_select": return "Top Up Wallet";
      case "deposit_confirm": return "Confirm Deposit";
      case "deposit_processing": return "Processing...";
      case "deposit_success": return "Deposit Sent!";
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => {
      if (!o) {
        if (view !== "main") {
          resetForm();
        } else {
          handleClose();
        }
      }
    }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto pb-safe">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
        </SheetHeader>

        {/* ── MAIN VIEW ── */}
        {view === "main" && (
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-center">
              <Wallet className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/70">Pata Wallet Balance</p>
              <p className="text-3xl font-bold text-primary-foreground mt-1">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>

            {/* Top Up Button */}
            <button
              onClick={handleStartDeposit}
              className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary font-semibold rounded-2xl py-4 active:bg-primary/20 transition-colors"
            >
              <ArrowDownLeft className="w-5 h-5" />
              Top Up / Deposit
            </button>

            {/* Connected Accounts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Connected Accounts</h3>
                <button onClick={() => setView("add_type")} className="text-xs text-primary font-medium flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {accounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No accounts connected</p>
                  <p className="text-xs">Add a bank, mobile money, or card</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                      <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                        {account.providerImg ? (
                          <img src={account.providerImg} alt={account.name} className="w-6 h-6 rounded object-contain" />
                        ) : (
                          getAccountIcon(account.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.details}</p>
                      </div>
                      {account.isDefault ? (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>
                      ) : (
                        <button onClick={() => handleSetDefault(account.id)} className="text-[10px] text-muted-foreground hover:text-primary">Set default</button>
                      )}
                      <button onClick={() => handleRemove(account.id)} className="p-1 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Money from sales flows into your Pata Wallet. Use payouts to withdraw to connected accounts.
            </p>
          </div>
        )}

        {/* ── ADD ACCOUNT VIEWS (unchanged) ── */}
        {view === "add_type" && (
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Choose account type to connect</p>
            <button onClick={() => setView("add_bank")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-muted-foreground" /></div>
              <div className="flex-1 text-left"><p className="font-medium text-foreground">Bank Account</p><p className="text-xs text-muted-foreground">FNB, Access Bank, Stanbic, etc.</p></div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => setView("provider_select")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><Smartphone className="w-5 h-5 text-muted-foreground" /></div>
              <div className="flex-1 text-left"><p className="font-medium text-foreground">Mobile Money</p><p className="text-xs text-muted-foreground">Orange, Smega, MyZaka</p></div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => setView("add_card")} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5 text-muted-foreground" /></div>
              <div className="flex-1 text-left"><p className="font-medium text-foreground">Debit / Credit Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard</p></div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <Button variant="outline" onClick={resetForm} className="w-full">Back</Button>
          </div>
        )}

        {view === "add_bank" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="e.g. First National Bank" /></div>
            <div className="space-y-2"><Label>Account Number</Label><Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="Enter account number" /></div>
            <div className="space-y-2"><Label>Branch Code</Label><Input value={form.branchCode} onChange={(e) => setForm({ ...form, branchCode: e.target.value })} placeholder="e.g. 250655" /></div>
            <div className="space-y-2"><Label>Account Holder</Label><Input value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} placeholder="Account holder name" /></div>
            <Button onClick={handleAddBank} className="w-full">Connect Bank Account</Button>
            <Button variant="outline" onClick={() => setView("add_type")} className="w-full">Back</Button>
          </div>
        )}

        {view === "provider_select" && (
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">Select your mobile money provider</p>
            {mobileMoneyProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => { setSelectedProvider(provider.id); setView("add_mobile"); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform"
              >
                <img src={provider.img} alt={provider.name} className="w-10 h-10 rounded-lg object-contain" />
                <span className="font-semibold text-foreground">{provider.name}</span>
              </button>
            ))}
            <Button variant="outline" onClick={() => setView("add_type")} className="w-full">Back</Button>
          </div>
        )}

        {view === "add_mobile" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <img src={mobileMoneyProviders.find(p => p.id === selectedProvider)?.img} alt="" className="w-8 h-8 rounded object-contain" />
              <span className="font-medium text-foreground">{mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}</span>
            </div>
            <div className="space-y-2"><Label>Phone Number</Label><Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="e.g. 71234567" inputMode="tel" /></div>
            <Button onClick={handleAddMobile} className="w-full">Connect Mobile Money</Button>
            <Button variant="outline" onClick={() => setView("provider_select")} className="w-full">Back</Button>
          </div>
        )}

        {view === "add_card" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })} placeholder="4242 4242 4242 4242" maxLength={19} inputMode="numeric" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input value={form.cardExpiry} onChange={(e) => setForm({ ...form, cardExpiry: formatExpiry(e.target.value) })} placeholder="MM/YY" maxLength={5} inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input value={form.cardCvv} onChange={(e) => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" maxLength={4} inputMode="numeric" type="password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cardholder Name</Label>
              <Input value={form.cardHolder} onChange={(e) => setForm({ ...form, cardHolder: e.target.value })} placeholder="Name on card" />
            </div>
            <Button onClick={handleAddCard} className="w-full">Connect Card</Button>
            <Button variant="outline" onClick={() => setView("add_type")} className="w-full">Back</Button>
          </div>
        )}

        {/* ── DEPOSIT: SELECT SOURCE ACCOUNT ── */}
        {view === "deposit_select" && (
          <div className="py-4 space-y-3">
            <div className="space-y-2 mb-4">
              <Label>Amount to Deposit (P)</Label>
              <Input
                type="number"
                inputMode="decimal"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.00"
                className="text-xl font-bold h-12 text-center"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">Current balance: P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <p className="text-sm text-muted-foreground">Select source account:</p>
            {accounts.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No connected accounts.</p>
                <p className="text-xs">Go back to Wallet to connect a bank or mobile money account.</p>
              </div>
            ) : (
              accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSelectDepositAccount(account)}
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
                    <p className="text-xs text-muted-foreground">{account.details}{account.branchCode ? ` • Branch ${account.branchCode}` : ""}</p>
                  </div>
                  {account.isDefault && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))
            )}
            <Button variant="outline" onClick={() => setView("main")} className="w-full">Cancel</Button>
          </div>
        )}

        {/* ── DEPOSIT: CONFIRM ── */}
        {view === "deposit_confirm" && depositAccount && (
          <div className="py-4 space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
              <ArrowDownLeft className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Depositing</p>
              <p className="text-4xl font-bold text-foreground">P{(parseFloat(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-sm font-medium text-foreground">{depositAccount.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="text-sm font-medium text-foreground">{depositAccount.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm font-medium text-foreground">Pata Wallet</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold text-foreground">You'll receive</span>
                <span className="text-sm font-bold text-primary">P{(parseFloat(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Button onClick={handleConfirmDeposit} className="w-full h-12 text-base font-semibold">Confirm Deposit</Button>
            <Button variant="outline" onClick={() => setView("deposit_select")} className="w-full">Back</Button>
          </div>
        )}

        {/* ── DEPOSIT: PROCESSING ── */}
        {view === "deposit_processing" && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="font-semibold text-foreground">Processing your deposit...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        )}

        {/* ── DEPOSIT: SUCCESS ── */}
        {view === "deposit_success" && (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">Deposit Initiated!</p>
              <p className="text-sm text-muted-foreground mt-1">
                P{(parseFloat(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} from {depositAccount?.name} is being processed.
              </p>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Processing</span>
              </div>
            </div>
            <Button onClick={() => { setView("main"); setDepositAmount(""); setDepositAccount(null); }} className="w-full">Done</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileWalletSheet;
