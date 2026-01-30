import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
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
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: "card" | "cash" | "mobile_money" | "wallet" | "tap" | "online" | "qr" | "payment_link";
  amount: number;
  status: "success" | "pending" | "failed";
  cardLast4?: string;
  customer?: string;
  reference: string;
  provider?: string;
}

interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  url: string;
  status: "paid" | "unpaid" | "expired";
  createdAt: string;
  customer?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

const transactions: Transaction[] = [
  { id: "TXN001", date: "2025-01-28", time: "14:32", type: "card", amount: 150.00, status: "success", cardLast4: "4532", reference: "PAY-001234" },
  { id: "TXN002", date: "2025-01-28", time: "13:45", type: "mobile_money", amount: 89.00, status: "success", provider: "Orange Money", reference: "PAY-001233" },
  { id: "TXN003", date: "2025-01-28", time: "12:20", type: "online", amount: 450.00, status: "success", customer: "john@email.com", reference: "PAY-001232" },
  { id: "TXN004", date: "2025-01-28", time: "11:15", type: "cash", amount: 75.00, status: "success", reference: "PAY-001231" },
  { id: "TXN005", date: "2025-01-28", time: "10:30", type: "tap", amount: 320.00, status: "success", cardLast4: "5567", reference: "PAY-001230" },
  { id: "TXN006", date: "2025-01-27", time: "16:45", type: "wallet", amount: 890.00, status: "success", provider: "MyZaka", reference: "PAY-001229" },
  { id: "TXN007", date: "2025-01-27", time: "15:20", type: "qr", amount: 45.00, status: "success", reference: "PAY-001228" },
  { id: "TXN008", date: "2025-01-27", time: "14:00", type: "payment_link", amount: 1250.00, status: "success", customer: "sarah@email.com", reference: "PAY-001227" },
  { id: "TXN009", date: "2025-01-27", time: "12:30", type: "mobile_money", amount: 200.00, status: "pending", provider: "Smega", reference: "PAY-001226" },
  { id: "TXN010", date: "2025-01-27", time: "10:15", type: "card", amount: 560.00, status: "failed", cardLast4: "3345", reference: "PAY-001225" },
];

const paymentLinks: PaymentLink[] = [
  { id: "PL001", title: "Website Design Payment", amount: 2500, url: "https://pay.pata.bw/pl001", status: "unpaid", createdAt: "2025-01-28", customer: "john@email.com" },
  { id: "PL002", title: "Monthly Subscription", amount: 199, url: "https://pay.pata.bw/pl002", status: "paid", createdAt: "2025-01-27" },
  { id: "PL003", title: "Consulting Fee", amount: 850, url: "https://pay.pata.bw/pl003", status: "unpaid", createdAt: "2025-01-26", customer: "sarah@email.com" },
  { id: "PL004", title: "Product Order #45", amount: 320, url: "https://pay.pata.bw/pl004", status: "expired", createdAt: "2025-01-20" },
];

const invoices: Invoice[] = [
  { id: "INV001", invoiceNumber: "INV-2025-001", customer: "John Doe", amount: 1250, status: "sent", dueDate: "2025-02-15", createdAt: "2025-01-28" },
  { id: "INV002", invoiceNumber: "INV-2025-002", customer: "Sarah Smith", amount: 890, status: "paid", dueDate: "2025-02-10", createdAt: "2025-01-27" },
  { id: "INV003", invoiceNumber: "INV-2025-003", customer: "Mike Johnson", amount: 450, status: "draft", dueDate: "2025-02-20", createdAt: "2025-01-26" },
  { id: "INV004", invoiceNumber: "INV-2025-004", customer: "Emily Brown", amount: 2100, status: "overdue", dueDate: "2025-01-25", createdAt: "2025-01-15" },
];

