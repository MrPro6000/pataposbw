import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import PaymentGatewayDialog from "@/components/dashboard/PaymentGatewayDialog";
import CapitalDialog from "@/components/dashboard/CapitalDialog";
import MobileWalletSheet from "@/components/dashboard/MobileWalletSheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  TrendingUp,
  Link2,
  Package,
  Smartphone,
  ChevronRight,
  BarChart3,
  User,
  Wallet,
  Banknote,
  CreditCard,
  Globe
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis } from "recharts";

const DashboardHome = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentGatewayOpen, setPaymentGatewayOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    let initialCheckDone = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        // Only redirect on sign-out after initial check is done
        if (initialCheckDone && !session?.user) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialCheckDone = true;
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  // Mini chart data for Today's sales card
  const miniChartData = [
    { day: "M", value: 1200 },
    { day: "T", value: 1800 },
    { day: "W", value: 1400 },
    { day: "T", value: 2200 },
    { day: "F", value: 2800 },
    { day: "S", value: 3200 },
    { day: "S", value: 2450 },
  ];

  // Weekly sales chart data
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
    value: {
      label: "Sales",
      color: "#0066FF",
    },
  };

  const mostVisitedCards = [
    { 
      title: "Today's sales", 
      value: "P 3,345.87",
      hasChart: true,
      link: "/dashboard/sales"
    },
    { 
      title: "Mobile Money", 
      value: "P 1,245",
      subtitle: "28% of sales",
      icon: Smartphone,
      iconColor: "text-orange-500 bg-orange-500/20",
      link: "/dashboard/sales"
    },
    { 
      title: "Cash Sales", 
      value: "P 890",
      subtitle: "18% of sales",
      icon: Banknote,
      iconColor: "text-green-500 bg-green-500/20",
      link: "/dashboard/sales"
    },
    { 
      title: "Wallet & Cards", 
      value: "P 1,210",
      subtitle: "45% of sales",
      icon: Wallet,
      iconColor: "text-purple-500 bg-purple-500/20",
      link: "/dashboard/sales"
    },
  ];

  const quickLinks = [
    { title: "Payment Links", value: "3 unpaid", icon: Link2, link: "/dashboard/sales" },
    { title: "Products", value: "12 active", icon: Package, link: "/dashboard/products" },
  ];

  const quickAccessItems = [
    { title: "Mobile POS", subtitle: "Sell from your phone", icon: CreditCard, iconBg: "bg-primary/10", iconColor: "text-primary", link: "/dashboard", action: undefined },
    { title: "Card Machine", subtitle: "4 devices", icon: Smartphone, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400", link: "/dashboard/devices", action: undefined },
    { title: "Payment Gateway", subtitle: "Online payments", icon: Globe, iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", link: undefined, action: () => setPaymentGatewayOpen(true) },
    { title: "Send Money", subtitle: "International transfers", icon: Banknote, iconBg: "bg-orange-100 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400", link: "/dashboard/payouts", action: undefined },
    { title: "Business Loan", subtitle: "Apply for funding", icon: TrendingUp, iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400", link: undefined, action: () => setCapitalOpen(true) },
    { title: "Wallet", subtitle: "P0.00 balance", icon: Wallet, iconBg: "bg-cyan-100 dark:bg-cyan-900/30", iconColor: "text-cyan-600 dark:text-cyan-400", link: undefined, action: () => setWalletOpen(true) },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Hub</h1>
      </div>

      {/* Most Visited Section */}
      <section className="mb-8">
        <h2 className="text-sm text-muted-foreground mb-4">Most visited</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mostVisitedCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="text-sm text-muted-foreground mb-3">{card.title}</p>
              
              {card.hasChart ? (
                <>
                  <div className="h-12 mb-2">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart data={miniChartData} barSize={6}>
                        <Bar 
                          dataKey="value" 
                          fill="#0066FF" 
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{card.value}</p>
                </>
              ) : (
                <>
                  {card.icon && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${card.iconColor}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                  )}
                  <p className="text-lg font-semibold text-foreground">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                  )}
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="mb-8">
        <h2 className="text-sm text-muted-foreground mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => 
            item.link ? (
              <Link
                key={item.title}
                to={item.link}
                className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </Link>
            ) : (
              <button
                key={item.title}
                onClick={item.action}
                className="bg-card rounded-2xl p-5 hover:shadow-md transition-shadow flex items-center gap-4 text-left"
              >
                <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </button>
            )
          )}
        </div>
      </section>

      {/* Sales Reports Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-muted-foreground">Sales reports</h2>
          <Link 
            to="/dashboard/reports" 
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Gross Revenue Chart */}
          <div className="bg-card rounded-2xl p-5 md:col-span-1">
            <p className="text-sm text-muted-foreground mb-1">Gross revenue</p>
            <p className="text-xs text-muted-foreground mb-4">Last week</p>
            
            <div className="h-32">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={weeklyChartData} barSize={16}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    fill="#0066FF" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            
            <p className="text-lg font-semibold text-foreground mt-3">P 19,789.07</p>
          </div>

          {/* Product Report Card */}
          <Link 
            to="/dashboard/reports"
            className="bg-card rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-muted-foreground mb-1">Product report</p>
            <div className="flex-1 flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground/50" />
            </div>
          </Link>

          {/* Staff Report Card */}
          <Link 
            to="/dashboard/reports"
            className="bg-card rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-muted-foreground mb-1">Staff report</p>
            <div className="flex-1 flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground/50" />
            </div>
          </Link>
        </div>
      </section>

      {/* Payment Gateway Dialog */}
      <PaymentGatewayDialog
        open={paymentGatewayOpen}
        onClose={() => setPaymentGatewayOpen(false)}
      />

      {/* Capital Dialog */}
      <CapitalDialog
        open={capitalOpen}
        onClose={() => setCapitalOpen(false)}
      />

      {/* Wallet Sheet */}
      <MobileWalletSheet
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
      />
    </DashboardLayout>
  );
};

export default DashboardHome;
