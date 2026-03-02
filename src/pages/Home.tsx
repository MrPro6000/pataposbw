import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Star, CreditCard, Smartphone, Globe, Wallet, Phone, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect, useRef } from "react";

// Device images
import pataPro from "@/assets/devices/pata-pro.jpeg";
import pataDiamond from "@/assets/devices/pata-diamond.jpeg";
import pataPlatinum from "@/assets/devices/pata-platinum.jpeg";
import goPata from "@/assets/devices/go-pata.jpeg";
import pata3dLogo from "@/assets/pata-3d-logo.jpg";

/* ── Animated wrapper ── */
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

/* ── Typing effect ── */
const TypingText = ({ texts, className = "" }: { texts: string[]; className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, currentIndex, texts]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-[3px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  );
};

/* ── Magnetic button ── */
const MagneticButton = ({ children, className = "", to }: { children: React.ReactNode; className?: string; to: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <Link ref={ref} to={to} className={`${className} transition-transform duration-300`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </Link>
  );
};

/* ── Floating particle dots ── */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary/10"
        style={{
          width: `${8 + i * 4}px`,
          height: `${8 + i * 4}px`,
          left: `${10 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.7}s`,
        }}
      />
    ))}
  </div>
);

/* ── Counter animation ── */
const AnimatedCounter = ({ target, suffix = "" }: { target: string; suffix?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ""));

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = numericTarget / 40;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isVisible, numericTarget]);

  return <span ref={ref as React.Ref<HTMLSpanElement>}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const { theme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-5 md:px-20 py-8 md:py-20 overflow-hidden relative">
        <FloatingParticles />

        {/* Gradient orb that follows mouse subtly */}
        <div
          className="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 50% / 0.06) 0%, transparent 70%)",
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            transition: "left 0.8s ease-out, top 0.8s ease-out",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <AnimatedSection delay={0}>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-4 h-4 text-primary animate-scale-pulse" />
                  <span className="text-muted-foreground">Payments made easier, no hassle, no contracts.</span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <h1 className="pata-hero-title text-foreground mb-2">YOUR BUSINESS,</h1>
                <h1 className="pata-hero-title pata-hero-gradient mb-2">YOUR POCKET</h1>
                <div className="h-10 mb-6">
                  <TypingText
                    texts={["Accept payments anywhere", "Send money globally", "Manage your business", "Grow with Pata"]}
                    className="text-lg text-primary font-medium"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Turn your phone into a complete payment terminal. Accept card payments, scan & pay, send money
                  worldwide, and manage your entire business—all from your pocket.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="flex items-center gap-4">
                  <MagneticButton to="/signup" className="pata-btn-cyan group animate-pulse-glow">
                    Start accepting payments
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </MagneticButton>
                  <Link
                    to="/products"
                    className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide group"
                  >
                    Explore products
                    <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </div>
              </AnimatedSection>

              {/* Stats row */}
              <AnimatedSection delay={0.45}>
                <div className="flex gap-8 mt-10 pt-8 border-t border-border">
                  {[
                    { value: "5000", suffix: "+", label: "Merchants" },
                    { value: "99", suffix: "%", label: "Uptime" },
                    { value: "24", suffix: "hr", label: "Funding" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-foreground">
                        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right Content - Image Grid with floating animation */}
            <div className="relative grid grid-cols-2 gap-3 max-w-full overflow-hidden">
              <div className="space-y-3">
                <AnimatedSection delay={0.15}>
                  <div className="bg-muted rounded-2xl aspect-video overflow-hidden group cursor-pointer">
                    <img src={pataPro} alt="Pata Pro POS Display" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.3}>
                  <div className="bg-muted rounded-2xl aspect-square overflow-hidden animate-float-slow group cursor-pointer">
                    <img src={pataDiamond} alt="Pata Diamond Card Machine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </AnimatedSection>
              </div>
              <div className="space-y-3 pt-8">
                <AnimatedSection delay={0.25}>
                  <div className="bg-muted rounded-2xl aspect-square overflow-hidden animate-float group cursor-pointer">
                    <img src={pataPlatinum} alt="Pata Platinum Card Machine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.4}>
                  <div className="bg-muted rounded-2xl aspect-video overflow-hidden group cursor-pointer">
                    <img src={pata3dLogo} alt="Pata - POS, Payment Gateway, Wallet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-5 md:px-20 py-12 md:py-20 bg-secondary overflow-hidden relative">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto relative z-10">
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
                  className="bg-card rounded-2xl p-6 transition-all group border border-border block hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 duration-300 hover:border-primary/30 relative overflow-hidden"
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer bg-[length:200%_100%] transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 group-hover:rotate-3 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{feature.tagline}</p>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    {feature.extra && <p className="text-primary text-sm mb-4">{feature.extra}</p>}
                    {"showDownload" in feature && feature.showDownload && (
                      <div className="flex gap-2 mb-4">
                        <a href="#" className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                          Android App
                        </a>
                        <a href="#" className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
                          iOS App
                        </a>
                      </div>
                    )}
                    <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Pata — trust signals */}
      <section className="px-5 md:px-20 py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why <span className="pata-hero-gradient">thousands</span> trust Pata
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Setup", desc: "Go live in under 5 minutes. No paperwork, no contracts, no waiting." },
              { icon: Shield, title: "Bank-Grade Security", desc: "PCI-DSS compliant with end-to-end encryption on every transaction." },
              { icon: TrendingUp, title: "Grow Revenue", desc: "Accept more payment methods and never miss a sale again." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={0.15 * i}>
                <div className="text-center group cursor-default">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce-subtle group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="px-5 md:px-20 py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <AnimatedSection delay={0}>
              <Link
                to="/capital"
                className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 transition-all group border border-primary/20 block hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <p className="text-muted-foreground text-sm mb-2">Funding that flows with you</p>
                <h3 className="text-2xl font-bold text-foreground mb-3">Pata Capital</h3>
                <p className="text-muted-foreground mb-4">
                  Access business funding in 24 hours. No paperwork, flexible repayment that adjusts with your sales.
                </p>
                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Check your offer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <Link
                to="/products"
                className="bg-gradient-to-br from-info/10 to-info/5 dark:from-info/20 dark:to-info/10 rounded-2xl p-8 transition-all group border border-info/20 block hover:-translate-y-1 hover:shadow-xl hover:shadow-info/10 duration-300 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-info/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <p className="text-muted-foreground text-sm mb-2">Send money across borders</p>
                <h3 className="text-2xl font-bold text-foreground mb-3">Mukuru Transfer</h3>
                <p className="text-muted-foreground mb-4">
                  Fast, secure international money transfers via Mukuru. Send and receive across borders at competitive rates.
                </p>
                <span className="text-info font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
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