const paymentTypeLabels: Record<string, string> = {
  card: "Card",
  cash: "Cash",
  mobile_money: "Mobile Money",
  wallet: "Wallet",
  tap: "Tap to Pay",
  online: "Online",
  qr: "QR Payment",
  payment_link: "Payment Link",
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("transactions");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [paymentLinkDialogOpen, setPaymentLinkDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Payment form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Payment Link form state
  const [linkTitle, setLinkTitle] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkCustomer, setLinkCustomer] = useState("");

  // Invoice form state
  const [invoiceCustomer, setInvoiceCustomer] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceItems, setInvoiceItems] = useState("");

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "card": return <CreditCard className="w-4 h-4" />;
      case "cash": return <Banknote className="w-4 h-4" />;
      case "mobile_money": return <Smartphone className="w-4 h-4" />;
      case "wallet": return <Wallet className="w-4 h-4" />;
      case "tap": return <Smartphone className="w-4 h-4" />;
      case "online": return <Globe className="w-4 h-4" />;
      case "qr": return <QrCode className="w-4 h-4" />;
      case "payment_link": return <Link2 className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "card": return "bg-blue-100 text-blue-600";
      case "cash": return "bg-green-100 text-green-600";
      case "mobile_money": return "bg-orange-100 text-orange-600";
      case "wallet": return "bg-purple-100 text-purple-600";
      case "tap": return "bg-cyan-100 text-cyan-600";
      case "online": return "bg-indigo-100 text-indigo-600";
      case "qr": return "bg-pink-100 text-pink-600";
      case "payment_link": return "bg-teal-100 text-teal-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": case "paid": return "bg-green-100 text-green-700";
      case "pending": case "sent": return "bg-yellow-100 text-yellow-700";
      case "failed": case "overdue": case "expired": return "bg-red-100 text-red-700";
      case "unpaid": return "bg-orange-100 text-orange-700";
      case "draft": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.cardLast4?.includes(searchQuery) ||
      tx.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.provider?.toLowerCase().includes(searchQuery.toLowerCase());
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    
    toast({
      title: "Payment Successful",
      description: `P${parseFloat(amount).toFixed(2)} payment completed`,
    });

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

    toast({
      title: "Invoice Created",
      description: "Your invoice has been created successfully",
    });
    
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
      case "card": return { title: "Card Sale", icon: CreditCard, color: "bg-[#00C8E6]" };
      case "payment-link": return { title: "Payment Link", icon: Link2, color: "bg-purple-500" };
      case "invoice": return { title: "New Invoice", icon: FileText, color: "bg-blue-500" };
      case "cash": return { title: "Cash Payment", icon: Banknote, color: "bg-green-500" };
      case "mobile-money": return { title: "Mobile Money", icon: Smartphone, color: "bg-orange-500" };
      case "wallet": return { title: "Wallet Payment", icon: Wallet, color: "bg-indigo-500" };
    }
  };

  const config = getPaymentTypeConfig(paymentType);
  const PaymentIcon = config.icon;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Sales & Transactions</h1>
          <p className="text-[#141414]/60">Manage payments, invoices, and payment links</p>
        </div>
        <Button className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-medium text-[#141414]/60 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 bg-[#141414] text-white border-0 hover:bg-[#2a2a2a] hover:text-white"
            onClick={() => openPaymentDialog("card")}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">Card Sale</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 bg-[#141414] text-white border-0 hover:bg-[#2a2a2a] hover:text-white"
            onClick={() => setPaymentLinkDialogOpen(true)}
          >
            <Link2 className="w-5 h-5" />
            <span className="text-xs">Payment Link</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 bg-[#141414] text-white border-0 hover:bg-[#2a2a2a] hover:text-white"
            onClick={() => setInvoiceDialogOpen(true)}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">New Invoice</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#F5F5F5]"
            onClick={() => openPaymentDialog("cash")}
          >
            <Banknote className="w-5 h-5" />
            <span className="text-xs">Cash</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#F5F5F5]"
            onClick={() => openPaymentDialog("mobile-money")}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs">Mobile Money</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#F5F5F5]"
            onClick={() => openPaymentDialog("wallet")}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Wallet</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#F5F5F5]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs">Sell Products</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 h-auto">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-[#00C8E6] data-[state=active]:text-[#141414] px-6 py-2">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payment-links" className="data-[state=active]:bg-[#00C8E6] data-[state=active]:text-[#141414] px-6 py-2">
            Payment Links
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-[#00C8E6] data-[state=active]:text-[#141414] px-6 py-2">
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40" />
                <Input 
                  placeholder="Search by reference, card, customer, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
                <SelectContent className="bg-white">
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
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F6F6]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Reference</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Date & Time</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-[#141414]/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                      <td className="p-4">
                        <span className="font-medium text-[#141414]">{tx.reference}</span>
                      </td>
                      <td className="p-4 text-[#141414]/70">
                        {tx.date} • {tx.time}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(tx.type)}`}>
                            {getTypeIcon(tx.type)}
                          </div>
                          <div>
                            <span className="text-[#141414] text-sm">{paymentTypeLabels[tx.type]}</span>
                            {tx.provider && (
                              <p className="text-xs text-[#141414]/50">{tx.provider}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-[#141414]">
                        P{tx.amount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedTransaction(tx)}
                            className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#141414]/60" />
                          </button>
                          {tx.status === "success" && tx.type !== "cash" && (
                            <button className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors">
                              <RotateCcw className="w-4 h-4 text-orange-500" />
                            </button>
                          )}
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
            <p className="text-[#141414]/60">Manage and track your payment links</p>
            <Button 
              className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]"
              onClick={() => setPaymentLinkDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Payment Link
            </Button>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F6F6]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Created</th>
                    <th className="text-right p-4 text-sm font-medium text-[#141414]/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentLinks.map((link) => (
                    <tr key={link.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                      <td className="p-4">
                        <span className="font-medium text-[#141414]">{link.title}</span>
                      </td>
                      <td className="p-4 font-semibold text-[#141414]">
                        P{link.amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-[#141414]/70">
                        {link.customer || "-"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(link.status)}`}>
                          {link.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#141414]/70">
                        {link.createdAt}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => copyLink(link.url)}
                            className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-4 h-4 text-[#141414]/60" />
                          </button>
                          <button 
                            onClick={() => window.open(link.url, '_blank')}
                            className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-4 h-4 text-[#141414]/60" />
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
            <p className="text-[#141414]/60">Create and manage invoices for your customers</p>
            <Button 
              className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]"
              onClick={() => setInvoiceDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F6F6F6]">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Invoice #</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Amount</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Due Date</th>
                    <th className="text-right p-4 text-sm font-medium text-[#141414]/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-t border-[#f0f0f0] hover:bg-[#fafafa]">
                      <td className="p-4">
                        <span className="font-medium text-[#141414]">{invoice.invoiceNumber}</span>
                      </td>
                      <td className="p-4 text-[#141414]">
                        {invoice.customer}
                      </td>
                      <td className="p-4 font-semibold text-[#141414]">
                        P{invoice.amount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-[#141414]/70">
                        {invoice.dueDate}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-[#141414]/60" />
                          </button>
                          <button className="p-2 hover:bg-[#f0f0f0] rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-[#141414]/60" />
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
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getTypeColor(selectedTransaction.type)}`}>
                  {getTypeIcon(selectedTransaction.type)}
                </div>
                <p className="text-3xl font-bold text-[#141414]">P{selectedTransaction.amount.toFixed(2)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status}
                </span>
              </div>
              
              <div className="space-y-3 bg-[#F6F6F6] rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Reference</span>
                  <span className="font-medium">{selectedTransaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Date</span>
                  <span className="font-medium">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Time</span>
                  <span className="font-medium">{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#141414]/60">Payment Method</span>
                  <span className="font-medium">{paymentTypeLabels[selectedTransaction.type]}</span>
                </div>
                {selectedTransaction.provider && (
                  <div className="flex justify-between">
                    <span className="text-[#141414]/60">Provider</span>
                    <span className="font-medium">{selectedTransaction.provider}</span>
                  </div>
                )}
                {selectedTransaction.cardLast4 && (
                  <div className="flex justify-between">
                    <span className="text-[#141414]/60">Card</span>
                    <span className="font-medium">•••• {selectedTransaction.cardLast4}</span>
                  </div>
                )}
                {selectedTransaction.customer && (
                  <div className="flex justify-between">
                    <span className="text-[#141414]/60">Customer</span>
                    <span className="font-medium">{selectedTransaction.customer}</span>
                  </div>
                )}
              </div>

              {selectedTransaction.status === "success" && selectedTransaction.type !== "cash" && (
                <Button variant="outline" className="w-full text-orange-500 border-orange-500 hover:bg-orange-50">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Issue Refund
                </Button>
              )}
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
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-xl font-bold text-[#141414]">Payment Successful!</p>
                <p className="text-[#141414]/60">P{parseFloat(amount || "0").toFixed(2)}</p>
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
                            selectedProvider === provider.id
                              ? "border-[#00C8E6] bg-[#00C8E6]/10"
                              : "border-[#E8E8E8] bg-white"
                          }`}
                        >
                          <div className={`w-8 h-8 ${provider.color} rounded-lg mb-2`} />
                          <p className="text-sm font-medium text-[#141414]">{provider.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(paymentType === "mobile-money") && (
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
                  <div className="bg-[#F5F5F5] rounded-xl p-4">
                    <p className="text-sm text-[#141414]/60">
                      Enter the amount and tap your card machine to complete the transaction.
                    </p>
                  </div>
                )}

                {paymentType === "cash" && (
                  <div className="bg-[#F5F5F5] rounded-xl p-4">
                    <p className="text-sm text-[#141414]/60">
                      Record cash received from the customer.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing}
                  className="w-full h-12 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-[#141414] border-t-transparent rounded-full" />
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
              className="w-full h-12 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold"
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
              <Input
                type="date"
                value={invoiceDueDate}
                onChange={(e) => setInvoiceDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Items/Description</Label>
              <Input
                placeholder="e.g., Web Development Services"
                value={invoiceItems}
                onChange={(e) => setInvoiceItems(e.target.value)}
              />
            </div>

            <Button
              onClick={handleCreateInvoice}
              className="w-full h-12 bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414] font-semibold"
            >
              Create Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Sales;
