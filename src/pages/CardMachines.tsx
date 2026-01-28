import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowDown, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";

const CardMachines = () => {
  const machines = [
    {
      name: "Pata Go",
      price: "R799",
      originalPrice: "R999",
      description: "Perfect for businesses just getting started.",
      features: ["Accepts all cards", "Connects to phone", "Free Pata app"],
      badge: "Most Popular",
    },
    {
      name: "Pata Khumo",
      price: "R1,999",
      originalPrice: "R2,499",
      description: "Stand-alone card machine with built-in printer.",
      features: ["Built-in printer", "4G connectivity", "Long battery life"],
      badge: "Best Value",
    },
    {
      name: "Pata Neo",
      price: "R3,999",
      originalPrice: "R4,999",
      description: "Our most advanced card machine with large screen.",
      features: ["Large touchscreen", "Built-in printer", "Fastest processing"],
      badge: null,
    },
  ];

  return (
    <div className="pata-dark-page">
      <MainNav theme="dark" />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pata-badge mb-6">
                <Star className="w-4 h-4 text-[#00C8E6]" />
                <span>Limited-time <span className="text-[#00C8E6]">sale</span> – don't miss out</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Smart, reliable<br />
                card machines–<br />
                built for small<br />
                businesses
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Reliable, fast, and easy to use–Pata card machines are loaded with smart features to keep your business moving.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/shop" className="pata-btn-cyan">
                  Shop deals
                  <ArrowDown className="w-4 h-4" />
                </Link>
                <button className="text-white font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Contact Sales
                </button>
              </div>
            </div>

            {/* Device Preview */}
            <div className="relative">
              <div className="bg-[#00C8E6] rounded-3xl p-6 aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#141414] font-bold text-lg mb-2">PATA</div>
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="text-[#141414] font-medium">Lekker Cafe</div>
                    <div className="text-[#141414]/60 text-sm">Payment approved</div>
                    <div className="text-[#00C8E6] text-2xl font-bold mt-2">R100.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="px-6 md:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#141414]">Sale now on</h2>
            <p className="text-[#141414]/60 mt-2">While stocks last.</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose your card machine</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <div key={machine.name} className="bg-[#1a1a1a] rounded-2xl p-6 relative">
                {machine.badge && (
                  <div className="absolute top-4 right-4 bg-[#00C8E6] text-[#141414] px-3 py-1 rounded-full text-xs font-semibold">
                    {machine.badge}
                  </div>
                )}
                
                <div className="aspect-square bg-[#2a2a2a] rounded-xl mb-6 flex items-center justify-center">
                  <div className="w-24 h-32 bg-[#00C8E6] rounded-lg"></div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{machine.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">{machine.price}</span>
                  <span className="text-white/40 line-through">{machine.originalPrice}</span>
                </div>
                <p className="text-white/60 text-sm mb-4">{machine.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {machine.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/80 text-sm">
                      <Check className="w-4 h-4 text-[#00C8E6]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full pata-btn-cyan justify-center">
                  Buy now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default CardMachines;
