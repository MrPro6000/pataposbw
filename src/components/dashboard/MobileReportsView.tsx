import { Link } from "react-router-dom";
import { ChevronLeft, Package, Users, TrendingUp, Calendar } from "lucide-react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, PieChart, Pie, Cell } from "recharts";
import MobileBottomNav from "./MobileBottomNav";

interface MobileReportsViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileReportsView = ({ profile, userEmail }: MobileReportsViewProps) => {
  const salesByDate = [
    { date: "M", sales: 4500 },
    { date: "T", sales: 5200 },
    { date: "W", sales: 4800 },
    { date: "T", sales: 6100 },
    { date: "F", sales: 5500 },
    { date: "S", sales: 7200 },
    { date: "S", sales: 6800 },
  ];

  const paymentMethods = [
    { name: "Card", value: 35, color: "#00C8E6" },
    { name: "Mobile Money", value: 28, color: "#F97316" },
    { name: "Cash", value: 18, color: "#22C55E" },
    { name: "Wallet", value: 10, color: "#8B5CF6" },
    { name: "Other", value: 9, color: "#141414" },
  ];

  const chartConfig = {
    sales: { label: "Sales", color: "#00C8E6" },
  };

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-[#141414]" />
          </Link>
          <h1 className="font-semibold text-[#141414]">Reports</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Period Selector */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Today", "This Week", "This Month", "This Year"].map((period, i) => (
            <button 
              key={period}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                i === 1 ? "bg-[#141414] text-white" : "bg-white text-[#141414]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#00C8E6]" />
              <span className="text-xs text-[#141414]/60">Revenue</span>
            </div>
            <p className="text-xl font-bold text-[#141414]">P67,890</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#00C8E6]" />
              <span className="text-xs text-[#141414]/60">Items Sold</span>
            </div>
            <p className="text-xl font-bold text-[#141414]">1,247</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#00C8E6]" />
              <span className="text-xs text-[#141414]/60">Customers</span>
            </div>
            <p className="text-xl font-bold text-[#141414]">342</p>
          </div>
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#00C8E6]" />
              <span className="text-xs text-[#141414]/60">Avg. Order</span>
            </div>
            <p className="text-xl font-bold text-[#141414]">P198</p>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm text-[#141414]/60 mb-4">Sales by Day</p>
          <div className="h-32">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={salesByDate} barSize={20}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#999', fontSize: 12 }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#00C8E6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm text-[#141414]/60 mb-4">Payment Methods</p>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="flex-1 space-y-2">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: method.color }} />
                    <span className="text-sm text-[#141414]">{method.name}</span>
                  </div>
                  <span className="text-sm font-medium text-[#141414]">{method.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-auto">Product report</p>
            <Package className="w-8 h-8 text-[#141414]/20" />
          </button>
          
          <button className="bg-white rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-auto">Staff report</p>
            <Users className="w-8 h-8 text-[#141414]/20" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileReportsView;
