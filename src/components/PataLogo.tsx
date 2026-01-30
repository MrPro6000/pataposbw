import pataLogoBlue from "@/assets/pata-logo-blue.png";
import pataLogoWhite from "@/assets/pata-logo-white.png";

interface PataLogoProps {
  className?: string;
  variant?: "dark" | "light";
}

const PataLogo = ({ className = "h-6", variant = "dark" }: PataLogoProps) => {
  const logoSrc = variant === "dark" ? pataLogoWhite : pataLogoBlue;
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <img 
        src={logoSrc}
        alt="Pata"
        className="h-full w-auto object-contain"
      />
      <span 
        className="font-extrabold tracking-tight leading-none"
        style={{ 
          fontSize: 'calc(100% * 1.6)',
          letterSpacing: '-0.04em'
        }}
      >
        PATA
      </span>
    </div>
  );
};

export default PataLogo;
