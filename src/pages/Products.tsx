import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, CreditCard, Smartphone, Banknote, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    {
      icon: CreditCard,
      title: "Card Machines",
      description: "Accept card payments anywhere with our smart, portable card machines. Built for small businesses.",
      features: ["Accepts all cards", "Portable & wireless", "Next-day payouts"],
      link: "/card-machines",
      color: "from-[#00C8E6]/20 to-[#00C8E6]/5"
    },
    {
      icon: Smartphone,
      title: "Online Payments",
      description: "Start selling online in minutes. Create payment links, invoices, and integrate with your website.",
      features: ["Payment links", "Invoicing", "E-commerce integration"],
      link: "/online-payments",
      color: "from-[#D4B896]/20 to-[#D4B896]/5"
    },
    {
      icon: Banknote,
      title: "Pata Capital",
      description: "Get the funding you need to grow. Fast approval, flexible repayment from your sales.",
      features: ["Quick approval", "Flexible repayment", "No fixed fees"],
      link: "/capital",
      color: "from-[#4CAF50]/20 to-[#4CAF50]/5"
    },
    {
      icon: TrendingUp,
      title: "Business Hub",
      description: "Track sales, manage inventory, and understand your customers—all from one dashboard.",
      features: ["Sales analytics", "Inventory tracking", "Customer insights"],
      link: "/dashboard",
      color: "from-[#9C27B0]/20 to-[#9C27B0]/5"
    },
  ];

  return (
    <div className="pata-dark-page">
      <MainNav theme="dark" />
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[#00C8E6] text-sm font-medium uppercase tracking-wide mb-4">Payments made simple</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              One platform,<br />
              <span className="text-[#D4B896]">infinite ways to get paid</span>
            </h1>
            <p className="text-lg text-white/70">
              From mobile POS to card machines, payment links to international transfers—Pata puts the power of payments in your pocket.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (
              <Link
                key={product.title}
                to={product.link}
                className="group bg-[#1a1a1a] rounded-2xl p-8 hover:bg-[#222] transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6`}>
                  <product.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{product.title}</h3>
                <p className="text-white/60 mb-6">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <span className="text-[#00C8E6] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-20 py-16 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Join thousands of businesses already using Pata to accept payments and manage their business.
          </p>
          <Link to="/signup" className="pata-btn-cyan inline-flex">
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MainFooter theme="dark" />
    </div>
  );
};

export default Products;
