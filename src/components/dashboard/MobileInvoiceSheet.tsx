import { useState, useEffect } from "react";
import { X, ChevronLeft, FileText, Plus, CheckCircle, Clock, Trash2, Download, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useInvoices, InvoiceItem } from "@/hooks/useInvoices";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePdf, InvoicePdfData } from "@/lib/invoicePdf";
import { format } from "date-fns";

interface MobileInvoiceSheetProps {
  open: boolean;
  onClose: () => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

const emptyLine = (): LineItem => ({ id: crypto.randomUUID(), description: "", quantity: "1", unitPrice: "" });

const MobileInvoiceSheet = ({ open, onClose }: MobileInvoiceSheetProps) => {
  const { toast } = useToast();
  const { invoices, createInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const { addTransaction } = useTransactions();
  const { userProfile } = useAuth();
  const [view, setView] = useState<"list" | "create">("list");
  const [creating, setCreating] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLine()]);

  // Business branding
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);

  useEffect(() => {
    // Load business logo from avatars bucket
    if (userProfile?.avatar_url) {
      setBusinessLogo(userProfile.avatar_url);
    }
  }, [userProfile]);

  const resetForm = () => {
    setCustomerName(""); setCustomerEmail(""); setCustomerPhone("");
    setCustomerAddress(""); setDueDate(""); setNotes("");
    setLineItems([emptyLine()]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(prev => prev.map(li => li.id === id ? { ...li, [field]: value } : li));
  };

  const addLineItem = () => setLineItems(prev => [...prev, emptyLine()]);

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter(li => li.id !== id));
  };

  const calcTotal = (li: LineItem) => (parseFloat(li.quantity) || 0) * (parseFloat(li.unitPrice) || 0);
  const subtotal = lineItems.reduce((sum, li) => sum + calcTotal(li), 0);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `invoice-logos/${userProfile?.user_id || "anon"}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
    setBusinessLogo(urlData.publicUrl);
    toast({ title: "Logo uploaded" });
  };

  const handleCreate = async () => {
    if (!customerName || lineItems.every(li => !li.description || !li.unitPrice)) {
      toast({ title: "Error", description: "Add customer name and at least one item", variant: "destructive" });
      return;
    }
    setCreating(true);
    const validItems = lineItems.filter(li => li.description && li.unitPrice);
    const result = await createInvoice({
      customer_name: customerName,
      customer_email: customerEmail || undefined,
      customer_phone: customerPhone || undefined,
      customer_address: customerAddress || undefined,
      amount: subtotal,
      description: validItems.map(li => li.description).join(", "),
      due_date: dueDate || undefined,
      notes: notes || undefined,
    }, validItems.map(li => ({
      description: li.description,
      quantity: parseFloat(li.quantity) || 1,
      unit_price: parseFloat(li.unitPrice) || 0,
    })));

    await addTransaction({
      type: "invoice",
      payment_method: "invoice",
      amount: subtotal,
      description: `Invoice • ${customerName}`,
      status: "pending",
    });

    setCreating(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Invoice Created", description: `Invoice for ${customerName} created` });
      resetForm();
      setView("list");
    }
  };

  const handleDownloadPdf = async (inv: any) => {
    // Fetch line items for this invoice
    const { data: items } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", inv.id);

    const pdfItems = (items || []).map((it: any) => ({
      description: it.description,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unit_price),
      total: Number(it.total),
    }));

    // If no line items, create a single item from invoice description
    if (pdfItems.length === 0) {
      pdfItems.push({ description: inv.description || "Service", quantity: 1, unitPrice: inv.amount, total: inv.amount });
    }

    const pdfData: InvoicePdfData = {
      invoiceNumber: inv.invoice_number,
      date: format(new Date(inv.created_at), "MMM d, yyyy"),
      dueDate: inv.due_date ? format(new Date(inv.due_date), "MMM d, yyyy") : undefined,
      businessName: userProfile?.business_name || undefined,
      businessEmail: userProfile?.email || undefined,
      businessPhone: userProfile?.phone || undefined,
      businessLogoUrl: businessLogo || undefined,
      customerName: inv.customer_name,
      customerEmail: inv.customer_email || undefined,
      customerPhone: inv.customer_phone || undefined,
      customerAddress: inv.customer_address || undefined,
      items: pdfItems,
      subtotal: inv.amount,
      notes: inv.notes || undefined,
    };

    const doc = await generateInvoicePdf(pdfData);
    doc.save(`${inv.invoice_number}.pdf`);
    toast({ title: "PDF Downloaded" });
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
      <DrawerContent className="bg-background max-h-[95vh]">
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
                            {inv.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{inv.description}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{inv.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${badge.bg} ${badge.text}`}>
                              {badge.icon} {inv.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(inv)} className="flex-1">
                            <Download className="w-3 h-3 mr-1" /> PDF
                          </Button>
                          {inv.status === "draft" && (
                            <Button variant="outline" size="sm" onClick={() => handleMarkPaid(inv.id)} className="flex-1">
                              <CheckCircle className="w-3 h-3 mr-1" /> Paid
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
            <div className="space-y-6">
              {/* Business Logo */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {businessLogo ? (
                    <img src={businessLogo} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </label>
                <div>
                  <p className="font-medium text-foreground text-sm">{userProfile?.business_name || "Your Business"}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.phone}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Details</p>
                <Input placeholder="Customer / Business Name *" value={customerName}
                  onChange={e => setCustomerName(e.target.value)} className="bg-muted border-0" />
                <div className="grid grid-cols-2 gap-2">
                  <Input type="email" placeholder="Email" value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)} className="bg-muted border-0" />
                  <Input type="tel" placeholder="Phone" value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)} className="bg-muted border-0" />
                </div>
                <Textarea placeholder="Address (optional)" value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)} className="bg-muted border-0 resize-none" rows={2} />
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items / Services</p>
                {lineItems.map((li, idx) => (
                  <div key={li.id} className="bg-muted rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">Item {idx + 1}</span>
                      {lineItems.length > 1 && (
                        <button onClick={() => removeLineItem(li.id)} className="text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <Input placeholder="Description" value={li.description}
                      onChange={e => updateLineItem(li.id, "description", e.target.value)}
                      className="bg-background border-0 text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Qty</Label>
                        <Input type="number" min="1" value={li.quantity}
                          onChange={e => updateLineItem(li.id, "quantity", e.target.value)}
                          className="bg-background border-0 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Price (P)</Label>
                        <Input type="number" min="0" step="0.01" value={li.unitPrice}
                          onChange={e => updateLineItem(li.id, "unitPrice", e.target.value)}
                          className="bg-background border-0 text-sm" />
                      </div>
                    </div>
                    {calcTotal(li) > 0 && (
                      <p className="text-xs text-right text-muted-foreground">
                        Subtotal: <span className="font-semibold text-foreground">P{calcTotal(li).toFixed(2)}</span>
                      </p>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addLineItem} className="w-full">
                  <Plus className="w-3 h-3 mr-1" /> Add Item
                </Button>
              </div>

              {/* Total */}
              <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">P{subtotal.toFixed(2)}</span>
              </div>

              {/* Due Date & Notes */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Due Date (optional)</Label>
                  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="bg-muted border-0" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Notes (optional)</Label>
                  <Textarea placeholder="Payment terms, bank details, etc." value={notes}
                    onChange={e => setNotes(e.target.value)} className="bg-muted border-0 resize-none" rows={3} />
                </div>
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
