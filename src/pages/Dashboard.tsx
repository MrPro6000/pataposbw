import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import YocoLogo from "@/components/YocoLogo";
import { 
  LogOut, 
  Home, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
  ];

  const recentTransactions = [
    { id: 1, customer: "Card Payment", amount: "R150.00", time: "2 min ago", status: "success" },
    { id: 2, customer: "Card Payment", amount: "R89.00", time: "15 min ago", status: "success" },
    { id: 3, customer: "Online Payment", amount: "R450.00", time: "1 hour ago", status: "success" },
    { id: 4, customer: "Card Payment", amount: "R75.00", time: "2 hours ago", status: "success" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] text-white p-6 hidden md:flex flex-col">
        <YocoLogo className="h-5 mb-8" />
        
        <nav className="flex-1 space-y-1">
          {[
            { icon: Home, label: "Dashboard", active: true },
            { icon: CreditCard, label: "Payments", active: false },
            { icon: TrendingUp, label: "Reports", active: false },
            { icon: Settings, label: "Settings", active: false },
            { icon: HelpCircle, label: "Help", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active 
                  ? 'bg-[#00C8E6] text-[#141414]' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#141414]">Welcome back!</h1>
            <p className="text-[#141414]/60">{user?.email}</p>
          </div>
          <button className="yoco-btn-cyan">
            New Sale
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6">
              <p className="text-[#141414]/60 text-sm mb-1">{stat.label}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#141414]">{stat.value}</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.positive ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#141414]">Recent Transactions</h2>
            <button className="flex items-center gap-1 text-[#00C8E6] text-sm font-medium hover:underline">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-[#f0f0f0] last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00C8E6]/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#00C8E6]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#141414]">{tx.customer}</p>
                    <p className="text-sm text-[#141414]/60">{tx.time}</p>
                  </div>
                </div>
                <span className="font-semibold text-[#141414]">{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
