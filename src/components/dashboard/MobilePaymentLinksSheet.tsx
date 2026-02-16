import { useState } from "react";
import { X, ChevronLeft, Link2, Copy, Send, Clock, CheckCircle, XCircle } from "lucide-react";
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
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

interface MobilePaymentLinksSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobilePaymentLinksSheet = ({ open, onClose }: MobilePaymentLinksSheetProps) => {
  const { toast } = useToast();
  const { transactions, addTransaction } = useTransactions();
  const [view, setView] = useState<"list" | "create">("list");
  const [newLink, setNewLink] = useState({ amount: "", description: "", customerName: "", customerPhone: "" });
  const [creating, setCreating] = useState(false);

  // Filter transactions that are payment links
  const paymentLinkTx = transactions.filter(t => t.payment_method === "payment_link");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default: return "bg-red-500/10 text-red-600 dark:text-red-400";
    }
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://pay.pata.co.bw/link/${id}`);
    toast({ title: "Link Copied", description: "Payment link copied to clipboard" });
  };

  const handleResend = (description: string) => {
    toast({ title: "Link Sent", description: `Payment link resent for ${description}` });
  };

  const handleCreateLink = async () => {
    if (!newLink.amount || !newLink.customerName) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    setCreating(true);
    const result = await addTransaction({
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
      toast({ title: "Link Created", description: `Payment link created for ${newLink.customerName}` });
      setNewLink({ amount: "", description: "", customerName: "", customerPhone: "" });
      setView("list");
    }
  };

  const pendingLinks = paymentLinkTx.filter(t => t.status === "pending");
  const completedLinks = paymentLinkTx.filter(t => t.status !== "pending");

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => view === "create" ? setView("list") : onClose()}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">
                {view === "create" ? "Create Payment Link" : "Payment Links"}
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
                <Link2 className="w-4 h-4 mr-2" />
                Create New Payment Link
              </Button>

              {/* Pending Links */}
              {pendingLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Pending ({pendingLinks.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingLinks.map((link) => (
                      <div key={link.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{link.description || "Payment Link"}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(link.created_at), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)}
                              {link.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={() => handleCopyLink(link.id)} className="flex-1">
                            <Copy className="w-3 h-3 mr-1" /> Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResend(link.description || "Payment Link")} className="flex-1">
                            <Send className="w-3 h-3 mr-1" /> Resend
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed / History */}
              {completedLinks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">History</h3>
                  <div className="space-y-3">
                    {completedLinks.map((link) => (
                      <div key={link.id} className="bg-muted rounded-2xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{link.description || "Payment Link"}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(link.created_at), "MMM d, h:mm a")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)}
                              {link.status === "completed" ? "Paid" : link.status}
                            </span>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paymentLinkTx.length === 0 && (
                <div className="text-center py-10">
                  <Link2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No payment links yet</p>
                  <p className="text-sm text-muted-foreground/70">Create your first payment link above</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-foreground">Amount (P) *</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newLink.amount}
                  onChange={(e) => setNewLink({ ...newLink, amount: e.target.value })}
                  className="text-xl font-bold h-12 bg-muted border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Name *</Label>
                <Input
                  placeholder="Enter customer name"
                  value={newLink.customerName}
                  onChange={(e) => setNewLink({ ...newLink, customerName: e.target.value })}
                  className="bg-muted border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Customer Phone</Label>
                <Input
                  type="tel"
                  placeholder="+267 71 234 5678"
                  value={newLink.customerPhone}
                  onChange={(e) => setNewLink({ ...newLink, customerPhone: e.target.value })}
                  className="bg-muted border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Description (optional)</Label>
                <Input
                  placeholder="What is this payment for?"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="bg-muted border-0"
                />
              </div>
              <Button onClick={handleCreateLink} disabled={creating} className="w-full h-12 font-semibold">
                {creating ? "Creating..." : "Create & Send Link"}
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentLinksSheet;
