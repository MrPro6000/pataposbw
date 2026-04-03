import { useState } from "react";
import { Link } from "react-router-dom";

import { 
  CreditCard, 
  Wallet, 
  ChevronRight,
  Link2,
  FileText,
  Banknote,
  Smartphone,
  RefreshCw,
  CheckCircle,
  Globe,
  Package,
  ShoppingBag,
  Ticket,
  Send
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobilePaymentSheet from "./MobilePaymentSheet";
import MobileSalesHistorySheet from "./MobileSalesHistorySheet";
import MobilePaymentLinksSheet from "./MobilePaymentLinksSheet";
import MobilePaymentGatewaySheet from "./MobilePaymentGatewaySheet";
import MobileProfileSheet from "./MobileProfileSheet";
import MobileProductSaleSheet from "./MobileProductSaleSheet";
import MobileInvoiceSheet from "./MobileInvoiceSheet";
import MobileWalletSheet from "./MobileWalletSheet";
import MobileVoucherSheet from "./MobileVoucherSheet";
import MobileEWalletSheet from "./MobileEWalletSheet";
import PataLogo from "@/components/PataLogo";
import { useTransactions } from "@/hooks/useTransactions";
import { useInvoices } from "@/hooks/useInvoices";
import { usePaymentLinks } from "@/hooks/usePaymentLinks";
import { useDashboardPreferences } from "@/hooks/useDashboardPreferences";

// Quick Action Button Component
const QuickActionButton = ({ 
  icon: Icon, 
  label, 
  variant = "dark",
  onClick
}: { 
  icon: React.ElementType; 
  label: string; 
  variant?: "dark" | "light";
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all aspect-square w-full active:scale-95 ${
      variant === "dark" 
        ? "bg-foreground text-background active:opacity-80" 
        : "bg-card border border-border text-foreground active:bg-muted"
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs font-medium text-center leading-tight">{label}</span>
  </button>
);

interface MobileSalesViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

type PaymentType = "card-sale" | "cash" | "mobile-money" | "poso-money";

const MobileSalesView = ({ profile, userEmail }: MobileSalesViewProps) => {
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("card-sale");
  const [salesHistoryOpen, setSalesHistoryOpen] = useState(false);
  const [paymentLinksOpen, setPaymentLinksOpen] = useState(false);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [productSaleOpen, setProductSaleOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [invoiceSheetOpen, setInvoiceSheetOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [eWalletOpen, setEWalletOpen] = useState(false);
  const { transactions, last7DaysIncome, balance } = useTransactions();
  const { invoices } = useInvoices();
  const { paymentLinks } = usePaymentLinks();
  const { preferences } = useDashboardPreferences();
  
  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                            userEmail?.slice(0, 2).toUpperCase() || "U";

  // Recent 3 transactions for preview
  const recentSales = transactions.slice(0, 3).map((tx) => {
    const methodLabel = tx.payment_method === "mobile_money" ? "Mobile Money" : 
                        tx.payment_method === "card" ? "Card" : 
                        tx.payment_method === "cash" ? "Cash" : 
                        tx.payment_method === "wallet" ? "Wallet" :
                        tx.payment_method === "payment_link" ? "Payment Link" :
                        tx.payment_method === "invoice" ? "Invoice" : tx.payment_method;
    const statusLabel = tx.amount < 0 ? "Refunded" : tx.status === "completed" ? "Approved" : "Pending";
    return {
      type: methodLabel,
      status: statusLabel,
      amount: tx.amount,
      icon: tx.amount < 0 ? RefreshCw : tx.status === "completed" ? CheckCircle : CreditCard,
    };
  });

  // Recent invoices from DB
  const recentInvoices = invoices.slice(0, 3);

  // Pending payment links count
  const pendingLinksCount = paymentLinks.filter(l => l.status === "pending").length;

  const handleQuickAction = (paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType);
    setPaymentSheetOpen(true);
  };

  // Build quick action rows based on preferences
  // Order: Mobile Money, Card Sale, Cash
  const row1Actions = [
    { icon: Smartphone, label: "Mobile Money", show: preferences.show_mobile_money, onClick: () => handleQuickAction('mobile-money') },
    { icon: CreditCard, label: "Card sale", show: true, onClick: () => handleQuickAction('card-sale') },
    { icon: Banknote, label: "Cash", show: true, onClick: () => handleQuickAction('cash') },
  ].filter(a => a.show);

  // Order: Payment Link, Voucher, Invoice — then E-Wallet, Wallet
  const row2Actions = [
    { icon: Link2, label: "Payment Link", show: preferences.show_payment_links, onClick: () => setPaymentLinksOpen(true) },
    { icon: Ticket, label: "Voucher", show: preferences.show_vouchers, onClick: () => setVoucherOpen(true) },
    { icon: FileText, label: "Invoice", show: preferences.show_invoices, onClick: () => setInvoiceSheetOpen(true) },
  ].filter(a => a.show);

  const row3Actions = [
    { icon: Send, label: "E-Wallet", show: true, onClick: () => setEWalletOpen(true) },
    { icon: Wallet, label: "Wallet", show: true, onClick: () => setWalletOpen(true) },
  ].filter(a => a.show);

  const row4Actions: typeof row1Actions = [];

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-6 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground"
          >
            {personalInitials}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className="text-5xl font-bold text-foreground mb-2">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground">
            Last 7 days: P{last7DaysIncome.toFixed(2)}
          </p>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-5 py-4">
        {preferences.show_sell_products && (
          <button 
            onClick={() => setProductSaleOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-[#0066FF] rounded-2xl mb-3 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Sell Products</p>
                <p className="text-sm text-white/70">Select items & checkout</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {row1Actions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {row1Actions.map(a => (
              <QuickActionButton key={a.label} icon={a.icon} label={a.label} variant="light" onClick={a.onClick} />
            ))}
          </div>
        )}
        {row2Actions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {row2Actions.map(a => (
              <QuickActionButton key={a.label} icon={a.icon} label={a.label} variant="light" onClick={a.onClick} />
            ))}
          </div>
        )}
        {row3Actions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {row3Actions.map(a => (
              <QuickActionButton key={a.label} icon={a.icon} label={a.label} variant="light" onClick={a.onClick} />
            ))}
          </div>
        )}
      </div>

      {/* Products Quick View */}
      {preferences.show_sell_products && (
        <div className="px-5 py-2">
          <Link to="/dashboard/products" state={{ from: "sales" }}
            className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform block">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Products</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Manage Products</p>
                  <p className="text-sm text-muted-foreground">Add, edit, and view inventory</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Sales History */}
      <div className="px-5 py-2">
        <button onClick={() => setSalesHistoryOpen(true)}
          className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform text-left">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Sales history</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            {recentSales.length > 0 ? recentSales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <sale.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{sale.type}</p>
                    <p className="text-sm text-muted-foreground">{sale.status}</p>
                  </div>
                </div>
                <p className={`font-semibold ${sale.amount > 0 ? "text-foreground" : "text-green-600"}`}>
                  {sale.amount > 0 ? "-" : "+"}P{Math.abs(sale.amount).toFixed(2)}
                </p>
              </div>
            )) : (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Invoices Section */}
      {preferences.show_invoices && (
        <div className="px-5 py-2">
          <button onClick={() => setInvoiceSheetOpen(true)}
            className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform text-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Invoices</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {recentInvoices.length > 0 ? recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {inv.status === "paid" ? "Paid" : "Draft"} • {inv.customer_name}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">P{inv.amount.toFixed(2)}</p>
                </div>
              )) : (
                <div className="px-5 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No invoices yet — tap to create one</p>
                </div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Payment Links & Payment Page */}
      {(preferences.show_payment_links) && (
        <div className="px-5 py-2">
          <div className="grid grid-cols-2 gap-3">
            {preferences.show_payment_links && (
              <button onClick={() => setPaymentLinksOpen(true)}
                className="bg-card rounded-2xl p-4 active:scale-98 transition-transform text-left">
                <p className="font-semibold text-foreground mb-1">Payment Links</p>
                <p className="text-2xl font-bold text-foreground">{pendingLinksCount}</p>
                <p className="text-sm text-muted-foreground">pending links</p>
              </button>
            )}
            <button onClick={() => setPaymentGatewayOpen(true)}
              className="bg-card rounded-2xl p-4 active:scale-98 transition-transform text-left">
              <p className="font-semibold text-foreground mb-1">Payment Page</p>
              <p className="text-sm text-muted-foreground mt-4">Configure & share</p>
            </button>
          </div>
        </div>
      )}

      {/* Payment Gateway */}
      <div className="px-5 py-2">
        <button onClick={() => setPaymentGatewayOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Add the Pata Payment gateway to your online store.</p>
            </div>
          </div>
        </button>
      </div>

      {/* Sheets */}
      <MobilePaymentSheet open={paymentSheetOpen} onClose={() => setPaymentSheetOpen(false)} paymentType={selectedPaymentType} />
      <MobileSalesHistorySheet open={salesHistoryOpen} onClose={() => setSalesHistoryOpen(false)} />
      <MobilePaymentLinksSheet open={paymentLinksOpen} onClose={() => setPaymentLinksOpen(false)} />
      <MobilePaymentGatewaySheet open={paymentGatewayOpen} onClose={() => setPaymentGatewayOpen(false)} />
      <MobileProductSaleSheet open={productSaleOpen} onClose={() => setProductSaleOpen(false)} />
      <MobileInvoiceSheet open={invoiceSheetOpen} onClose={() => setInvoiceSheetOpen(false)} />
      <MobileWalletSheet open={walletOpen} onClose={() => setWalletOpen(false)} />
      <MobileVoucherSheet open={voucherOpen} onClose={() => setVoucherOpen(false)} />
      <MobileEWalletSheet open={eWalletOpen} onClose={() => setEWalletOpen(false)} />
      <MobileProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} profile={profile} userEmail={userEmail} />
      <MobileBottomNav />
    </div>
  );
};

export default MobileSalesView;