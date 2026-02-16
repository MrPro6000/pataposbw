import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Clock
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKyc: 0,
    amlFlags: 0,
    openTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch pending KYC
      const { count: kycCount } = await supabase
        .from("kyc_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch AML flags
      const { count: amlCount } = await supabase
        .from("aml_flags")
        .select("*", { count: "exact", head: true })
        .eq("is_resolved", false);

      // Fetch open tickets
      const { count: ticketsCount } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      setStats({
        totalUsers: usersCount || 0,
        pendingKyc: kycCount || 0,
        amlFlags: amlCount || 0,
        openTickets: ticketsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data - starts at zero, populated by real data
  const revenueData = [
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ];

  const transactionData = [
    { hour: "6am", value: 0 },
    { hour: "9am", value: 0 },
    { hour: "12pm", value: 0 },
    { hour: "3pm", value: 0 },
    { hour: "6pm", value: 0 },
    { hour: "9pm", value: 0 },
  ];

  const regionData = [
    { name: "Gaborone", value: 0 },
    { name: "Francistown", value: 0 },
    { name: "Maun", value: 0 },
    { name: "Other", value: 0 },
  ];

  const COLORS = ["#00C8E6", "#6366f1", "#f59e0b", "#10b981"];

  const chartConfig = {
    value: { label: "Value", color: "#00C8E6" },
  };

  const statCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: Users, 
      color: "bg-blue-500/20 text-blue-500",
      link: "/admin/users"
    },
    { 
      title: "Pending KYC", 
      value: stats.pendingKyc, 
      icon: UserCheck, 
      color: "bg-yellow-500/20 text-yellow-500",
      link: "/admin/kyc"
    },
    { 
      title: "AML Flags", 
      value: stats.amlFlags, 
      icon: AlertTriangle, 
      color: "bg-red-500/20 text-red-500",
      link: "/admin/aml"
    },
    { 
      title: "Open Tickets", 
      value: stats.openTickets, 
      icon: HelpCircle, 
      color: "bg-purple-500/20 text-purple-500",
      link: "/admin/tickets"
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/60">Overview of platform activity and metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-[#1a1a1a] rounded-2xl p-5 hover:bg-[#222] transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-white/60 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Weekly Revenue</h3>
              <p className="text-white/40 text-sm">Last 7 days</p>
            </div>
          </div>
          <div className="h-48">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={revenueData} barSize={24}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <p className="text-green-500 font-semibold text-lg mt-4">P 0.00</p>
        </div>

        {/* Transaction Volume Chart */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Transaction Volume</h3>
              <p className="text-white/40 text-sm">Today</p>
            </div>
          </div>
          <div className="h-48">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={transactionData}>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00C8E6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <p className="text-blue-500 font-semibold text-lg mt-4">0 transactions</p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Geography Distribution */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Geographic Distribution</h3>
          <div className="h-40">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {regionData.map((region, index) => (
              <div key={region.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-white/60 text-sm">{region.name}</span>
                <span className="text-white text-sm ml-auto">{region.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <Clock className="w-5 h-5 text-white/40" />
          </div>
          <div className="space-y-4">
            <p className="text-white/40 text-sm text-center py-6">No recent activity</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
