import { useState } from "react";
import { X, ChevronLeft, FileText, Plus, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useInvoices } from "@/hooks/useInvoices";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

interface MobileInvoiceSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobileInvoiceSheet = ({ open, onClose }: MobileInvoiceSheetProps) => {
  const { toast } = useToast();
  const { invoices, createInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const { addTransaction } = useTransactions();
  const [view, setView] = useState<"list" | "create">("list");
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", amount: "", description: "" });
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!form.customerName || !form.amount) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setCreating(true);
    const result = await createInvoice({
      customer_name: form.customerName,
      customer_email: form.customerEmail || undefined,
      customer_phone: form.customerPhone || undefined,
      amount: parseFloat(form.amount),
      description: form.description || undefined,
    });
    // Also record as transaction
    await addTransaction({
      type: "invoice",
      payment_method: "invoice",
      amount: parseFloat(form.amount),
      description: `Invoice • ${form.customerName}${form.description ? ` — ${form.description}` : ""}`,
      status: "pending",
    });
    setCreating(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Invoice Created", description: `Invoice for ${form.customerName} created` });
      setForm({ customerName: "", customerEmail: "", customerPhone: "", amount: "", description: "" });
      setView("list");
    }
  };

  const handleMarkPaid = async (id: string) => {
    const result = await updateInvoice(id, { status: "paid", paid_at: new Date().toISOString() });
    if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    else toast({ title: "Invoice marked as paid" });
  };

  const handleDelete = async (id: string) => {
    const result = await deleteInvoice(id);
    if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    else toast({ title: "Invoice deleted" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", icon: <CheckCircle className="w-3 h-3" /> };
      case "draft": return { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", icon: <Clock className="w-3 h-3" /> };
      default: return { bg: "bg-muted", text: "text-muted-foreground", icon: <Clock className="w-3 h-3" /> };
    }
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) { setView("list"); onClose(); } }} dismissible={false}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => view === "create" ? setView("list") : onClose()}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">
                {view === "create" ? "New Invoice" : "Invoices"}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {view === "list" ? (
            <>
              <Button onClick={() => setView("create")} className="w-full mb-5 font-medium">
                <Plus className="w-4 h-4 mr-2" /> Create New Invoice
              </Button>

              {invoices.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No invoices yet</p>
                  <p className="text-sm text-muted-foreground/70">Create your first invoice above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => {
                    const badge = getStatusBadge(inv.status);
                    return (
                      <div key={inv.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{inv.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {inv.invoice_number} • {format(new Date(inv.created_at), "MMM d, yyyy")}
                            </p>
                            {inv.description && <p className="text-xs text-muted-foreground mt-1">{inv.description}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{inv.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                              {badge.icon} {inv.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {inv.status === "draft" && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkPaid(inv.id)} className="flex-1">
                              <CheckCircle className="w-3 h-3 mr-1" /> Mark Paid
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleDelete(inv.id)} className="text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-foreground">Customer Name *</Label>
                <Input placeholder="Enter customer name" value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Amount (P) *</Label>
                <Input type="number" placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="text-xl font-bold h-12 bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Email</Label>
                <Input type="email" placeholder="customer@example.com" value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Phone</Label>
                <Input type="tel" placeholder="+267 71 234 5678" value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Description (optional)</Label>
                <Input placeholder="What is this invoice for?" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full h-12 font-semibold">
                {creating ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileInvoiceSheet;
