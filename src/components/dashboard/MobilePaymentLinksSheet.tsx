import { useState } from "react";
import { X, ChevronLeft, Link2, Copy, Send, Clock, CheckCircle, XCircle, Share2 } from "lucide-react";
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
import { usePaymentLinks } from "@/hooks/usePaymentLinks";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

interface MobilePaymentLinksSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobilePaymentLinksSheet = ({ open, onClose }: MobilePaymentLinksSheetProps) => {
  const { toast } = useToast();
  const { paymentLinks, createPaymentLink } = usePaymentLinks();
  const { addTransaction } = useTransactions();
  const [view, setView] = useState<"list" | "create" | "success">("list");
  const [newLink, setNewLink] = useState({ amount: "", description: "", customerName: "", customerPhone: "" });
  const [creating, setCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": case "paid": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed": case "paid": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default: return "bg-red-500/10 text-red-600 dark:text-red-400";
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Payment link copied to clipboard" });
  };

  const handleShareLink = async (url: string, customerName: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Payment Link", text: `Pay P${newLink.amount} to complete your payment`, url });
      } catch {}
    } else {
      handleCopyLink(url);
    }
  };

  const handleCreateLink = async () => {
    if (!newLink.amount || !newLink.customerName) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    if (newLink.customerPhone) {
      const digits = newLink.customerPhone.replace(/\D/g, "").replace(/^267/, "");
      if (!/^7\d{7}$/.test(digits)) {
        toast({ title: "Invalid number", description: "Botswana mobile number must start with 7 and be 8 digits.", variant: "destructive" });
        return;
      }
    }
    setCreating(true);
    const result = await createPaymentLink({
      amount: parseFloat(newLink.amount),
      customer_name: newLink.customerName,
      customer_phone: newLink.customerPhone || undefined,
      description: newLink.description || undefined,
    });
    // Also record as transaction
    await addTransaction({
      type: "sale",
      payment_method: "payment_link",
      amount: parseFloat(newLink.amount),
      description: `Payment Link • ${newLink.customerName}${newLink.description ? ` — ${newLink.description}` : ""}`,
      status: "pending",
    });
    setCreating(false);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      setCreatedLink(result.data?.link_url || null);
      setView("success");
    }
  };

  const resetForm = () => {
    setNewLink({ amount: "", description: "", customerName: "", customerPhone: "" });
    setCreatedLink(null);
    setView("list");
  };

  const pendingLinks = paymentLinks.filter(t => t.status === "pending");
  const completedLinks = paymentLinks.filter(t => t.status !== "pending");

  return (
    <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) { resetForm(); onClose(); } }} dismissible={false}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => view !== "list" ? resetForm() : onClose()}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">
                {view === "create" ? "Create Payment Link" : view === "success" ? "Link Created!" : "Payment Links"}
              </DrawerTitle>
            </div>
            <button onClick={() => { resetForm(); onClose(); }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {/* SUCCESS VIEW - Show generated link */}
          {view === "success" && createdLink && (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-bold text-foreground mb-1">Payment Link Created!</p>
                <p className="text-muted-foreground text-center">P{parseFloat(newLink.amount).toFixed(2)} for {newLink.customerName}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2">Share this link with your customer:</p>
                <p className="text-sm text-foreground font-mono break-all">{createdLink}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleCopyLink(createdLink)} className="flex-1 h-12">
                  <Copy className="w-4 h-4 mr-2" /> Copy Link
                </Button>
                <Button onClick={() => handleShareLink(createdLink, newLink.customerName)} className="flex-1 h-12">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
              <Button variant="outline" onClick={resetForm} className="w-full h-12">Done</Button>
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <>
              <Button onClick={() => setView("create")} className="w-full mb-5 font-medium">
                <Link2 className="w-4 h-4 mr-2" />
                Create New Payment Link
              </Button>

              {pendingLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Pending ({pendingLinks.length})</h3>
                  <div className="space-y-3">
                    {pendingLinks.map((link) => (
                      <div key={link.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{link.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                              {link.description || "Payment Link"} • {format(new Date(link.created_at), "MMM d, h:mm a")}
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                              <Clock className="w-3 h-3 inline mr-0.5" />
                              Expires {format(new Date(new Date(link.created_at).getTime() + 24 * 60 * 60 * 1000), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)} {link.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => handleCopyLink(link.link_url || "")} className="flex-1">
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleShareLink(link.link_url || "", link.customer_name)} className="flex-1">
                            <Share2 className="w-3 h-3 mr-1" /> Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedLinks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">History</h3>
                  <div className="space-y-3">
                    {completedLinks.map((link) => (
                      <div key={link.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{link.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {link.description || "Payment Link"} • {format(new Date(link.created_at), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)} {link.status === "completed" ? "Paid" : link.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentLinks.length === 0 && (
                <div className="text-center py-10">
                  <Link2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No payment links yet</p>
                  <p className="text-sm text-muted-foreground/70">Create your first payment link above</p>
                </div>
              )}
            </>
          )}

          {/* CREATE VIEW */}
          {view === "create" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-foreground">Amount (P) *</Label>
                <Input type="number" placeholder="0.00" value={newLink.amount}
                  onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })}
                  className="text-xl font-bold h-12 bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Name *</Label>
                <Input placeholder="Enter customer name" value={newLink.customerName}
                  onChange={(e) => setNewLink({ ...newLink, customerName: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Phone</Label>
                <Input type="tel" placeholder="+267 71 234 5678" value={newLink.customerPhone}
                  onChange={(e) => setNewLink({ ...newLink, customerPhone: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Description (optional)</Label>
                <Input placeholder="What is this payment for?" value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="bg-muted border-0" />
              </div>
              <Button onClick={handleCreateLink} disabled={creating} className="w-full h-12 font-semibold">
                {creating ? "Creating..." : "Create & Get Link"}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentLinksSheet;
