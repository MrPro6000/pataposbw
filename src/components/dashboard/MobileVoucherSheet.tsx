import { useState } from "react";
import { X, ChevronLeft, Ticket, Copy, CheckCircle, Plus, Building2, Smartphone, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useVouchers } from "@/hooks/useVouchers";
import { getConnectedAccounts, ConnectedAccount } from "./MobileWalletSheet";
import { format } from "date-fns";

interface MobileVoucherSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileVoucherSheet = ({ open, onClose }: MobileVoucherSheetProps) => {
  const { toast } = useToast();
  const { vouchers, createVoucher } = useVouchers();
  const [view, setView] = useState<"list" | "create" | "select_account" | "success">("list");
  const [form, setForm] = useState({ amount: "", recipientName: "", recipientPhone: "" });
  const [creating, setCreating] = useState(false);
  const [createdVoucher, setCreatedVoucher] = useState<{ code: string; amount: number; recipientPhone: string } | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);

  const accounts = getConnectedAccounts();

  const handleProceedToAccount = () => {
    if (!form.amount) { toast({ title: "Enter an amount", variant: "destructive" }); return; }
    if (accounts.length === 0) {
      toast({ title: "No connected accounts", description: "Add a bank or mobile money account in your Wallet first.", variant: "destructive" });
      return;
    }
    setView("select_account");
  };

  const handleSelectAndCreate = async (account: ConnectedAccount) => {
    setSelectedAccount(account);
    setCreating(true);
    const res = await createVoucher({
      amount: parseFloat(form.amount),
      recipient_name: form.recipientName || undefined,
      recipient_phone: form.recipientPhone || undefined,
    });
    setCreating(false);
    if (res.error) { toast({ title: "Error", description: res.error, variant: "destructive" }); return; }
    setCreatedVoucher({ code: res.data?.code || "", amount: parseFloat(form.amount), recipientPhone: form.recipientPhone });
    setView("success");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Voucher code copied!" });
  };

  const resetForm = () => {
    setForm({ amount: "", recipientName: "", recipientPhone: "" });
    setCreatedVoucher(null);
    setSelectedAccount(null);
    setView("list");
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (status === "redeemed") return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  const getAccountIcon = (type: string) => {
    if (type === "bank") return <Building2 className="w-5 h-5 text-muted-foreground" />;
    if (type === "mobile_money") return <Smartphone className="w-5 h-5 text-muted-foreground" />;
    if (type === "card") return <CreditCard className="w-5 h-5 text-muted-foreground" />;
    return <Wallet className="w-5 h-5 text-muted-foreground" />;
  };

  const getTitle = () => {
    if (view === "create") return "Create Voucher";
    if (view === "select_account") return "Fund From";
    if (view === "success") return "Voucher Created!";
    return "Vouchers";
  };

  const handleBack = () => {
    if (view === "select_account") setView("create");
    else if (view === "create") resetForm();
    else onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) { resetForm(); onClose(); } }} dismissible={false}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">{getTitle()}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {/* SUCCESS */}
          {view === "success" && createdVoucher && (
            <div className="space-y-5">
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-bold text-foreground mb-1">Voucher Created!</p>
                <p className="text-muted-foreground">P{createdVoucher.amount.toFixed(2)}</p>
                {selectedAccount && (
                  <p className="text-xs text-muted-foreground mt-1">Funded from {selectedAccount.name} ({selectedAccount.details})</p>
                )}
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">Voucher Code</p>
                <p className="text-2xl font-bold font-mono text-foreground tracking-wider">{createdVoucher.code}</p>
              </div>
              {createdVoucher.recipientPhone && (
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Send this code to</p>
                  <p className="text-lg font-semibold text-foreground">{createdVoucher.recipientPhone}</p>
                </div>
              )}
              <Button onClick={() => handleCopy(createdVoucher.code)} className="w-full h-12">
                <Copy className="w-4 h-4 mr-2" /> Copy Code
              </Button>
              <Button variant="outline" onClick={resetForm} className="w-full h-12">Done</Button>
            </div>
          )}

          {/* SELECT ACCOUNT */}
          {view === "select_account" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Which account should fund this P{form.amount} voucher?</p>
              <div className="space-y-2">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAndCreate(account)}
                    disabled={creating}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border bg-card active:bg-muted/50 transition-colors disabled:opacity-50 text-left"
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
                    {account.isDefault && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                  </button>
                ))}
              </div>
              {creating && (
                <p className="text-center text-sm text-muted-foreground animate-pulse">Creating voucher...</p>
              )}
            </div>
          )}

          {/* LIST */}
          {view === "list" && (
            <>
              <Button onClick={() => setView("create")} className="w-full mb-5 font-medium">
                <Plus className="w-4 h-4 mr-2" /> Create New Voucher
              </Button>
              {vouchers.length === 0 ? (
                <div className="text-center py-10">
                  <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No vouchers yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vouchers.map((v) => (
                    <div key={v.id} className="bg-muted rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono font-bold text-foreground">{v.code}</p>
                          <p className="text-xs text-muted-foreground">
                            {v.recipient_name || "No recipient"} • {format(new Date(v.created_at), "MMM d, h:mm a")}
                          </p>
                          {v.recipient_phone && (
                            <p className="text-xs text-muted-foreground">📱 {v.recipient_phone}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">P{v.amount.toFixed(2)}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(v.status)}`}>{v.status}</span>
                        </div>
                      </div>
                      {v.status === "active" && (
                        <Button variant="outline" size="sm" onClick={() => handleCopy(v.code)} className="w-full mt-2">
                          <Copy className="w-3 h-3 mr-1" /> Copy Code
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CREATE */}
          {view === "create" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-foreground">Voucher Amount (P) *</Label>
                <Input type="number" placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="text-xl font-bold h-12 bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Recipient Name (optional)</Label>
                <Input placeholder="Who is this for?" value={form.recipientName}
                  onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Recipient Phone (optional)</Label>
                <Input type="tel" placeholder="+267 71 234 5678" value={form.recipientPhone}
                  onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <p className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
                A unique voucher code will be generated. You'll choose which connected account to fund it from next.
              </p>
              <Button onClick={handleProceedToAccount} className="w-full h-12 font-semibold">
                Next — Choose Account
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileVoucherSheet;
