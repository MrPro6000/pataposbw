import Header from "@/components/Header";
import DevicePreview from "@/components/DevicePreview";
import HeroCarousel from "@/components/HeroCarousel";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-10 md:px-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Device Preview */}
          <div className="flex-1 w-full lg:w-auto order-2 lg:order-1">
            <DevicePreview />
          </div>
          
          {/* Right side - Hero Carousel */}
          <div className="w-full lg:w-[400px] order-1 lg:order-2">
            <HeroCarousel />
          </div>
        </div>
      </main>

      <CookieBanner />
      <Footer />
    </div>
  );
};

export default Index;
