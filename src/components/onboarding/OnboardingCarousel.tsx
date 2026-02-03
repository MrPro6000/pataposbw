import { useState } from "react";
import { ChevronRight, CreditCard, BarChart3, Receipt, ArrowRight } from "lucide-react";
import PataLogo from "@/components/PataLogo";

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: CreditCard,
    title: "Accept Every Payment",
    description: "From card taps to mobile money, scan-to-pay and online payments—Pata makes it easy for your customers to pay you their way.",
    gradient: "from-primary to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Grow Your Business",
    description: "Real-time sales tracking, smart reports, and business insights help you make better decisions and scale faster.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Receipt,
    title: "Invoices & Receipts",
    description: "Create professional invoices, send digital receipts, and manage your entire business from one powerful platform.",
    gradient: "from-amber-500 to-orange-600",
  },
];

const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <PataLogo className="h-5" />
        <button 
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Icon with gradient background */}
        <div className={`w-24 h-24 bg-gradient-to-br ${slide.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-lg`}>
          <Icon className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-center max-w-sm leading-relaxed mb-12">
          {slide.description}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 pb-8 pt-4">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Get Started
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default OnboardingCarousel;
