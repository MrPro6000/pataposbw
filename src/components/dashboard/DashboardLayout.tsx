import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { 
  LayoutGrid,
  CreditCard, 
  Wallet, 
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Package,
  Users,
  BarChart3,
  Smartphone,
  UserCog,
  HelpCircle,
  Bus
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavSection {
  label: string;
  icon: React.ElementType;
  items: { label: string; path: string }[];
}

const navSections: NavSection[] = [
  {
    label: "Sales",
    icon: CreditCard,
    items: [
      { label: "Transactions", path: "/dashboard/sales" },
      { label: "Products", path: "/dashboard/products" },
      { label: "Customers", path: "/dashboard/customers" },
    ]
  },
  {
    label: "Money",
    icon: Wallet,
    items: [
      { label: "Payouts", path: "/dashboard/payouts" },
      { label: "Reports", path: "/dashboard/reports" },
    ]
  },
  {
    label: "Hub",
    icon: LayoutGrid,
    items: [
      { label: "Dashboard", path: "/dashboard" },
    ]
  },
  {
    label: "Transport",
    icon: Bus,
    items: [
      { label: "Routes & Fares", path: "/dashboard/transport" },
    ]
  },
  {
    label: "Manage",
    icon: Settings,
    items: [
      { label: "Devices", path: "/dashboard/devices" },
      { label: "Staff", path: "/dashboard/staff" },
      { label: "Settings", path: "/dashboard/settings" },
      { label: "Support", path: "/dashboard/support" },
    ]
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["Sales", "Money", "Hub", "Manage"]);
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
    return location.pathname === path;
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => 
      prev.includes(label) 
        ? prev.filter(s => s !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Pata style: theme-aware bg, clean design */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-56 bg-background border-r border-border
        flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <Link to="/">
            <PataLogo className="h-5" />
          </Link>
          <button 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="mb-1">
              <button
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-foreground hover:bg-muted transition-colors"
              >
                <section.icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-left text-sm font-medium">{section.label}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedSections.includes(section.label) ? 'rotate-180' : ''
                }`} />
              </button>
              
              {expandedSections.includes(section.label) && (
                <div className="ml-8 border-l border-border">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`block pl-4 pr-5 py-2 text-sm transition-colors ${
                        isActive(item.path) 
                          ? 'text-primary font-medium border-l-2 border-primary -ml-[1px]' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Business Switcher & Sign Out */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground">
              PA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Pata Business</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <PataLogo className="h-4" />
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
