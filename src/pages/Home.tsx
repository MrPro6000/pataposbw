import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Star, CreditCard, Smartphone, Globe, Wallet, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

// Device images
import pataPro from "@/assets/devices/pata-pro.jpeg";
import pataDiamond from "@/assets/devices/pata-diamond.jpeg";
import pataPlatinum from "@/assets/devices/pata-platinum.jpeg";
import goPata from "@/assets/devices/go-pata.jpeg";
import pata3dLogo from "@/assets/pata-3d-logo.jpg";

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Payments made easier, no hassle, no contracts.</span>
              </div>

              <h1 className="pata-hero-title text-foreground mb-2">YOUR BUSINESS,</h1>
              <h1 className="pata-hero-title pata-hero-gradient mb-6">YOUR POCKET</h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Turn your phone into a complete payment terminal. Accept card payments, scan & pay, send money
                worldwide, and manage your entire business—all from your pocket.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Start accepting payments
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide"
                >
                  Explore products
                </Link>
              </div>
            </div>

            {/* Right Content - Image Grid */}
            <div className="relative grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-muted rounded-2xl aspect-video overflow-hidden">
                  <img src={pataPro} alt="Pata Pro POS Display" className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted rounded-2xl aspect-square overflow-hidden">
                  <img src={pataDiamond} alt="Pata Diamond Card Machine" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="bg-muted rounded-2xl aspect-square overflow-hidden">
                  <img src={pataPlatinum} alt="Pata Platinum Card Machine" className="w-full h-full object-cover" />
                </div>
                <div className="bg-muted rounded-2xl aspect-video overflow-hidden">
                  <img
                    src={pata3dLogo}
                    alt="Pata - POS, Payment Gateway, Wallet"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-20 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            One platform. <span className="pata-hero-gradient">Infinite possibilities.</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Payments made easier across Botswana — from Pata POS to card terminals.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: "PataPOS",
                icon: Smartphone,
                description:
                  "Transform your smartphone into a complete point of sale. Manage products, track inventory, and accept payments on the go.",
                extra: "Download the Pata App and turn your smartphone into a business.",
                link: "/products",
                tagline: "Your store in your pocket",
                showDownload: true,
              },
              {
                title: "Card Payments",
                icon: CreditCard,
                description:
                  "Accept tap, chip, and swipe payments from all major cards and mobile wallets with real-time confirmation.",
                link: "/card-machines",
                tagline: "Every card, everywhere",
              },
              {
                title: "Payment Gateway",
                icon: Globe,
                description:
                  "Connect to your website or WhatsApp. Create payment links and accept online payments in minutes.",
                link: "/online-payments",
                tagline: "Sell online seamlessly",
              },
              {
                title: "Mukuru Transfer",
                icon: ArrowRight,
                description:
                  "Send and receive money across borders via Mukuru. Fast, secure international transfers at competitive rates.",
                link: "/products",
                tagline: "Connect globally",
              },
              {
                title: "Mobile Money",
                icon: Phone,
                description:
                  "Accept and process mobile money payments from Orange Money, Smega, and MyZaka. Seamless integration for your business.",
                link: "/online-payments",
                tagline: "Pay with mobile",
              },
            ].map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-card rounded-2xl p-6 hover:bg-card/80 transition-colors group border border-border"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm mb-2">{feature.tagline}</p>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                {feature.extra && <p className="text-primary text-sm mb-4">{feature.extra}</p>}
                {"showDownload" in feature && feature.showDownload && (
                  <div className="flex gap-2 mb-4">
                    <a
                      href="#"
                      className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Android App
                    </a>
                    <a
                      href="#"
                      className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                    >
                      iOS App
                    </a>
                  </div>
                )}
                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/capital"
              className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-8 hover:from-primary/20 transition-colors group border border-primary/20"
            >
              <p className="text-muted-foreground text-sm mb-2">
                Funding that flows with you
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-3">Pata Capital</h3>
              <p className="text-muted-foreground mb-4">
                Access business funding in 24 hours. No paperwork, flexible repayment that adjusts with your sales.
              </p>
              <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Check your offer
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/products"
              className="bg-gradient-to-br from-info/10 to-info/5 dark:from-info/20 dark:to-info/10 rounded-2xl p-8 hover:from-info/20 transition-colors group border border-info/20"
            >
              <p className="text-muted-foreground text-sm mb-2">Send money across borders</p>
              <h3 className="text-2xl font-bold text-foreground mb-3">Mukuru Transfer</h3>
              <p className="text-muted-foreground mb-4">
                Fast, secure international money transfers via Mukuru. Send and receive across borders at competitive
                rates.
              </p>
              <span className="text-info font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Home;
