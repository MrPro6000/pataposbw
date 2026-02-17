import { useState } from "react";
import { Wallet, CreditCard, Smartphone, Plus, Building2, Check, Trash2, ChevronRight } from "lucide-react";
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

const MobileWalletSheet = ({ open, onClose }: MobileWalletSheetProps) => {
  const { balance } = useTransactions();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(sharedAccounts);
  const [view, setView] = useState<"main" | "add_type" | "add_bank" | "add_mobile" | "add_card" | "provider_select">("main");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    branchCode: "",
    accountHolder: "",
    cardNumber: "",
    phoneNumber: "",
  });

  const syncAccounts = (updated: ConnectedAccount[]) => {
    setAccounts(updated);
    setConnectedAccounts(updated);
  };

  const resetForm = () => {
    setView("main");
    setSelectedProvider("");
    setForm({ bankName: "", accountNumber: "", branchCode: "", accountHolder: "", cardNumber: "", phoneNumber: "" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddBank = () => {
    if (!form.bankName || !form.accountNumber) {
      toast.error("Please fill in bank name and account number");
      return;
    }
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      type: "bank",
      name: form.bankName,
      details: `•••• ${form.accountNumber.slice(-4)}`,
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

  const handleAddCard = () => {
    if (!form.cardNumber || form.cardNumber.length < 8) {
      toast.error("Please enter a valid card number");
      return;
    }
    const newAccount: ConnectedAccount = {
      id: crypto.randomUUID(),
      type: "card",
      name: "Debit/Credit Card",
      details: `•••• ${form.cardNumber.slice(-4)}`,
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

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "bank": return <Building2 className="w-5 h-5 text-muted-foreground" />;
      case "mobile_money": return <Smartphone className="w-5 h-5 text-muted-foreground" />;
      case "card": return <CreditCard className="w-5 h-5 text-muted-foreground" />;
      default: return <Wallet className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto pb-safe">
        <SheetHeader>
          <SheetTitle>
            {view === "main" && "Wallet"}
            {view === "add_type" && "Connect Account"}
            {view === "add_bank" && "Add Bank Account"}
            {view === "provider_select" && "Select Provider"}
            {view === "add_mobile" && "Add Mobile Money"}
            {view === "add_card" && "Add Card"}
          </SheetTitle>
        </SheetHeader>

        {view === "main" && (
          <div className="space-y-4 py-4">
            {/* Pata Wallet Balance */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-center">
              <Wallet className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/70">Pata Wallet Balance</p>
              <p className="text-3xl font-bold text-primary-foreground mt-1">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>

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
                    <div
                      key={account.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                    >
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
            <div className="space-y-2"><Label>Card Number</Label><Input value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
            <Button onClick={handleAddCard} className="w-full">Connect Card</Button>
            <Button variant="outline" onClick={() => setView("add_type")} className="w-full">Back</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileWalletSheet;
