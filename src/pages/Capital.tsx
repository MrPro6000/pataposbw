import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Check, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Capital = () => {
  const benefits = [
    "No paperwork or credit checks",
    "Funds in your account within 24 hours",
    "Pay back as you earn – automatically",
    "No fixed monthly repayments",
    "No interest charges",
    "No hidden fees",
  ];

  return (
    <div className="pata-dark-page">
      <MainNav theme="dark" />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Grow your<br />
                business with<br />
                a cash<br />
                advance
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Pata Capital is a fast, flexible cash advance available to eligible Pata customers. We've disbursed over P3B to our merchants so far.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Check for offer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="text-white font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Contact Us
                </button>
              </div>
            </div>

            {/* Right Content - Image placeholder */}
            <div className="relative">
              <div className="bg-[#f5e6d3] rounded-3xl aspect-[4/3] overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-[#00C8E6]/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-[#00C8E6]" />
                    </div>
                    <span className="text-[#141414]/60 text-sm">Business Growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 md:px-20 py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Why Pata Capital?
              </h2>
              
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 bg-[#00C8E6] rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#141414]" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2a2a2a] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">How it works</h3>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Check your offer", description: "See if you're eligible for a cash advance in the Pata app." },
                  { step: "2", title: "Accept the offer", description: "Choose how much you need and accept the offer." },
                  { step: "3", title: "Get funded", description: "Funds are deposited into your bank account within 24 hours." },
                  { step: "4", title: "Pay as you earn", description: "A small percentage of your daily sales goes towards repayment." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#00C8E6] rounded-full flex items-center justify-center flex-shrink-0 text-[#141414] font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default Capital;
