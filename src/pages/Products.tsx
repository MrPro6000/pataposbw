import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, CreditCard, Smartphone, Banknote, Wallet, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    {
      icon: Smartphone,
      title: "PataPOS",
      description: "Turn your phone into a powerful point-of-sale system. Sell products, manage inventory, and accept payments anywhere.",
      features: ["Mobile POS", "Inventory management", "Instant receipts"],
      link: "/card-machines",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: CreditCard,
      title: "Payment Terminals",
      description: "Professional card machines designed for African businesses. Accept every payment method, anywhere you operate.",
      features: ["All card types", "Portable & wireless", "Fast settlements"],
      link: "/card-machines",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: Smartphone,
      title: "Digital Payments",
      description: "Launch your online presence instantly. Create payment links, send invoices, and integrate with your website.",
      features: ["Payment links", "Digital invoicing", "E-commerce ready"],
      link: "/online-payments",
      color: "from-emerald-500/20 to-emerald-500/5"
    },
    {
      icon: Globe,
      title: "Mukuru Money Transfer",
      description: "Send and receive money across borders via Mukuru. Fast, secure international transfers at competitive rates.",
      features: ["Multi-currency", "Cross-border", "Competitive rates"],
      link: "/online-payments",
      color: "from-amber-500/20 to-amber-500/5"
    },
    {
      icon: Wallet,
      title: "Mobile Money",
      description: "Accept mobile money payments from all major Botswana providers. Orange Money, Smega, and MyZaka integrated seamlessly.",
      features: ["Orange Money", "Smega", "MyZaka"],
      link: "/online-payments",
      color: "from-orange-500/20 to-orange-500/5"
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-4">Complete payment solutions</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              One platform,<br />
              <span className="pata-hero-gradient">infinite possibilities</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Payments made easier across Botswana — from Pata POS to card terminals.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (
              <Link
                key={product.title}
                to={product.link}
                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6`}>
                  <product.icon className="w-8 h-8 text-foreground" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">{product.title}</h3>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-20 py-16 bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of African entrepreneurs who trust Pata for payments, funding, and business management.
          </p>
          <Link to="/signup" className="pata-btn-cyan inline-flex">
            Start your journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Products;
