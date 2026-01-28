const PataLogo = ({ className = "h-6" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 200 60" 
      className={className}
      style={{ aspectRatio: '3.33 / 1' }}
    >
      <text 
        x="100" 
        y="45" 
        textAnchor="middle" 
        fill="currentColor"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="50"
        letterSpacing="-2"
      >
        PATA
      </text>
    </svg>
  );
};

export default PataLogo;
