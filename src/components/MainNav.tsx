import { Link } from "react-router-dom";
import PataLogo from "./PataLogo";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

interface MainNavProps {
  theme?: "dark" | "light";
}

const MainNav = ({ theme: propTheme }: MainNavProps) => {
  const { theme: contextTheme } = useTheme();
  const isDark = propTheme ? propTheme === "dark" : contextTheme === "dark";
  
  return (
    <header className="flex items-center justify-between px-6 md:px-20 py-5 text-foreground">
      <div className="flex items-center gap-10">
        <Link to="/">
          <PataLogo className="h-5" />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium hover:opacity-80 transition-opacity">
            Products
          </Link>
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
        <Link to="/support" className="hidden md:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
          Support
        </Link>
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
