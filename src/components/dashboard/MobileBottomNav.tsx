import { Link, useLocation } from "react-router-dom";
import { 
  LayoutGrid,
  CreditCard, 
  Wallet, 
  Bus,
  Settings
} from "lucide-react";
import { useDashboardPreferences } from "@/hooks/useDashboardPreferences";

const MobileBottomNav = () => {
  const location = useLocation();
  const { preferences } = useDashboardPreferences();
  
  const allNavItems = [
    { icon: CreditCard, label: "Sales", path: "/dashboard/sales", show: true },
    { icon: Wallet, label: "Money", path: "/dashboard/payouts", show: true },
    { icon: Bus, label: "Transport", path: "/dashboard/transport", show: preferences.show_transport },
    { icon: Settings, label: "Manage", path: "/dashboard/settings", show: true },
    { icon: LayoutGrid, label: "Hub", path: "/dashboard/hub", show: true },
  ];

  const navItems = allNavItems.filter(item => item.show);

  const isActive = (path: string) => {
    if (path === "/dashboard/hub") return location.pathname === "/dashboard/hub";
    if (path === "/dashboard/sales") return location.pathname === "/dashboard/sales" || location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
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

export default MobileBottomNav;