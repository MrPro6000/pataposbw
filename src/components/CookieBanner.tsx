import { useState } from "react";
import { ChevronRight } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-lg mx-auto px-4 z-50">
      <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
        <h3 className="font-semibold text-foreground mb-3">Cookie notice</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          We use cookies to recognise visitors and remember their preferences. We also use them to measure ad campaign effectiveness, analyze site traffic and improve your experience. By pressing 'I understand,' or continuing to use the app you consent to the use of these methods.
        </p>
        <div className="flex items-center justify-between">
          <button className="flex items-center text-sm text-foreground font-medium hover:opacity-70 transition-opacity">
            Cookie policy
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
