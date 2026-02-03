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
  ShoppingBag
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobilePaymentSheet from "./MobilePaymentSheet";
import MobileSalesHistorySheet from "./MobileSalesHistorySheet";
import MobilePaymentLinksSheet from "./MobilePaymentLinksSheet";
import MobilePaymentGatewaySheet from "./MobilePaymentGatewaySheet";
import MobileProfileSheet from "./MobileProfileSheet";
import MobileProductSaleSheet from "./MobileProductSaleSheet";
import PataLogo from "@/components/PataLogo";

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
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all min-h-[88px] w-full active:scale-95 ${
      variant === "dark" 
        ? "bg-foreground text-background active:opacity-80" 
        : "bg-card border border-border text-foreground active:bg-muted"
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface MobileSalesViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

type PaymentType = "card-sale" | "payment-link" | "invoice" | "cash" | "mobile-money" | "wallet";

const MobileSalesView = ({ profile, userEmail }: MobileSalesViewProps) => {
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("card-sale");
  const [salesHistoryOpen, setSalesHistoryOpen] = useState(false);
  const [paymentLinksOpen, setPaymentLinksOpen] = useState(false);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [productSaleOpen, setProductSaleOpen] = useState(false);
  
  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  // Mock sales history
  const salesHistory = [
    { type: "Card", status: "Approved", amount: -12.00, icon: RefreshCw },
    { type: "Card", status: "Refunded", amount: 12.00, icon: CreditCard },
    { type: "Card", status: "Approved", amount: -5.00, icon: CheckCircle },
  ];

  // Mock invoices
  const invoices = [
    { status: "Draft", customer: "Nic", amount: "P12.00" },
    { status: "Paid", customer: "Nic", amount: "P112.00" },
    { status: "Draft", customer: "Nic", amount: "P320.00" },
  ];

  const handleQuickAction = (paymentType: PaymentType) => {
    setSelectedPaymentType(paymentType);
    setPaymentSheetOpen(true);
  };

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
          <p className="text-sm text-muted-foreground mb-1">Last 7 days</p>
          <p className="text-5xl font-bold text-foreground mb-2">P0.00</p>
          <p className="text-sm text-muted-foreground">Today's the day to make things happen.</p>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-5 py-4">
        {/* Products/POS Button - Full Width */}
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

        <div className="grid grid-cols-3 gap-3 mb-3">
          <QuickActionButton 
            icon={CreditCard} 
            label="Card sale" 
            variant="light" 
            onClick={() => handleQuickAction('card-sale')}
          />
          <QuickActionButton 
            icon={Link2} 
            label="Payment Link" 
            variant="light" 
            onClick={() => handleQuickAction('payment-link')}
          />
          <QuickActionButton 
            icon={FileText} 
            label="New invoice" 
            variant="light" 
            onClick={() => handleQuickAction('invoice')}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionButton 
            icon={Banknote} 
            label="Cash" 
            variant="light" 
            onClick={() => handleQuickAction('cash')}
          />
          <QuickActionButton 
            icon={Smartphone} 
            label="Mobile Money" 
            variant="light" 
            onClick={() => handleQuickAction('mobile-money')}
          />
          <QuickActionButton 
            icon={Wallet} 
            label="Wallet" 
            variant="light" 
            onClick={() => handleQuickAction('wallet')}
          />
        </div>
      </div>

      {/* Products Quick View */}
      <div className="px-5 py-2">
        <Link 
          to="/dashboard/products"
          state={{ from: "sales" }}
          className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform block"
        >
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

      {/* Sales History */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setSalesHistoryOpen(true)}
          className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Sales history</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="divide-y divide-border">
            {salesHistory.map((sale, index) => (
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
                <p className={`font-semibold ${sale.amount > 0 ? "text-green-600" : "text-foreground"}`}>
                  {sale.amount > 0 ? "+" : "-"}P{Math.abs(sale.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* Invoices Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => handleQuickAction('invoice')}
          className="w-full bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Invoices</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="divide-y divide-border">
            {invoices.map((invoice, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-foreground">
                    {invoice.status} • {invoice.customer}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{invoice.amount}</p>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* Payment Links & Payment Page */}
      <div className="px-5 py-2">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setPaymentLinksOpen(true)}
            className="bg-card rounded-2xl p-4 active:scale-98 transition-transform text-left"
          >
            <p className="font-semibold text-foreground mb-1">Payment Links</p>
            <p className="text-2xl font-bold text-foreground">13</p>
            <p className="text-sm text-muted-foreground">unpaid links</p>
          </button>
          
          <button 
            onClick={() => setPaymentGatewayOpen(true)}
            className="bg-card rounded-2xl p-4 active:scale-98 transition-transform text-left"
          >
            <p className="font-semibold text-foreground mb-1">Payment Page</p>
            <p className="text-sm text-muted-foreground mt-4">Configure & share</p>
          </button>
        </div>
      </div>

      {/* Payment Gateway */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setPaymentGatewayOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
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

      {/* Payment Sheet */}
      <MobilePaymentSheet
        open={paymentSheetOpen}
        onClose={() => setPaymentSheetOpen(false)}
        paymentType={selectedPaymentType}
      />

      {/* Sales History Sheet */}
      <MobileSalesHistorySheet
        open={salesHistoryOpen}
        onClose={() => setSalesHistoryOpen(false)}
      />

      {/* Payment Links Sheet */}
      <MobilePaymentLinksSheet
        open={paymentLinksOpen}
        onClose={() => setPaymentLinksOpen(false)}
      />

      {/* Payment Gateway Sheet */}
      <MobilePaymentGatewaySheet
        open={paymentGatewayOpen}
        onClose={() => setPaymentGatewayOpen(false)}
      />

      {/* Product Sale Sheet */}
      <MobileProductSaleSheet
        open={productSaleOpen}
        onClose={() => setProductSaleOpen(false)}
      />

      {/* Profile Sheet */}
      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        userEmail={userEmail}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileSalesView;
