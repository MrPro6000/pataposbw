import { Link } from "react-router-dom";
import { ChevronRight, Package, Users } from "lucide-react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis } from "recharts";
import MobileBottomNav from "./MobileBottomNav";

interface MobileHubViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileHubView = ({ profile, userEmail }: MobileHubViewProps) => {
  // Chart data
  const weeklyChartData = [
    { day: "M", value: 0 },
    { day: "T", value: 0 },
    { day: "W", value: 0 },
    { day: "T", value: 0 },
    { day: "F", value: 0 },
    { day: "S", value: 0 },
    { day: "S", value: 0 },
  ];

  const chartConfig = {
    value: { label: "Revenue", color: "#E8E8E8" },
  };

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
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
      </header>

      {/* Hub Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-[#141414]">Hub</h1>
      </div>

      {/* Stats Cards - 2x2 Grid matching reference */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/sales" className="bg-white rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-1">Sales made</p>
            <p className="text-3xl font-bold text-[#141414] mb-auto">0</p>
            <p className="text-xs text-[#141414]/40">Last week</p>
          </Link>
          
          <Link to="/dashboard/sales" className="bg-white rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-1">Sales history</p>
            <p className="text-sm text-[#141414]">card</p>
            <p className="text-xl font-semibold text-[#141414]">- P12</p>
            <p className="text-sm text-green-600">Approved</p>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/payouts" className="bg-white rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-1">Payouts</p>
            <p className="text-sm text-[#141414]/60">Payout</p>
            <p className="text-xl font-bold text-[#141414]">P16</p>
            <p className="text-xs text-[#141414]/40">9 May 2024</p>
          </Link>
          
          <Link to="/dashboard/settings" className="bg-white rounded-2xl p-4 min-h-[110px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-1">Business details</p>
            <p className="text-sm text-[#141414]/60 line-clamp-2 mt-auto">
              Trading name, Address, conta...
            </p>
          </Link>
        </div>
      </div>

      {/* Reports Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/reports" className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#141414]">Reports</h2>
          <ChevronRight className="w-5 h-5 text-[#141414]/40" />
        </Link>

        <Link to="/dashboard/reports" className="block bg-white rounded-2xl p-4 active:scale-98 transition-transform mb-4">
          <p className="text-sm text-[#141414]/60 mb-4">Gross revenue</p>
          
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
                  fill="#E8E8E8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div className="flex items-center justify-between border-t border-[#E8E8E8] pt-3">
            <p className="text-sm text-[#141414]/60">Last week</p>
            <p className="text-lg font-bold text-[#141414]">P0.00</p>
          </div>
        </Link>

        {/* Product & Staff Reports - 2 column grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/dashboard/reports" className="bg-white rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-auto">Product report</p>
            <Package className="w-8 h-8 text-[#141414]/20" />
          </Link>
          
          <Link to="/dashboard/reports" className="bg-white rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
            <p className="text-sm text-[#141414]/60 mb-auto">Staff report</p>
            <Users className="w-8 h-8 text-[#141414]/20" />
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHubView;
