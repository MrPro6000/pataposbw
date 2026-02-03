import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowDown, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";

const OnlinePayments = () => {
  const features = [
    {
      title: "Payment Links",
      description: "Generate shareable payment links for WhatsApp, email, or social media—no website required.",
    },
    {
      title: "Digital Invoicing",
      description: "Send professional invoices and receive payments directly to your account.",
    },
    {
      title: "E-Commerce Integration",
      description: "Seamless checkout integration for your website with minimal setup.",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pata-badge mb-6">
                <Star className="w-4 h-4 text-primary" />
                <span>Trusted by businesses across Africa</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Your digital<br />
                storefront,<br />
                <span className="pata-hero-gradient">connected</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Accept payments on your website, share payment links via messaging apps, or integrate with popular e-commerce platforms. Reach customers anywhere in the world.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Learn more
                  <ArrowDown className="w-4 h-4" />
                </Link>
                <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Talk to Sales
                </button>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <div className="bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">G Pay</span>
                </div>
                <div className="bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Apple Pay</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                NEW! Enable Google Pay and Apple Pay for one-click checkout experiences.
              </p>
            </div>

            {/* Right Content - Preview Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-primary rounded-2xl aspect-[3/4] p-4 flex items-center justify-center">
                  <div className="bg-card rounded-xl p-4 w-full">
                    <div className="text-xs text-muted-foreground mb-2">Mobile Preview</div>
                    <div className="h-32 bg-muted rounded-lg"></div>
                  </div>
                </div>
                <div className="bg-primary rounded-2xl aspect-video p-4 flex items-center justify-center">
                  <div className="bg-card rounded-xl p-3 w-full">
                    <div className="text-xs text-muted-foreground">Desktop Preview</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-card rounded-2xl aspect-[3/4] p-4 shadow-lg border border-border">
                  <div className="text-xs text-primary font-semibold mb-1">PATA</div>
                  <div className="text-sm font-medium text-foreground">Coffee Corner</div>
                  <div className="text-2xl font-bold text-foreground my-4">P500.00</div>
                  <div className="space-y-2">
                    <div className="bg-foreground text-background py-2 px-3 rounded-lg text-xs text-center">G Pay</div>
                    <div className="bg-foreground text-background py-2 px-3 rounded-lg text-xs text-center">Apple Pay</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl aspect-video p-4 flex items-center justify-center">
                  <div className="text-white text-center text-sm">
                    <div className="font-bold">Shopify</div>
                    <div className="opacity-80 text-xs">WooCommerce</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Multiple channels, one platform
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-xl"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default OnlinePayments;
