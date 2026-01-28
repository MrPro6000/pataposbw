import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Pay-as-you-go",
      rate: "2.6%",
      rateLabel: "per transaction",
      description: "Perfect for businesses just getting started or with lower volumes.",
      features: [
        "No monthly fees",
        "No hidden costs",
        "All card types accepted",
        "Next-day payouts",
        "Free Yoco app",
      ],
    },
    {
      name: "Growing",
      rate: "2.3%",
      rateLabel: "per transaction",
      description: "For businesses processing over R50,000 per month.",
      features: [
        "Lower transaction fees",
        "Priority support",
        "Advanced reporting",
        "Same-day payouts",
        "Dedicated account manager",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      rate: "Custom",
      rateLabel: "pricing",
      description: "For high-volume businesses with specific needs.",
      features: [
        "Volume-based pricing",
        "Custom integration",
        "24/7 priority support",
        "Instant payouts",
        "API access",
      ],
    },
  ];

  return (
    <div className="yoco-dark-page">
      {/* Hero with background image effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a0a]/80 to-[#141414]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23331a00%22 opacity=%220.3%22 width=%22100%22 height=%22100%22/></svg>')] opacity-50"></div>
        
        <div className="relative">
          <MainNav theme="dark" />

          <section className="px-6 md:px-20 py-20 md:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Fair pricing for<br />
                  faster growth
                </h1>

                <p className="text-lg text-white/70 mb-8">
                  We've got flexible pricing plans to suit any growing businesses big and small.
                </p>

                <div className="flex items-center gap-4">
                  <Link to="/signup" className="yoco-btn-cyan">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="text-white font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                    Contact Sales
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
                className={`rounded-2xl p-8 ${
                  tier.popular 
                    ? 'bg-[#00C8E6] text-[#141414]' 
                    : 'bg-[#1a1a1a] text-white'
                } relative`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-[#141414] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{tier.rate}</span>
                  <span className={tier.popular ? 'text-[#141414]/70' : 'text-white/60'}>
                    {tier.rateLabel}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${tier.popular ? 'text-[#141414]/70' : 'text-white/60'}`}>
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 ${tier.popular ? 'text-[#141414]' : 'text-[#00C8E6]'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-full font-semibold transition-colors ${
                  tier.popular 
                    ? 'bg-[#141414] text-white hover:bg-[#2a2a2a]' 
                    : 'border border-white/40 hover:bg-white hover:text-[#141414]'
                }`}>
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction Fees */}
      <section className="px-6 md:px-20 py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Simple, transparent pricing
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Visa & Mastercard", rate: "2.6%" },
              { label: "American Express", rate: "3.5%" },
              { label: "Online payments", rate: "2.95%" },
              { label: "Instant payouts", rate: "1%" },
            ].map((item) => (
              <div key={item.label} className="bg-[#2a2a2a] rounded-xl p-6">
                <div className="text-3xl font-bold text-[#00C8E6] mb-2">{item.rate}</div>
                <div className="text-white/60 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default Pricing;
