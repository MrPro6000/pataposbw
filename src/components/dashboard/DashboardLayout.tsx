import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { 
  Home, 
  CreditCard, 
  Package, 
  Users, 
  Wallet, 
  BarChart3, 
  Smartphone, 
  UserCog, 
  Settings, 
  HelpCircle,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "Sales", path: "/dashboard/sales" },
  { icon: Package, label: "Products", path: "/dashboard/products" },
  { icon: Users, label: "Customers", path: "/dashboard/customers" },
  { icon: Wallet, label: "Payouts", path: "/dashboard/payouts" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
  { icon: Smartphone, label: "Devices", path: "/dashboard/devices" },
  { icon: UserCog, label: "Staff", path: "/dashboard/staff" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  { icon: HelpCircle, label: "Support", path: "/dashboard/support" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#141414] text-white p-6 
        flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <PataLogo className="h-5" />
          </Link>
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive(item.path) 
                  ? 'bg-[#00C8E6] text-[#141414]' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#f0f0f0]">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#141414]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <PataLogo className="h-4 text-[#141414]" />
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
