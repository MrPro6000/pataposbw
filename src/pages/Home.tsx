import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="pata-dark-page">
      <MainNav theme="dark" />
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-4 h-4 text-[#00C8E6]" />
                <span className="text-[#00C8E6] font-medium">202,107</span>
                <span className="text-white/80">businesses run smarter with Pata</span>
              </div>
              
              <h1 className="pata-hero-title text-white mb-2">
                SAVE TIME, MONEY
              </h1>
              <h1 className="pata-hero-title text-[#D4B896] mb-6">
                AND GUESSWORK
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Market leader in card machines, online payments, point of sale solutions and flexible business funding, all in one place.
              </p>
              
              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Sign up
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="text-white font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Find a product
                </Link>
              </div>
            </div>
            
            {/* Right Content - Image Grid */}
            <div className="relative grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-[#2a2a2a] rounded-2xl aspect-video overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a3a4a] to-[#0a2a3a] flex items-center justify-center">
                    <span className="text-white/40 text-sm">POS Display</span>
                  </div>
                </div>
                <div className="bg-[#2a2a2a] rounded-2xl aspect-square overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#3a2a1a] to-[#2a1a0a] flex items-center justify-center">
                    <span className="text-white/40 text-sm">Business Owner</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="bg-[#2a2a2a] rounded-2xl aspect-square overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#1a2a3a] to-[#0a1a2a] flex items-center justify-center">
                    <span className="text-white/40 text-sm">Card Machine</span>
                  </div>
                </div>
                <div className="bg-[#2a2a2a] rounded-2xl aspect-video overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#00C8E6]/20 to-[#00C8E6]/10 flex items-center justify-center">
                    <span className="text-white/40 text-sm">App Screen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Everything you need to grow
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            From accepting payments to managing your business, we've got you covered.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Card Machines",
                description: "Smart, reliable card machines built for small businesses.",
                link: "/card-machines"
              },
              {
                title: "Online Payments",
                description: "Start selling online in minutes with payment links and invoices.",
                link: "/online-payments"
              },
              {
                title: "Pata Capital",
                description: "Grow your business with a fast, flexible cash advance.",
                link: "/capital"
              }
            ].map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-[#2a2a2a] rounded-2xl p-8 hover:bg-[#333] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#00C8E6]/20 rounded-xl mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#00C8E6] rounded-lg"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 mb-4">{feature.description}</p>
                <span className="text-[#00C8E6] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default Home;
