import { Link, useLocation } from "react-router-dom";
import { 
  LayoutGrid,
  CreditCard, 
  Wallet, 
  Bus,
  Settings
} from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutGrid, label: "Hub", path: "/dashboard" },
    { icon: CreditCard, label: "Sales", path: "/dashboard/sales" },
    { icon: Bus, label: "Transport", path: "/dashboard/transport" },
    { icon: Wallet, label: "Money", path: "/dashboard/payouts" },
    { icon: Settings, label: "Manage", path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 pb-safe">
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
