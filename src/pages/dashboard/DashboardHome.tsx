import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  TrendingUp,
  Link2,
  Package,
  Users,
  ChevronRight,
  BarChart3,
  User
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const DashboardHome = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          navigate("/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
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
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00C8E6] border-t-transparent rounded-full"></div>
      </div>
    );
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
      color: "#00C8E6",
    },
  };

  const mostVisitedCards = [
    { 
      title: "Today's sales", 
      value: "R 3,345.87",
      hasChart: true,
      link: "/dashboard/sales"
    },
    { 
      title: "Payment Links", 
      value: "3",
      subtitle: "Unpaid",
      icon: Link2,
      link: "/dashboard/sales"
    },
    { 
      title: "Products", 
      value: "Tote Bag",
      change: "+12%",
      changePositive: true,
      icon: Package,
      link: "/dashboard/products"
    },
    { 
      title: "Staff", 
      value: "6",
      subtitle: "Active",
      hasAvatars: true,
      link: "/dashboard/staff"
    },
  ];

  const reportCards = [
    { title: "Gross revenue", icon: BarChart3, link: "/dashboard/reports" },
    { title: "Product report", icon: Package, link: "/dashboard/reports" },
    { title: "Staff report", icon: User, link: "/dashboard/reports" },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#141414]">Hub</h1>
      </div>

      {/* Most Visited Section */}
      <section className="mb-8">
        <h2 className="text-sm text-[#141414]/60 mb-4">Most visited</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mostVisitedCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="text-sm text-[#141414]/60 mb-3">{card.title}</p>
              
              {card.hasChart ? (
                <>
                  <div className="h-12 mb-2">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <BarChart data={miniChartData} barSize={6}>
                        <Bar 
                          dataKey="value" 
                          fill="#00C8E6" 
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <p className="text-lg font-semibold text-[#141414]">{card.value}</p>
                </>
              ) : card.hasAvatars ? (
                <>
                  <div className="flex -space-x-2 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C8E6] to-[#0095AB] border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-medium">{i}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[#141414]">
                    <span className="font-medium">{card.subtitle}</span> · {card.value}
                  </p>
                </>
              ) : (
                <>
                  {card.icon && <card.icon className="w-5 h-5 text-[#141414]/40 mb-2" />}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-[#141414]">{card.value}</span>
                    {card.change && (
                      <span className={`text-sm font-medium ${
                        card.changePositive ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {card.change}
                      </span>
                    )}
                  </div>
                  {card.subtitle && (
                    <p className="text-sm text-[#141414]/60">{card.subtitle}</p>
                  )}
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Sales Reports Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm text-[#141414]/60">Sales reports</h2>
          <Link 
            to="/dashboard/reports" 
            className="text-sm text-[#00C8E6] font-medium flex items-center gap-1 hover:underline"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Gross Revenue Chart */}
          <div className="bg-white rounded-2xl p-5 md:col-span-1">
            <p className="text-sm text-[#141414]/60 mb-1">Gross revenue</p>
            <p className="text-xs text-[#141414]/40 mb-4">Last week</p>
            
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
                    fill="#00C8E6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
            
            <p className="text-lg font-semibold text-[#141414] mt-3">R 19,789.07</p>
          </div>

          {/* Product Report Card */}
          <Link 
            to="/dashboard/reports"
            className="bg-white rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-[#141414]/60 mb-1">Product report</p>
            <div className="flex-1 flex items-center justify-center">
              <Package className="w-12 h-12 text-[#141414]/20" />
            </div>
          </Link>

          {/* Staff Report Card */}
          <Link 
            to="/dashboard/reports"
            className="bg-white rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-[#141414]/60 mb-1">Staff report</p>
            <div className="flex-1 flex items-center justify-center">
              <User className="w-12 h-12 text-[#141414]/20" />
            </div>
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default DashboardHome;
