import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowDown, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";

const OnlinePayments = () => {
  const features = [
    {
      title: "Payment Links",
      description: "Create and share payment links via WhatsApp, email or social media.",
    },
    {
      title: "Online Invoices",
      description: "Send professional invoices and get paid directly into your bank account.",
    },
    {
      title: "Website Payments",
      description: "Accept payments on your website with our simple checkout integration.",
    },
  ];

  return (
    <div className="pata-light-page">
      <MainNav theme="light" />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pata-badge-light mb-6">
                <Star className="w-4 h-4 text-[#00C8E6]" />
                <span>Trusted by 200,000 businesses</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#141414] leading-tight mb-6">
                Your online<br />
                store,<br />
                <span className="text-[#00C8E6]">connected</span>
              </h1>

              <p className="text-lg text-[#141414]/70 mb-8 max-w-lg">
                Accept payments on your website, send payment links via WhatsApp, or integrate with Shopify & WooCommerce. Get paid from anywhere in the world.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/signup" className="pata-btn-cyan">
                  Discover more
                  <ArrowDown className="w-4 h-4" />
                </Link>
                <button className="text-[#141414] font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                  Contact Sales
                </button>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-medium">G Pay</span>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-medium">Apple Pay</span>
                </div>
              </div>
              <p className="text-sm text-[#141414]/60 mt-3">
                NEW! With Pata, your customers can now pay you online using Google Pay and Apple Pay–with just one click.
              </p>
            </div>

            {/* Right Content - Preview Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-[#00C8E6] rounded-2xl aspect-[3/4] p-4 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-4 w-full">
                    <div className="text-xs text-[#141414]/60 mb-2">Phone Preview</div>
                    <div className="h-32 bg-[#f5f5f5] rounded-lg"></div>
                  </div>
                </div>
                <div className="bg-[#00C8E6] rounded-2xl aspect-video p-4 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-3 w-full">
                    <div className="text-xs text-[#141414]/60">Laptop Preview</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-2xl aspect-[3/4] p-4 shadow-lg">
                  <div className="text-xs text-[#00C8E6] font-semibold mb-1">PATA</div>
                  <div className="text-sm font-medium text-[#141414]">Cafe Grand</div>
                  <div className="text-2xl font-bold text-[#141414] my-4">R500.00</div>
                  <div className="space-y-2">
                    <div className="bg-[#141414] text-white py-2 px-3 rounded-lg text-xs text-center">G Pay</div>
                    <div className="bg-[#141414] text-white py-2 px-3 rounded-lg text-xs text-center">Apple Pay</div>
                  </div>
                </div>
                <div className="bg-[#9b87f5] rounded-2xl aspect-video p-4 flex items-center justify-center">
                  <div className="text-white text-center text-sm">
                    <div className="font-bold">Shopify</div>
                    <div className="opacity-80 text-xs">WooCommerce</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#141414] mb-12 text-center">
            Multiple ways to get paid online
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-[#00C8E6]/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#00C8E6] rounded-xl"></div>
                </div>
                <h3 className="text-xl font-semibold text-[#141414] mb-3">{feature.title}</h3>
                <p className="text-[#141414]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter theme="light" />
    </div>
  );
};

export default OnlinePayments;
