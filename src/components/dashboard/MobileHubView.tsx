import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  LayoutGrid,
  CreditCard, 
  Wallet, 
  Settings,
  ChevronRight,
  Package,
  User
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis } from "recharts";

// Mobile Bottom Nav Component
const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutGrid, label: "Hub", path: "/dashboard" },
    { icon: CreditCard, label: "Sales", path: "/dashboard/sales" },
    { icon: Wallet, label: "Money", path: "/dashboard/payouts" },
    { icon: Settings, label: "Manage", path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              isActive(item.path) ? "text-[#00C8E6]" : "text-[#141414]/60"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

const MobileHubView = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; business_name: string | null } | null>(null);
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
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, business_name")
      .eq("user_id", userId)
      .maybeSingle();
    
    setProfile(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00C8E6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
                   user?.email?.slice(0, 2).toUpperCase() || "PA";

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white">
            {initials}
          </div>
          <div className="px-3 py-1.5 bg-[#F5F5F5] rounded-full">
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "My Business"}
            </span>
          </div>
        </div>
      </header>

      {/* Hub Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-[#141414]">Hub</h1>
      </div>

      {/* Stats Cards */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/sales" className="bg-white rounded-2xl p-4">
            <p className="text-sm text-[#141414]/60 mb-1">Sales made</p>
            <p className="text-2xl font-bold text-[#141414] mb-1">0</p>
            <p className="text-xs text-[#141414]/40">Last week</p>
          </Link>
          
          <Link to="/dashboard/sales" className="bg-white rounded-2xl p-4">
            <p className="text-sm text-[#141414]/60 mb-1">Sales history</p>
            <p className="text-sm text-[#141414]">card</p>
            <p className="text-lg font-semibold text-[#141414]">- P12</p>
            <p className="text-sm text-green-600">Approved</p>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/dashboard/payouts" className="bg-white rounded-2xl p-4">
            <p className="text-sm text-[#141414]/60 mb-1">Payouts</p>
            <p className="text-sm text-[#141414]/60">Payout</p>
            <p className="text-lg font-bold text-[#141414]">P16</p>
            <p className="text-xs text-[#141414]/40">9 May 2024</p>
          </Link>
          
          <Link to="/dashboard/settings" className="bg-white rounded-2xl p-4">
            <p className="text-sm text-[#141414]/60 mb-1">Business details</p>
            <p className="text-sm text-[#141414]/60 line-clamp-2">
              Trading name, Address, conta...
            </p>
          </Link>
        </div>
      </div>

      {/* Reports Section */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#141414]">Reports</h2>
          <ChevronRight className="w-5 h-5 text-[#141414]/40" />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm text-[#141414]/60 mb-3">Gross revenue</p>
          
          <div className="h-24 mb-3">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={weeklyChartData} barSize={12}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#999', fontSize: 10 }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#E8E8E8" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#141414]/40">Last week</p>
            <p className="text-lg font-bold text-[#141414]">P0.00</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHubView;
