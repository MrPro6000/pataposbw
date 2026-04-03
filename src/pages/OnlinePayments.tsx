import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import { ArrowDown, Star, Check, Link2, FileText, ShoppingCart, Phone, Globe, CreditCard, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const OnlinePayments = () => {
  const features = [
    {
      title: "Payment Links",
      description: "Generate shareable payment links for WhatsApp, email, or social media—no website required.",
      icon: Link2,
    },
    {
      title: "Digital Invoicing",
      description: "Send professional invoices and receive payments directly to your account.",
      icon: FileText,
    },
    {
      title: "E-Commerce Integration",
      description: "Seamless checkout integration for your website with minimal setup.",
      icon: ShoppingCart,
    },
    {
      title: "Mobile Money",
      description: "Accept payments from Orange Money, Smega, MyZaka, POSO Money, and Mani—Botswana's leading mobile money providers.",
      icon: Phone,
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
                Connect to your website or WhatsApp. Share payment links via messaging apps, or integrate with popular e-commerce platforms. Reach customers anywhere in the world.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Get Started
                  <ArrowDown className="w-4 h-4" />
                </Link>
                <ContactSalesDialog>
                  <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                    Talk to Sales
                  </button>
                </ContactSalesDialog>
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

            {/* Right Content - Visual cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl aspect-[3/4] p-6 flex flex-col justify-between">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-1">ONLINE</p>
                    <p className="text-white text-lg font-bold">Payment Gateway</p>
                    <p className="text-white/70 text-sm mt-1">Accept payments on your website or WhatsApp store</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl aspect-video p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Payment Received</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">P2,500.00</p>
                  <p className="text-xs text-muted-foreground mt-1">via Payment Link</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-2xl aspect-[3/4] p-6 flex flex-col justify-between">
                  <div className="text-xs text-primary font-semibold">PATA PAY</div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">The Nails Café</p>
                    <p className="text-3xl font-bold text-foreground my-3">P500.00</p>
                    <div className="space-y-2">
                      <div className="bg-primary text-primary-foreground py-2 px-3 rounded-lg text-xs text-center font-medium">Pay Now</div>
                      <div className="flex gap-1.5">
                        <div className="flex-1 bg-muted py-1.5 px-2 rounded-lg text-xs text-center text-muted-foreground">G Pay</div>
                        <div className="flex-1 bg-muted py-1.5 px-2 rounded-lg text-xs text-center text-muted-foreground">Apple Pay</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl aspect-video p-4 flex flex-col justify-center items-center text-center">
                  <Smartphone className="w-8 h-8 text-white mb-2" />
                  <p className="text-white font-bold text-sm">Mobile Money</p>
                  <p className="text-white/80 text-xs mt-1">Orange • Smega • MyZaka • POSO</p>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
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
