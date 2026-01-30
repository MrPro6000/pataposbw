import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Package, Users, CreditCard, Smartphone, Globe, Wallet } from "lucide-react";
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
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground"
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
          className="inline-block mt-1 px-3 py-1 bg-muted rounded-full"
        >
          <span className="text-sm font-medium text-foreground">
            {profile?.business_name || "One Guy Can"}
          </span>
        </Link>
      </div>

      {/* Stats Cards - 2x2 Grid matching reference */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/sales" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-muted-foreground mb-1">Sales made</p>
            <p className="text-3xl font-bold text-foreground mb-auto">0</p>
            <p className="text-xs text-muted-foreground">Last week</p>
          </Link>
          
          <button 
            onClick={() => setSalesHistoryOpen(true)}
            className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform text-left"
          >
            <p className="text-sm text-muted-foreground mb-1">Sales history</p>
            <p className="text-sm text-foreground">card</p>
            <p className="text-xl font-semibold text-foreground">- P12</p>
            <p className="text-sm text-green-600">Approved</p>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/payouts" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-muted-foreground mb-1">Payouts</p>
            <p className="text-sm text-muted-foreground">Payout</p>
            <p className="text-xl font-bold text-foreground">P16</p>
            <p className="text-xs text-muted-foreground">9 May 2024</p>
          </Link>
          
          <Link to="/dashboard/settings" className="bg-card rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
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
          className="w-full bg-card rounded-2xl p-4 active:scale-98 transition-transform mb-4 text-left"
        >
          <p className="text-sm text-muted-foreground mb-4">Gross revenue</p>
          
          <div className="h-28 mb-4">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={weeklyChartData} barSize={20}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#999', fontSize: 12 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#0066FF" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">Last week</p>
            <p className="text-lg font-bold text-foreground">P48,000</p>
          </div>
        </button>

        {/* Product & Staff Reports - 2 column grid */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setProductReportOpen(true)}
            className="bg-card rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform text-left"
          >
            <p className="text-sm text-muted-foreground mb-auto">Product report</p>
            <Package className="w-8 h-8 text-muted-foreground/50" />
          </button>
          
          <button 
            onClick={() => setStaffReportOpen(true)}
            className="bg-card rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform text-left"
          >
            <p className="text-sm text-muted-foreground mb-auto">Staff report</p>
            <Users className="w-8 h-8 text-muted-foreground/50" />
          </button>
        </div>
      </div>

      {/* Quick Access - POS, Card machine, Payment gateway, Wallet */}
      <div className="px-5 py-2">
        <h2 className="font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            to="/dashboard"
            className="bg-card rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">POS</p>
              <p className="text-xs text-muted-foreground">Point of Sale</p>
            </div>
          </Link>
          
          <Link 
            to="/dashboard/devices"
            className="bg-card rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Card machine</p>
              <p className="text-xs text-muted-foreground">4 devices</p>
            </div>
          </Link>
          
          <button 
            onClick={() => setPaymentGatewayOpen(true)}
            className="bg-card rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Payment gateway</p>
              <p className="text-xs text-muted-foreground">Online payments</p>
            </div>
          </button>
          
          <button 
            onClick={() => setCapitalOpen(true)}
            className="bg-card rounded-2xl p-4 flex items-center gap-3 active:scale-98 transition-transform text-left"
          >
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHubView;
