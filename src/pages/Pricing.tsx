import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Starter",
      rate: "2.6%",
      rateLabel: "per transaction",
      description: "Ideal for new businesses and entrepreneurs finding their footing.",
      features: [
        "Zero monthly fees",
        "Transparent pricing",
        "All card types accepted",
        "Next-day settlements",
        "Full Pata platform access",
      ],
    },
    {
      name: "Growth",
      rate: "2.3%",
      rateLabel: "per transaction",
      description: "Built for scaling businesses processing over P50,000 monthly.",
      features: [
        "Reduced transaction rates",
        "Priority merchant support",
        "Advanced analytics",
        "Same-day settlements",
        "Dedicated success manager",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      rate: "Custom",
      rateLabel: "pricing",
      description: "Tailored solutions for high-volume operations and corporations.",
      features: [
        "Volume-based rates",
        "Custom integrations",
        "24/7 dedicated support",
        "Instant settlements",
        "Full API access",
      ],
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero with gradient background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background"></div>
        
        <div className="relative">
          <MainNav />

          <section className="px-6 md:px-20 py-20 md:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Transparent pricing,<br />
                  <span className="pata-hero-gradient">built for growth</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8">
                  Flexible plans designed for African businesses at every stage. No hidden fees, no surprises.
                </p>

                <div className="flex items-center gap-4">
                  <Link to="/signup" className="pata-btn-cyan">
                    Start accepting payments
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                    Talk to Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`rounded-2xl p-8 relative border ${
                  tier.popular 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card text-card-foreground border-border'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-background text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{tier.rate}</span>
                  <span className={tier.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                    {tier.rateLabel}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${tier.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 ${tier.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/signup"
                  className={`w-full py-3 rounded-full font-semibold transition-colors flex items-center justify-center ${
                    tier.popular 
                      ? 'bg-background text-foreground hover:bg-background/90' 
                      : 'border border-border hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction Fees */}
      <section className="px-6 md:px-20 py-16 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Clear, straightforward rates
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Visa & Mastercard", rate: "2.6%" },
              { label: "American Express", rate: "3.5%" },
              { label: "Online transactions", rate: "2.95%" },
              { label: "Instant settlements", rate: "1%" },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-xl p-6 border border-border">
                <div className="text-3xl font-bold text-primary mb-2">{item.rate}</div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Pricing;
