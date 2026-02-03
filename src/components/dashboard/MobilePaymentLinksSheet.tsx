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

interface MobilePaymentLinksSheetProps {
  open: boolean;
  onClose: () => void;
}

const MobilePaymentLinksSheet = ({ open, onClose }: MobilePaymentLinksSheetProps) => {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "create">("list");
  const [newLink, setNewLink] = useState({ amount: "", description: "", customerName: "", customerPhone: "" });

  const paymentLinks = [
    { id: "1", customer: "John Doe", amount: 150.00, status: "unpaid", createdAt: "2 hours ago", phone: "+267 71 234 5678" },
    { id: "2", customer: "Mary Smith", amount: 75.50, status: "unpaid", createdAt: "5 hours ago", phone: "+267 72 345 6789" },
    { id: "3", customer: "Tech Corp Ltd", amount: 1200.00, status: "unpaid", createdAt: "Yesterday", phone: "+267 73 456 7890" },
    { id: "4", customer: "Alice Johnson", amount: 45.00, status: "paid", createdAt: "2 days ago", phone: "+267 74 567 8901" },
    { id: "5", customer: "Bob Wilson", amount: 320.00, status: "expired", createdAt: "1 week ago", phone: "+267 75 678 9012" },
  ];

  const unpaidLinks = paymentLinks.filter(l => l.status === "unpaid");
  const otherLinks = paymentLinks.filter(l => l.status !== "unpaid");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "unpaid": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "expired": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid": return "status-paid";
      case "unpaid": return "status-unpaid";
      case "expired": return "status-expired";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`https://pay.pata.co.bw/link/${id}`);
    toast({ title: "Link Copied", description: "Payment link copied to clipboard" });
  };

  const handleResend = (customer: string) => {
    toast({ title: "Link Sent", description: `Payment link resent to ${customer}` });
  };

  const handleCreateLink = () => {
    if (!newLink.amount || !newLink.customerName) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Link Created", description: `Payment link sent to ${newLink.customerName}` });
    setNewLink({ amount: "", description: "", customerName: "", customerPhone: "" });
    setView("list");
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-background max-h-[90vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button 
                  onClick={() => view === "create" ? setView("list") : undefined}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
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
              {/* Create New Button */}
              <Button
                onClick={() => setView("create")}
                className="w-full mb-5 font-medium"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Create New Payment Link
              </Button>

              {/* Unpaid Links */}
              {unpaidLinks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Unpaid ({unpaidLinks.length})
                  </h3>
                  <div className="space-y-3">
                    {unpaidLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-muted rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{link.customer}</p>
                            <p className="text-xs text-muted-foreground">{link.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)}
                              {link.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{link.createdAt}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(link.id)}
                            className="flex-1"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResend(link.customer)}
                            className="flex-1"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Resend
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Links */}
              {otherLinks.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">History</h3>
                  <div className="space-y-3">
                    {otherLinks.map((link) => (
                      <div
                        key={link.id}
                        className="bg-muted rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{link.customer}</p>
                            <p className="text-xs text-muted-foreground">{link.createdAt}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">P{link.amount.toFixed(2)}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1 ${getStatusClass(link.status)}`}>
                              {getStatusIcon(link.status)}
                              {link.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Create Link Form */
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

              <Button
                onClick={handleCreateLink}
                className="w-full h-12 font-semibold"
              >
                Create & Send Link
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobilePaymentLinksSheet;
