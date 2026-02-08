import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import { ArrowRight, Check, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Capital = () => {
  const benefits = [
    "No paperwork or credit assessments",
    "Funds deposited within 24 hours",
    "Flexible repayment tied to your sales",
    "No fixed monthly obligations",
    "Zero interest charges",
    "Completely transparent terms",
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-medium uppercase tracking-wide mb-4">Funding that flows with you</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Get funded.<br />
                <span className="pata-hero-gradient">Scale faster.</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Skip the banks and bureaucracy. Access business funding in 24 hours with repayments that automatically adjust to your revenue. Powering thousands of African entrepreneurs.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Check eligibility
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <ContactSalesDialog>
                  <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                    Learn More
                  </button>
                </ContactSalesDialog>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl aspect-[4/3] overflow-hidden border border-primary/20">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm">Empowering Business Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 md:px-20 py-16 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Why choose Pata Capital?
              </h2>
              
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">How it works</h3>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Check your offer", description: "See your eligibility and available funding amount in the Pata app." },
                  { step: "2", title: "Accept your terms", description: "Choose how much you need and review the transparent terms." },
                  { step: "3", title: "Receive funds", description: "Money is deposited directly to your account within 24 hours." },
                  { step: "4", title: "Repay automatically", description: "A small percentage of daily sales goes toward repayment—no manual payments." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Capital;
