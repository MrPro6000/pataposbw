import { useState } from "react";
import { Link } from "react-router-dom";
import PataLogo from "./PataLogo";
import ThemeToggle from "./ThemeToggle";
import ContactSalesDialog from "./ContactSalesDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown } from "lucide-react";

interface MainNavProps {
  theme?: "dark" | "light";
}

const MainNav = ({ theme: propTheme }: MainNavProps) => {
  const { theme: contextTheme } = useTheme();
  const isDark = propTheme ? propTheme === "dark" : contextTheme === "dark";
  const [posOpen, setPosOpen] = useState(false);
  
  return (
    <header className="flex items-center justify-between px-5 md:px-20 py-4 text-foreground safe-area-top">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center">
          <PataLogo className="h-5" />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/products" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Products
          </Link>
          <div className="relative" onMouseEnter={() => setPosOpen(true)} onMouseLeave={() => setPosOpen(false)}>
            <button className="text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1">
              POS
              <ChevronDown className="w-3 h-3" />
            </button>
            {posOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                <Link to="/card-machines" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setPosOpen(false)}>
                  Payment Terminals
                </Link>
                <Link to="/online-payments" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setPosOpen(false)}>
                  Payment Gateway
                </Link>
                <Link to="/shop" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors" onClick={() => setPosOpen(false)}>
                  Buy Machines
                </Link>
              </div>
            )}
          </div>
          <Link to="/business-type" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Business Type
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Pricing
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Shop
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle className="text-foreground" />
        <ContactSalesDialog>
          <button className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Support
          </button>
        </ContactSalesDialog>
        <Link to="/login" className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
          Login
        </Link>
        <Link to="/signup" className={isDark ? 'pata-btn-outline-dark' : 'pata-btn-outline-light'}>
          Get started
        </Link>
      </div>
    </header>
  );
};

export default MainNav;
