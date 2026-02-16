import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  MapPin
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    activeUsers: 0,
    averageTransaction: 0,
  });

  useEffect(() => {
    // Simulate loading analytics
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 125000, transactions: 1200 },
    { month: "Feb", revenue: 148000, transactions: 1450 },
    { month: "Mar", revenue: 165000, transactions: 1580 },
    { month: "Apr", revenue: 142000, transactions: 1320 },
    { month: "May", revenue: 189000, transactions: 1890 },
    { month: "Jun", revenue: 215000, transactions: 2100 },
  ];

  const dailyTransactions = [
    { hour: "00:00", value: 45 },
    { hour: "04:00", value: 28 },
    { hour: "08:00", value: 156 },
    { hour: "12:00", value: 289 },
    { hour: "16:00", value: 312 },
    { hour: "20:00", value: 178 },
    { hour: "23:00", value: 89 },
  ];

  const paymentMethods = [
    { name: "Card", value: 45, color: "#00C8E6" },
    { name: "Mobile Money", value: 30, color: "#f59e0b" },
    { name: "Cash", value: 15, color: "#10b981" },
    { name: "Wallet", value: 10, color: "#6366f1" },
  ];

  const regionData = [
    { region: "Gaborone", value: 45000, users: 1200 },
    { region: "Francistown", value: 28000, users: 780 },
    { region: "Maun", value: 18000, users: 450 },
    { region: "Kasane", value: 12000, users: 320 },
    { region: "Selebi-Phikwe", value: 9000, users: 280 },
    { region: "Other", value: 15000, users: 420 },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "#00C8E6" },
    transactions: { label: "Transactions", color: "#10b981" },
    value: { label: "Value", color: "#00C8E6" },
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: "P 984,000",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-green-500/20 text-green-500",
    },
    {
      title: "Total Transactions",
      value: "9,540",
      change: "+8.2%",
      isPositive: true,
      icon: CreditCard,
      color: "bg-blue-500/20 text-blue-500",
    },
    {
      title: "Active Users",
      value: "3,450",
      change: "+15.3%",
      isPositive: true,
      icon: Users,
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      title: "Avg. Transaction",
      value: "P 103.15",
      change: "-2.1%",
      isPositive: false,
      icon: TrendingUp,
      color: "bg-yellow-500/20 text-yellow-500",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-white/60">Platform performance and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                {stat.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={revenueData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                  tickFormatter={(value) => `P${value/1000}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00C8E6" 
                  fill="#00C8E6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Transaction Volume */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Daily Transaction Pattern</h3>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={dailyTransactions}>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
          <div className="h-48">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                <span className="text-white/60 text-sm">{method.name}</span>
                <span className="text-white text-sm ml-auto">{method.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-white/60" />
            <h3 className="text-white font-semibold">Geographic Distribution</h3>
          </div>
          <div className="h-64">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={regionData} layout="vertical">
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 11 }}
                  tickFormatter={(value) => `P${value/1000}k`}
                />
                <YAxis 
                  type="category"
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#fff', fontSize: 11 }}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  fill="#00C8E6" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
