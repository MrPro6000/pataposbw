import pataLogoBlue from "@/assets/pata-logo-blue.png";
import pataLogoWhite from "@/assets/pata-logo-white.png";
import { useTheme } from "@/contexts/ThemeContext";

interface PataLogoProps {
  className?: string;
}

const PataLogo = ({ className = "h-6" }: PataLogoProps) => {
  const { theme } = useTheme();
  
  // dark theme = blue+white logo, light theme = blue-only logo
  const logoSrc = theme === "dark" ? pataLogoWhite : pataLogoBlue;
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <img 
        src={logoSrc}
        alt="Pata"
        className="h-full w-auto object-contain"
      />
      <span className="font-extrabold tracking-tight leading-none">
        PATA
      </span>
    </div>
  );
};

export default PataLogo;
