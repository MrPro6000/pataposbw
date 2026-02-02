import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Device images
import pataPro from "@/assets/devices/pata-pro.jpeg";
import pataDiamond from "@/assets/devices/pata-diamond.jpeg";
import pataPlatinum from "@/assets/devices/pata-platinum.jpeg";
import goPata from "@/assets/devices/go-pata.jpeg";

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
                <Star className="w-4 h-4 text-[#0066FF]" />
                <span className="text-[#0066FF] font-medium">202,107</span>
                <span className="text-white/80">businesses trust Pata</span>
              </div>
              
              <h1 className="pata-hero-title text-white mb-2">
                YOUR BUSINESS,
              </h1>
              <h1 className="pata-hero-title text-[#D4B896] mb-6">
                YOUR POCKET
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Turn your phone into a complete payment terminal. Accept card payments, scan & pay, send money worldwide, and manage your entire business—all from your pocket.
              </p>
              
              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Start accepting payments
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/products" className="text-white font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Explore products
                </Link>
              </div>
            </div>
            
            {/* Right Content - Image Grid */}
            <div className="relative grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-[#2a2a2a] rounded-2xl aspect-video overflow-hidden">
                  <img 
                    src={pataPro} 
                    alt="Pata Pro POS Display" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#2a2a2a] rounded-2xl aspect-square overflow-hidden">
                  <img 
                    src={pataDiamond} 
                    alt="Pata Diamond Card Machine" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="bg-[#2a2a2a] rounded-2xl aspect-square overflow-hidden">
                  <img 
                    src={pataPlatinum} 
                    alt="Pata Platinum Card Machine" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#2a2a2a] rounded-2xl aspect-video overflow-hidden">
                  <img 
                    src={goPata} 
                    alt="Go Pata Mobile Device" 
                    className="w-full h-full object-cover"
                  />
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
            One app. Endless possibilities.
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Accept payments, sell products, transfer money globally, and grow your business—all from one powerful platform.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Mobile POS",
                description: "Turn your phone into a complete point of sale. Sell products, manage inventory, and accept payments anywhere.",
                link: "/products",
                tagline: "Your store in your pocket"
              },
              {
                title: "Card Payments",
                description: "Tap, swipe, or scan. Accept all major cards and mobile wallets with instant confirmation.",
                link: "/card-machines",
                tagline: "Every card, everywhere"
              },
              {
                title: "Payment Gateway",
                description: "Connect your online store and accept payments on your website, app, or via payment links.",
                link: "/online-payments",
                tagline: "Sell online in minutes"
              },
              {
                title: "Money Transfer",
                description: "Send money internationally like Western Union, Mukuru, and WorldRemit. Fast, secure, affordable.",
                link: "/products",
                tagline: "Send money worldwide"
              }
            ].map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="bg-[#2a2a2a] rounded-2xl p-6 hover:bg-[#333] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#0066FF]/20 rounded-xl mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#0066FF] rounded-lg"></div>
                </div>
                <p className="text-[#00C8E6] text-xs font-medium uppercase tracking-wide mb-2">{feature.tagline}</p>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm mb-4">{feature.description}</p>
                <span className="text-[#0066FF] font-medium flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/capital" className="bg-gradient-to-br from-[#D4B896]/20 to-[#D4B896]/5 rounded-2xl p-8 hover:from-[#D4B896]/30 transition-colors group">
              <p className="text-[#D4B896] text-xs font-medium uppercase tracking-wide mb-2">Grow faster</p>
              <h3 className="text-2xl font-bold text-white mb-3">Pata Capital</h3>
              <p className="text-white/60 mb-4">Get funding in 24 hours. No paperwork, no credit checks. Pay back as you earn.</p>
              <span className="text-[#D4B896] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Check your offer
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link to="/products" className="bg-gradient-to-br from-[#00C8E6]/20 to-[#00C8E6]/5 rounded-2xl p-8 hover:from-[#00C8E6]/30 transition-colors group">
              <p className="text-[#00C8E6] text-xs font-medium uppercase tracking-wide mb-2">Complete solution</p>
              <h3 className="text-2xl font-bold text-white mb-3">Business Hub</h3>
              <p className="text-white/60 mb-4">Track sales, manage customers, view reports, and control your entire business from one dashboard.</p>
              <span className="text-[#00C8E6] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Hub
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default Home;
