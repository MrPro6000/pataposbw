import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    title: "Take a breath.",
    subtitle: "This is where\nbusiness\nmakes sense.",
    description: "Welcome to the new home for your business.",
  },
  {
    title: "Understand your",
    subtitle: "business like never\nbefore",
    description: "Discover reports & insights to help you make confident decisions.",
  },
  {
    title: "Everything a",
    subtitle: "business owner\nneeds",
    description: "Sales tools • Business management • Capital cash advances • So much more than ever before",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="yoco-card min-h-[400px] flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center">
        <div className="transition-opacity duration-500">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {slides[currentSlide].title}
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground whitespace-pre-line leading-tight mb-6">
            {slides[currentSlide].subtitle}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? "w-6 h-2 bg-foreground" 
                  : "w-2 h-2 bg-muted-foreground/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 text-foreground hover:text-foreground transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button className="yoco-btn-primary mt-6">
        Log in
      </button>
    </div>
  );
};

export default HeroCarousel;
