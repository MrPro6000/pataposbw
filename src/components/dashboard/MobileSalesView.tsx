import { Link, useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  Wallet, 
  ChevronRight,
  Link2,
  FileText,
  Banknote,
  Smartphone,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";

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
        ? "bg-[#141414] text-white active:bg-[#2a2a2a]" 
        : "bg-white border border-[#E8E8E8] text-[#141414] active:bg-[#F5F5F5]"
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

const MobileSalesView = ({ profile, userEmail }: MobileSalesViewProps) => {
  const navigate = useNavigate();
  
  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "PA";

  // Mock sales history
  const salesHistory = [
    { type: "Card", status: "Approved", amount: -12.00, icon: RefreshCw },
    { type: "Card", status: "Refunded", amount: 12.00, icon: CreditCard },
    { type: "Card", status: "Approved", amount: -5.00, icon: CheckCircle },
  ];

  const handleQuickAction = (action: string) => {
    // Navigate to sales page with action context
    navigate(`/dashboard/sales?action=${action}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-6 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/dashboard/settings"
            className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white"
          >
            {initials}
          </Link>
          <Link 
            to="/dashboard/settings"
            className="px-3 py-1.5 bg-[#F5F5F5] rounded-full"
          >
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "One Guy Can"}
            </span>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#141414]/60 mb-1">Last 7 days</p>
          <p className="text-5xl font-bold text-[#141414] mb-2">P0.00</p>
          <p className="text-sm text-[#141414]/60">Today's the day to make things happen.</p>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <QuickActionButton 
            icon={CreditCard} 
            label="Card sale" 
            variant="dark" 
            onClick={() => handleQuickAction('card-sale')}
          />
          <QuickActionButton 
            icon={Link2} 
            label="Payment Link" 
            variant="dark" 
            onClick={() => handleQuickAction('payment-link')}
          />
          <QuickActionButton 
            icon={FileText} 
            label="New invoice" 
            variant="dark" 
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

      {/* Sales History */}
      <div className="px-5 py-4">
        <Link to="/dashboard/sales" className="block bg-white rounded-2xl overflow-hidden active:scale-98 transition-transform">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
            <h2 className="font-semibold text-[#141414]">Sales history</h2>
            <ChevronRight className="w-5 h-5 text-[#141414]/40" />
          </div>
          
          <div className="divide-y divide-[#E8E8E8]">
            {salesHistory.map((sale, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                    <sale.icon className="w-5 h-5 text-[#141414]/60" />
                  </div>
                  <div>
                    <p className="font-medium text-[#141414]">{sale.type}</p>
                    <p className="text-sm text-[#141414]/60">{sale.status}</p>
                  </div>
                </div>
                <p className={`font-semibold ${sale.amount > 0 ? "text-green-600" : "text-[#141414]"}`}>
                  {sale.amount > 0 ? "+" : "-"}P{Math.abs(sale.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileSalesView;
