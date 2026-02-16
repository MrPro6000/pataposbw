import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Package, Users, CreditCard, Smartphone, Globe, Wallet, Send, Banknote } from "lucide-react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis } from "recharts";
import MobileBottomNav from "./MobileBottomNav";
import MobileReportSheet from "./MobileReportSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import MobileSalesHistorySheet from "./MobileSalesHistorySheet";
import MobilePaymentGatewaySheet from "./MobilePaymentGatewaySheet";
import MobileCapitalSheet from "./MobileCapitalSheet";
import MobilePOSSheet from "./MobilePOSSheet";
import MobileMoneyTransferSheet from "./MobileMoneyTransferSheet";
import MobileLoanApplicationSheet from "./MobileLoanApplicationSheet";
import MobileWalletSheet from "./MobileWalletSheet";
import PataLogo from "@/components/PataLogo";

interface MobileHubViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileHubView = ({ profile, userEmail }: MobileHubViewProps) => {
  const [productReportOpen, setProductReportOpen] = useState(false);
  const [staffReportOpen, setStaffReportOpen] = useState(false);
  const [revenueReportOpen, setRevenueReportOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [salesHistoryOpen, setSalesHistoryOpen] = useState(false);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [posOpen, setPosOpen] = useState(false);
  const [moneyTransferOpen, setMoneyTransferOpen] = useState(false);
  const [loanApplicationOpen, setLoanApplicationOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  // Chart data - show sample stats by default
  const weeklyChartData = [
    { day: "M", value: 4500 },
    { day: "T", value: 6200 },
    { day: "W", value: 5100 },
    { day: "T", value: 7800 },
    { day: "F", value: 9200 },
    { day: "S", value: 8400 },
    { day: "S", value: 6800 },
  ];

  const chartConfig = {
    value: { label: "Revenue", color: "#0066FF" },
  };

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-pata-cream dark:from-background dark:to-background pb-24">
      {/* Header with subtle gradient */}
      <header className="bg-gradient-to-b from-card to-transparent px-5 pt-4 pb-4 sticky top-0 z-40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20"
          >
            {personalInitials}
          </button>
        </div>
      </header>

      {/* Hub Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-foreground">Hub</h1>
        <Link 
          to="/dashboard/settings"
          className="inline-block mt-1 px-3 py-1 bg-secondary/80 backdrop-blur-sm rounded-full border border-border/50"
        >
          <span className="text-sm font-medium text-foreground">
            {profile?.business_name || "One Guy Can"}
          </span>
        </Link>
      </div>

      {/* Stats Cards - 2x2 Grid with colored accents */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/sales" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Sales made</p>
            <p className="text-3xl font-bold text-foreground mb-auto">0</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <p className="text-xs text-muted-foreground">Last week</p>
            </div>
          </Link>
          
          <button 
            onClick={() => setSalesHistoryOpen(true)}
            className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform text-left shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20"
          >
            <p className="text-sm text-muted-foreground mb-1">Sales history</p>
            <p className="text-sm text-foreground">card</p>
            <p className="text-xl font-semibold text-foreground">- P12</p>
            <span className="text-sm text-success font-medium">Approved</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/payouts" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Payouts</p>
            <p className="text-sm text-muted-foreground">Payout</p>
            <p className="text-xl font-bold text-foreground">P16</p>
            <p className="text-xs text-info font-medium">9 May 2024</p>
          </Link>
          
          <Link to="/dashboard/settings" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Business details</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
              Trading name, Address, conta...
            </p>
          </Link>
        </div>
      </div>

      {/* Reports Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/reports" className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Reports</h2>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>

        <button 
          onClick={() => setRevenueReportOpen(true)}
          className="w-full bg-gradient-to-br from-card to-card/80 rounded-2xl p-4 active:scale-98 transition-transform mb-4 text-left shadow-sm border border-border/50"
        >
          <p className="text-sm text-muted-foreground mb-4">Gross revenue</p>
          
          <div className="h-28 mb-4">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={weeklyChartData} barSize={20}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">Last week</p>
            <p className="text-lg font-bold text-primary">P48,000</p>
          </div>
        </button>

        {/* Product & Staff Reports - 2 column grid */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setProductReportOpen(true)}
            className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform text-left border border-purple-200/50 dark:border-purple-800/30"
          >
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-auto font-medium">Product report</p>
            <Package className="w-8 h-8 text-purple-400 dark:text-purple-500" />
          </button>
          
          <button 
            onClick={() => setStaffReportOpen(true)}
            className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform text-left border border-blue-200/50 dark:border-blue-800/30"
          >
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-auto font-medium">Staff report</p>
            <Users className="w-8 h-8 text-blue-400 dark:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Quick Access - POS, Card machine, Payment gateway, Wallet */}
      <div className="px-5 py-4">
        <h2 className="font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setPosOpen(true)}
            className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left border border-primary/20"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">PataPOS</p>
              <p className="text-xs text-muted-foreground">Sell from your phone</p>
            </div>
          </button>
          
          <Link 
            to="/dashboard/devices"
            className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform border border-purple-200/50 dark:border-purple-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Card machine</p>
              <p className="text-xs text-muted-foreground">4 devices</p>
            </div>
          </Link>
          
          <button 
            onClick={() => setPaymentGatewayOpen(true)}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left border border-emerald-200/50 dark:border-emerald-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Payment gateway</p>
              <p className="text-xs text-muted-foreground">Online payments</p>
            </div>
          </button>
          
          <button 
            onClick={() => setMoneyTransferOpen(true)}
            className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left border border-orange-200/50 dark:border-orange-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Send Money</p>
              <p className="text-xs text-muted-foreground">International transfers</p>
            </div>
          </button>

          <button 
            onClick={() => setLoanApplicationOpen(true)}
            className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left border border-amber-200/50 dark:border-amber-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Mobile Money</p>
              <p className="text-xs text-muted-foreground">Orange, Smega, MyZaka</p>
            </div>
          </button>
          
          <button 
            onClick={() => setWalletOpen(true)}
            className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10 rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left border border-cyan-200/50 dark:border-cyan-700/30"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Wallet</p>
              <p className="text-xs text-muted-foreground">P0.00 balance</p>
            </div>
          </button>
        </div>
      </div>

      {/* Report Sheets */}
      <MobileReportSheet
        open={productReportOpen}
        onClose={() => setProductReportOpen(false)}
        reportType="product"
      />
      <MobileReportSheet
        open={staffReportOpen}
        onClose={() => setStaffReportOpen(false)}
        reportType="staff"
      />
      <MobileReportSheet
        open={revenueReportOpen}
        onClose={() => setRevenueReportOpen(false)}
        reportType="revenue"
      />

      {/* Profile Sheet */}
      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        userEmail={userEmail}
      />

      {/* Sales History Sheet */}
      <MobileSalesHistorySheet
        open={salesHistoryOpen}
        onClose={() => setSalesHistoryOpen(false)}
      />

      {/* Payment Gateway Sheet */}
      <MobilePaymentGatewaySheet
        open={paymentGatewayOpen}
        onClose={() => setPaymentGatewayOpen(false)}
      />

      {/* Capital Sheet */}
      <MobileCapitalSheet
        open={capitalOpen}
        onClose={() => setCapitalOpen(false)}
      />

      {/* POS Sheet */}
      <MobilePOSSheet
        open={posOpen}
        onClose={() => setPosOpen(false)}
      />

      {/* Money Transfer Sheet */}
      <MobileMoneyTransferSheet
        open={moneyTransferOpen}
        onClose={() => setMoneyTransferOpen(false)}
      />

      {/* Loan Application Sheet */}
      <MobileLoanApplicationSheet
        open={loanApplicationOpen}
        onClose={() => setLoanApplicationOpen(false)}
      />

      {/* Wallet Sheet */}
      <MobileWalletSheet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHubView;
