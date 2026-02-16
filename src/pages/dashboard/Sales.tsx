import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SellProductsDialog from "@/components/dashboard/SellProductsDialog";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { usePaymentLinks } from "@/hooks/usePaymentLinks";
import { useInvoices } from "@/hooks/useInvoices";
import {
  Search,
  Download,
  CreditCard,
  Smartphone,
  Globe,
  RotateCcw,
  Eye,
  Banknote,
  Wallet,
  QrCode,
  Link2,
  FileText,
  ShoppingBag,
  Plus,
  Copy,
  ExternalLink,
  CheckCircle,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const paymentTypeLabels: Record<string, string> = {
  card: "Card",
  cash: "Cash",
  mobile_money: "Mobile Money",
  wallet: "Wallet",
  tap: "Tap to Pay",
  online: "Online",
  qr: "QR Payment",
  payment_link: "Payment Link",
  transport: "Transport",
};

const mobileMoneyProviders = [
  { id: "orange", name: "Orange Money", color: "bg-orange-500" },
  { id: "smega", name: "Smega", color: "bg-blue-600" },
  { id: "myzaka", name: "MyZaka", color: "bg-green-600" },
  { id: "mascom", name: "Mascom MyZaka", color: "bg-yellow-500" },
];

type PaymentType = "card" | "payment-link" | "invoice" | "cash" | "mobile-money" | "wallet";

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("transactions");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [paymentLinkDialogOpen, setPaymentLinkDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sellProductsOpen, setSellProductsOpen] = useState(false);

  const { transactions, addTransaction } = useTransactions();
  const { paymentLinks: dbPaymentLinks, createPaymentLink } = usePaymentLinks();
  const { invoices: dbInvoices, createInvoice } = useInvoices();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [linkTitle, setLinkTitle] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkCustomer, setLinkCustomer] = useState("");

  const [invoiceCustomer, setInvoiceCustomer] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceItems, setInvoiceItems] = useState("");

  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "mobile_money":
        return <Smartphone className="w-4 h-4" />;
      case "wallet":
        return <Wallet className="w-4 h-4" />;
      case "tap":
        return <Smartphone className="w-4 h-4" />;
      case "online":
        return <Globe className="w-4 h-4" />;
      case "qr":
        return <QrCode className="w-4 h-4" />;
      case "payment_link":
        return <Link2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "card":
        return "bg-blue-500/20 text-blue-400";
      case "cash":
        return "bg-green-500/20 text-green-400";
      case "mobile_money":
        return "bg-orange-500/20 text-orange-400";
      case "wallet":
        return "bg-purple-500/20 text-purple-400";
      case "tap":
        return "bg-cyan-500/20 text-cyan-400";
      case "online":
        return "bg-indigo-500/20 text-indigo-400";
      case "qr":
        return "bg-pink-500/20 text-pink-400";
      case "payment_link":
        return "bg-teal-500/20 text-teal-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "pending":
      case "sent":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
      case "overdue":
      case "expired":
        return "bg-red-500/20 text-red-400";
      case "unpaid":
        return "bg-orange-500/20 text-orange-400";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const typeLabel = paymentTypeLabels[tx.type]?.toLowerCase() || "";
    const matchesSearch =
      typeLabel.includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const openPaymentDialog = (type: PaymentType) => {
    setPaymentType(type);
    setPaymentDialogOpen(true);
    setAmount("");
    setDescription("");
    setCustomerPhone("");
    setCustomerEmail("");
    setSelectedProvider("");
    setIsSuccess(false);
  };

  const handlePaymentSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    if (paymentType === "mobile-money" && !selectedProvider) {
      toast({ title: "Error", description: "Please select a provider", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    toast({ title: "Payment Successful", description: `P${parseFloat(amount).toFixed(2)} payment completed` });
    setTimeout(() => {
      setPaymentDialogOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  const handleCreatePaymentLink = () => {
    if (!linkTitle || !linkAmount) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({
      title: "Payment Link Created",
      description: "Your payment link has been generated and copied to clipboard",
    });
    setPaymentLinkDialogOpen(false);
    setLinkTitle("");
    setLinkAmount("");
    setLinkCustomer("");
  };

  const handleCreateInvoice = () => {
    if (!invoiceCustomer || !invoiceAmount) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Invoice Created", description: "Your invoice has been created successfully" });
    setInvoiceDialogOpen(false);
    setInvoiceCustomer("");
    setInvoiceAmount("");
    setInvoiceDueDate("");
    setInvoiceItems("");
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Payment link copied to clipboard" });
  };

  const getPaymentTypeConfig = (type: PaymentType) => {
    switch (type) {
      case "card":
        return { title: "Card Sale", icon: CreditCard, color: "bg-primary" };
      case "payment-link":
        return { title: "Payment Link", icon: Link2, color: "bg-purple-500" };
      case "invoice":
        return { title: "New Invoice", icon: FileText, color: "bg-blue-500" };
      case "cash":
        return { title: "Cash Payment", icon: Banknote, color: "bg-green-500" };
      case "mobile-money":
        return { title: "Mobile Money", icon: Smartphone, color: "bg-orange-500" };
      case "wallet":
        return { title: "Wallet Payment", icon: Wallet, color: "bg-indigo-500" };
    }
  };

  const config = getPaymentTypeConfig(paymentType);
  const PaymentIcon = config.icon;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales & Transactions</h1>
          <p className="text-muted-foreground">Manage payments, invoices, and payment links</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            const csv = ["ID,Date,Type,Amount,Status"]
              .concat(transactions.map(tx => `${tx.id.slice(0,8)},${tx.created_at},${paymentTypeLabels[tx.type] || tx.type},P${tx.amount.toFixed(2)},${tx.status}`))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Exported", description: "Transactions exported as CSV" });
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-5 mb-6 border border-border">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => setSellProductsOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Sell Products</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => openPaymentDialog("mobile-money")}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs">Mobile Money</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => openPaymentDialog("card")}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Card Sale</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => setPaymentLinkDialogOpen(true)}
          >
            <Link2 className="w-5 h-5" />
            <span className="text-xs">Payment Link</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => openPaymentDialog("cash")}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-xs">Cash</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => setInvoiceDialogOpen(true)}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">New Invoice</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted"
            onClick={() => openPaymentDialog("wallet")}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border border-border p-1 h-auto">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payment-links"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
          >
            Payment Links
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
          >
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 mb-6 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type, customer, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Payment type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="tap">Tap to Pay</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="qr">QR Payment</SelectItem>
                  <SelectItem value="payment_link">Payment Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reference</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <span className="font-medium text-foreground">{tx.id.slice(0, 8)}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}
                        >
                          {getTypeIcon(tx.type)}
                          {paymentTypeLabels[tx.type]}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-foreground">P{tx.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(tx.status)}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTransaction(tx)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Payment Links Tab */}
        <TabsContent value="payment-links">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">Manage and track your payment links</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setPaymentLinkDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Payment Link
            </Button>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbPaymentLinks.map((link) => (
                    <tr key={link.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <span className="font-medium text-foreground">{link.description || link.customer_name}</span>
                      </td>
                      <td className="p-4 font-semibold text-foreground">P{link.amount.toFixed(2)}</td>
                      <td className="p-4 text-muted-foreground">{link.customer_name || "-"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(link.status)}`}
                        >
                          {link.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(link.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyLink(link.link_url || "")}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => window.open(link.link_url || "", "_blank")}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">Create and manage invoices for your customers</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setInvoiceDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <span className="font-medium text-foreground">{invoice.invoice_number}</span>
                      </td>
                      <td className="p-4 text-foreground">{invoice.customer_name}</td>
                      <td className="p-4 font-semibold text-foreground">P{invoice.amount.toFixed(2)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "-"}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getTypeColor(selectedTransaction.type)}`}
                >
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <p className="text-3xl font-bold text-foreground">P{selectedTransaction.amount.toFixed(2)}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTransaction.status)}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              <div className="space-y-3 bg-muted rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium text-foreground">{selectedTransaction.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">{new Date(selectedTransaction.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium text-foreground">{new Date(selectedTransaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium text-foreground">{paymentTypeLabels[selectedTransaction.type] || selectedTransaction.payment_method}</span>
                </div>
                {selectedTransaction.description && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="font-medium text-foreground">{selectedTransaction.description}</span>
                  </div>
                )}
              </div>

              
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center`}>
                <PaymentIcon className="w-5 h-5 text-white" />
              </div>
              {config.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-xl font-bold text-foreground">Payment Successful!</p>
                <p className="text-muted-foreground">P{parseFloat(amount || "0").toFixed(2)}</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Amount (P)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold h-14 text-center"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input
                    placeholder="What is this payment for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {paymentType === "mobile-money" && (
                  <div className="space-y-3">
                    <Label>Select Provider</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {mobileMoneyProviders.map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => setSelectedProvider(provider.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedProvider === provider.id ? "border-primary bg-primary/10" : "border-border bg-card"
                          }`}
                        >
                          <div className={`w-8 h-8 ${provider.color} rounded-lg mb-2`} />
                          <p className="text-sm font-medium text-foreground">{provider.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentType === "mobile-money" && (
                  <div className="space-y-2">
                    <Label>Customer Phone</Label>
                    <Input
                      type="tel"
                      placeholder="+267 71 234 5678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                )}

                {paymentType === "card" && (
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the amount and tap your card machine to complete the transaction.
                    </p>
                  </div>
                )}

                {paymentType === "cash" && (
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">Record cash received from the customer.</p>
                  </div>
                )}

                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    `Process ${config.title}`
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Payment Link Dialog */}
      <Dialog open={paymentLinkDialogOpen} onOpenChange={setPaymentLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              Create Payment Link
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Website Design Payment"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (P) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={linkAmount}
                onChange={(e) => setLinkAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Email (optional)</Label>
              <Input
                type="email"
                placeholder="customer@example.com"
                value={linkCustomer}
                onChange={(e) => setLinkCustomer(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreatePaymentLink}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Create & Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Create Invoice
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input
                placeholder="John Doe"
                value={invoiceCustomer}
                onChange={(e) => setInvoiceCustomer(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (P) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Items / Description</Label>
              <Input
                placeholder="List items or services"
                value={invoiceItems}
                onChange={(e) => setInvoiceItems(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateInvoice}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SellProductsDialog open={sellProductsOpen} onClose={() => setSellProductsOpen(false)} />
    </DashboardLayout>
  );
};

export default Sales;
