import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Star, CreditCard, Smartphone, Globe, Wallet, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";


// App preview image
import pataAppPreview from "@/assets/pata-app-preview.png";

const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};




const FloatingParticle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <div
    className="absolute rounded-full bg-primary/20 pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      animation: `float ${3 + delay}s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-5 md:px-20 py-4 md:py-14 overflow-hidden relative">
        {/* Floating particles */}
        <FloatingParticle delay={0} size={6} x="10%" y="20%" />
        <FloatingParticle delay={1} size={4} x="80%" y="15%" />
        <FloatingParticle delay={0.5} size={8} x="70%" y="70%" />
        <FloatingParticle delay={1.5} size={5} x="20%" y="80%" />
        <FloatingParticle delay={2} size={3} x="50%" y="10%" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <AnimatedSection delay={0}>
                <div className="flex items-center gap-1.5 mb-1 md:mb-3 group cursor-default">
                  <Star className="w-2.5 h-2.5 md:w-4 md:h-4 text-primary animate-[spin_4s_linear_infinite]" />
                  <span className="text-foreground/90 text-[11px] md:text-sm group-hover:text-foreground transition-colors duration-300">
                    Payments made easier, no hassle, no contracts.
                  </span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <h1 className="pata-hero-title text-foreground mb-0 hero-text-shimmer">YOUR BUSINESS,</h1>
                <h1 className="pata-hero-title pata-hero-gradient mb-3 md:mb-4 hero-text-shimmer" style={{ animationDelay: '0.3s' }}>YOUR POCKET</h1>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <p className="text-xs md:text-lg text-foreground/80 mb-4 md:mb-8 max-w-[260px] md:max-w-lg leading-relaxed">
                  Turn your phone into a complete payment terminal. Accept card payments, scan & pay, send money
                  worldwide, and manage your entire business—all from your pocket.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="flex flex-row items-center gap-2 sm:gap-3">
                  <Link to="/signup" className="pata-btn-cyan !py-2 !px-4 !text-[11px] sm:!py-3 sm:!px-6 sm:!text-sm group/btn relative overflow-hidden active:scale-95 transition-transform text-center">
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      Start accepting payments
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </Link>
                  <Link
                    to="/products"
                    className="pata-btn-outline-dark !py-2 !px-4 !text-[11px] sm:!py-2.5 sm:!px-6 sm:!text-sm group/btn2 relative overflow-hidden active:scale-95 transition-transform flex items-center justify-center gap-1.5 text-center"
                  >
                    Explore products
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn2:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Content - App Preview */}
            <AnimatedSection delay={0.2} className="flex justify-center">
              <div className="max-w-md w-full relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-400/10 to-primary/20 rounded-3xl blur-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-700" />
                <img 
                  src={pataAppPreview} 
                  alt="Pata App - POS and Payments" 
                  className="w-full h-auto rounded-2xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]" 
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="px-5 md:px-20 py-12 md:py-20 bg-secondary overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              One platform. <span className="pata-hero-gradient">Infinite possibilities.</span>
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Payments made easier across Botswana — from Pata POS to card terminals.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                title: "PataPOS",
                icon: Smartphone,
                description: "Transform your smartphone into a complete point of sale. Manage products, track inventory, and accept payments on the go.",
                extra: "Download the Pata App and turn your smartphone into a business.",
                link: "/products",
                tagline: "Your store in your pocket",
                showDownload: true,
              },
              {
                title: "Card Payments",
                icon: CreditCard,
                description: "Accept tap, chip, and swipe payments from all major cards and mobile wallets with real-time confirmation.",
                link: "/card-machines",
                tagline: "Every card, everywhere",
              },
              {
                title: "Payment Gateway",
                icon: Globe,
                description: "Connect to your website or WhatsApp. Create payment links and accept online payments in minutes.",
                link: "/online-payments",
                tagline: "Sell online seamlessly",
              },
              {
                title: "Mobile Money",
                icon: Phone,
                description: "Accept and process mobile money payments from Orange Money, Smega, and MyZaka. Seamless integration for your business.",
                link: "/online-payments",
                tagline: "Pay with mobile",
              },
              {
                title: "Mukuru Transfer",
                icon: ArrowRight,
                description: "Send and receive money across borders via Mukuru. Fast, secure international transfers at competitive rates.",
                link: "/products",
                tagline: "Connect globally",
              },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title} delay={0.1 * i}>
                <Link
                  to={feature.link}
                  className="bg-card rounded-2xl p-6 hover:bg-card/80 transition-all group border border-border block hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 group-hover:rotate-3 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{feature.tagline}</p>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    {feature.extra && <p className="text-primary text-sm mb-4">{feature.extra}</p>}
                    {"showDownload" in feature && feature.showDownload && (
                      <div className="flex gap-2 mb-4">
                        <a href="#" className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200">
                          Android App
                        </a>
                        <a href="#" className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-200">
                          iOS App
                        </a>
                      </div>
                    )}
                    <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {/* Pata Capital & Mukuru Transfer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            <AnimatedSection delay={0.5}>
              <Link
                to="/capital"
                className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 hover:from-primary/20 transition-all group border border-primary/20 block hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="text-muted-foreground text-sm mb-2">Funding that flows with you</p>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Pata Capital</h3>
                  <p className="text-muted-foreground mb-4">
                    Access business funding in 24 hours. No paperwork, flexible repayment that adjusts with your sales.
                  </p>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Check your offer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <Link
                to="/products"
                className="bg-gradient-to-br from-info/10 to-info/5 dark:from-info/20 dark:to-info/10 rounded-2xl p-8 hover:from-info/20 transition-all group border border-info/20 block hover:-translate-y-2 hover:shadow-xl hover:shadow-info/10 duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <p className="text-muted-foreground text-sm mb-2">Send money across borders</p>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Mukuru Transfer</h3>
                  <p className="text-muted-foreground mb-4">
                    Fast, secure international money transfers via Mukuru. Send and receive across borders at competitive rates.
                  </p>
                  <span className="text-info font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Home;
