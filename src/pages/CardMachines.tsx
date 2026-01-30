import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowDown, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";

// Import device images
import pataSpazaImg from "@/assets/devices/pata-spaza.jpeg";
import pataSilverImg from "@/assets/devices/pata-silver.jpeg";
import goPataImg from "@/assets/devices/go-pata.jpeg";
import pataDiamondImg from "@/assets/devices/pata-diamond.jpeg";
import pataProImg from "@/assets/devices/pata-pro.jpeg";
import pataPlatinumImg from "@/assets/devices/pata-platinum.jpeg";

const CardMachines = () => {
  const machines = [
    {
      name: "Go Pata",
      price: "P780",
      image: goPataImg,
      description: "Compact handheld terminal. Perfect for quick transactions.",
      features: ["Physical keypad", "Built-in printer", "All-day battery"],
      badge: "Best Seller",
    },
    {
      name: "Pata Silver",
      price: "P4,880",
      image: pataSilverImg,
      description: "Sleek touchscreen tablet. Modern and portable.",
      features: ["Touchscreen display", "Compact design", "Fast processing"],
      badge: null,
    },
    {
      name: "Pata Pro",
      price: "P3,880",
      image: pataProImg,
      description: "Powerful handheld with built-in thermal printer.",
      features: ["Built-in printer", "NFC tap to pay", "Touchscreen"],
      badge: "Most Popular",
    },
    {
      name: "Pata Diamond",
      price: "P680",
      image: pataDiamondImg,
      description: "Premium handheld with large touchscreen.",
      features: ["Large touchscreen", "Thermal printer", "4G connectivity"],
      badge: null,
    },
    {
      name: "Pata Platinum",
      price: "P999",
      image: pataPlatinumImg,
      description: "Classic keypad terminal with reliable performance.",
      features: ["Durable design", "Physical keypad", "Card chip reader"],
      badge: null,
    },
    {
      name: "Pata Spaza",
      price: "P3,800",
      image: pataSpazaImg,
      description: "Full POS system with customer-facing display.",
      features: ["Customer display", "Receipt printer", "Full POS system"],
      badge: "Enterprise",
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
                    <div className="text-[#00C8E6] text-2xl font-bold mt-2">P100.00</div>
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
                
                <div className="aspect-square bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl mb-6 flex items-center justify-center p-4">
                  <img src={machine.image} alt={machine.name} className="w-full h-full object-contain" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{machine.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">{machine.price}</span>
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
