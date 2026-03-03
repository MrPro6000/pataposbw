import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PataLogo from "@/components/PataLogo";
import { 
  LayoutGrid,
  Users,
  Shield,
  AlertTriangle,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  UserCheck,
  UsersRound,
  MessageSquare,
  Wallet,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[]; // which roles can see this nav item
}

const allNavItems: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutGrid, roles: ["admin", "cto", "developer", "finance"] },
  { label: "KYC Approvals", path: "/admin/kyc", icon: UserCheck, roles: ["admin", "support"] },
  { label: "Users", path: "/admin/users", icon: Users, roles: ["admin", "cto", "support"] },
  { label: "Team", path: "/admin/team", icon: UsersRound, roles: ["admin"] },
  { label: "Loan Applications", path: "/admin/loans", icon: Wallet, roles: ["admin", "finance", "support"] },
  { label: "AML Monitoring", path: "/admin/aml", icon: AlertTriangle, roles: ["admin", "finance"] },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3, roles: ["admin", "cto", "developer", "finance"] },
  { label: "Live Chat", path: "/admin/live-chat", icon: MessageSquare, roles: ["admin", "support"] },
  { label: "Support Tickets", path: "/admin/tickets", icon: HelpCircle, roles: ["admin", "support"] },
  { label: "FAQs", path: "/admin/faqs", icon: FileText, roles: ["admin", "support"] },
  { label: "Notifications", path: "/admin/notifications", icon: Bell, roles: ["admin", "cto"] },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!roles || roles.length === 0) {
        navigate("/admin/login");
        return;
      }

      const roleValues = roles.map((r) => r.role);
      const teamRoles = ["admin", "cto", "developer", "support", "finance"];
      const hasTeamRole = roleValues.some((r) => teamRoles.includes(r));

      if (!hasTeamRole) {
        navigate("/admin/login");
        return;
      }

      setUserRoles(roleValues);
      setIsAuthorized(true);
    } catch (error) {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Filter nav items based on user roles
  const navItems = allNavItems.filter((item) =>
    item.roles.some((role) => userRoles.includes(role))
  );

  // Determine badge label based on highest role
  const getRoleBadge = () => {
    if (userRoles.includes("admin")) return "ADMIN";
    if (userRoles.includes("cto")) return "CTO";
    if (userRoles.includes("finance")) return "FINANCE";
    if (userRoles.includes("developer")) return "DEV";
    if (userRoles.includes("support")) return "SUPPORT";
    return "TEAM";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
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
        w-64 bg-[#1a1a1a] border-r border-white/10
        flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <PataLogo className="h-5 text-white" />
            </Link>
            <span className="text-red-500 text-xs font-bold px-2 py-0.5 bg-red-500/20 rounded">{getRoleBadge()}</span>
          </div>
          <button 
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive(item.path)
                  ? 'text-white bg-red-500/20 border-r-2 border-red-500'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-white/10 p-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-white/10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <PataLogo className="h-4 text-white" />
            <span className="text-red-500 text-xs font-bold">{getRoleBadge()}</span>
          </Link>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
