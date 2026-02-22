import { useState } from "react";
import { X, ChevronLeft, Ticket, Copy, Send, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useVouchers } from "@/hooks/useVouchers";
import { format } from "date-fns";

interface MobileVoucherSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileVoucherSheet = ({ open, onClose }: MobileVoucherSheetProps) => {
  const { toast } = useToast();
  const { vouchers, createVoucher } = useVouchers();
  const [view, setView] = useState<"list" | "create" | "success">("list");
  const [form, setForm] = useState({ amount: "", recipientName: "", recipientPhone: "" });
  const [creating, setCreating] = useState(false);
  const [createdVoucher, setCreatedVoucher] = useState<{ code: string; amount: number } | null>(null);

  const handleCreate = async () => {
    if (!form.amount) { toast({ title: "Enter an amount", variant: "destructive" }); return; }
    setCreating(true);
    const res = await createVoucher({
      amount: parseFloat(form.amount),
      recipient_name: form.recipientName || undefined,
      recipient_phone: form.recipientPhone || undefined,
    });
    setCreating(false);
    if (res.error) { toast({ title: "Error", description: res.error, variant: "destructive" }); return; }
    setCreatedVoucher({ code: res.data?.code || "", amount: parseFloat(form.amount) });
    setView("success");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Voucher code copied!" });
  };

  const resetForm = () => {
    setForm({ amount: "", recipientName: "", recipientPhone: "" });
    setCreatedVoucher(null);
    setView("list");
  };

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-500/10 text-green-600 dark:text-green-400";
    if (status === "redeemed") return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    return "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) { resetForm(); onClose(); } }}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => view !== "list" ? resetForm() : onClose()} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">
                {view === "create" ? "Create Voucher" : view === "success" ? "Voucher Created!" : "Vouchers"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {view === "success" && createdVoucher && (
            <div className="space-y-5">
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-bold text-foreground mb-1">Voucher Created!</p>
                <p className="text-muted-foreground">P{createdVoucher.amount.toFixed(2)}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">Voucher Code</p>
                <p className="text-2xl font-bold font-mono text-foreground tracking-wider">{createdVoucher.code}</p>
              </div>
              <Button onClick={() => handleCopy(createdVoucher.code)} className="w-full h-12">
                <Copy className="w-4 h-4 mr-2" /> Copy Code
              </Button>
              <Button variant="outline" onClick={resetForm} className="w-full h-12">Done</Button>
            </div>
          )}

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
                A unique voucher code will be generated. Share this code with the recipient — they can redeem it for P{form.amount || "0.00"} at any Pata merchant.
              </p>
              <Button onClick={handleCreate} disabled={creating} className="w-full h-12 font-semibold">
                {creating ? "Creating..." : "Generate Voucher"}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileVoucherSheet;
