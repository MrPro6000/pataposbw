import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  RotateCcw,
  FileText,
  ChevronRight
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const DashboardHome = () => {
  const [user, setUser] = useState<User | null>(null);
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
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00C8E6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const stats = [
    { label: "Today's Sales", value: "R2,450.00", change: "+12%", positive: true },
    { label: "This Week", value: "R18,320.00", change: "+8%", positive: true },
    { label: "This Month", value: "R67,890.00", change: "-3%", positive: false },
    { label: "Transactions", value: "156", change: "+15%", positive: true },
  ];

  const chartData = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 1800 },
    { day: "Wed", sales: 1400 },
    { day: "Thu", sales: 2200 },
    { day: "Fri", sales: 2800 },
    { day: "Sat", sales: 3200 },
    { day: "Sun", sales: 2450 },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#00C8E6",
    },
  };

  const recentTransactions = [
    { id: 1, customer: "Card Payment", amount: "R150.00", time: "2 min ago", status: "success" },
    { id: 2, customer: "Card Payment", amount: "R89.00", time: "15 min ago", status: "success" },
    { id: 3, customer: "Online Payment", amount: "R450.00", time: "1 hour ago", status: "success" },
    { id: 4, customer: "Card Payment", amount: "R75.00", time: "2 hours ago", status: "success" },
    { id: 5, customer: "Tap to Pay", amount: "R320.00", time: "3 hours ago", status: "success" },
  ];

  const quickActions = [
    { icon: Plus, label: "New Sale", color: "bg-[#00C8E6]" },
    { icon: RotateCcw, label: "Refund", color: "bg-orange-500" },
    { icon: FileText, label: "Reports", color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Welcome back!</h1>
          <p className="text-[#141414]/60">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <button 
              key={action.label}
              className={`${action.color} text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity`}
            >
              <action.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5">
            <p className="text-[#141414]/60 text-sm mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl md:text-2xl font-bold text-[#141414]">{stat.value}</span>
              <span className={`flex items-center gap-0.5 text-sm font-medium ${
                stat.positive ? 'text-green-600' : 'text-red-500'
              }`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#141414] mb-4">Weekly Sales</h2>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C8E6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00C8E6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                tickFormatter={(value) => `R${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#00C8E6" 
                strokeWidth={2}
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#141414]">Recent Transactions</h2>
            <button 
              onClick={() => navigate('/dashboard/sales')}
              className="flex items-center gap-1 text-[#00C8E6] text-sm font-medium hover:underline"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#f0f0f0] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00C8E6]/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#00C8E6]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#141414] text-sm">{tx.customer}</p>
                    <p className="text-xs text-[#141414]/60">{tx.time}</p>
                  </div>
                </div>
                <span className="font-semibold text-[#141414]">{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
