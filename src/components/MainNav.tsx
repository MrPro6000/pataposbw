import { Link } from "react-router-dom";
import PataLogo from "./PataLogo";
import ThemeToggle from "./ThemeToggle";

interface MainNavProps {
  theme?: "dark" | "light";
}

const MainNav = ({ theme = "dark" }: MainNavProps) => {
  const isDark = theme === "dark";
  
  return (
    <header className={`flex items-center justify-between px-6 md:px-20 py-5 ${isDark ? 'text-white' : 'text-[#141414]'}`}>
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
        <ThemeToggle className={isDark ? 'text-white' : 'text-[#141414]'} />
        <Link to="/support" className={`hidden md:block text-sm font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-[#141414]/80 hover:text-[#141414]'} transition-colors`}>
          Support
        </Link>
        <Link to="/login" className={`hidden md:block text-sm font-medium ${isDark ? 'text-white/80 hover:text-white' : 'text-[#141414]/80 hover:text-[#141414]'} transition-colors`}>
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
