import pataLogo from "@/assets/pata-logo.png";

const PataLogo = ({ className = "h-6" }: { className?: string }) => {
  return (
    <img 
      src={pataLogo} 
      alt="Pata" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default PataLogo;
