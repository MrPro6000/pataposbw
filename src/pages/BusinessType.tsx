import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import {
  ArrowRight,
  Store,
  Truck,
  Scissors,
  Coffee,
  ShoppingBag,
  Stethoscope,
  Landmark,
  Layers,
  Building2,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const BusinessType = () => {
  const businessTypes = [
    {
      icon: Store,
      title: "Retail",
      description: "Card machines and POS solutions for shops, boutiques, and stores of all sizes.",
      benefits: ["Inventory management", "Fast checkout", "Customer loyalty"],
    },
    {
      icon: Coffee,
      title: "Hospitality",
      description: "Solutions for restaurants, cafes, bars, and hotels to serve customers faster.",
      benefits: ["Table management", "Split bills", "Tip tracking"],
    },
    {
      icon: Scissors,
      title: "Services",
      description: "Perfect for salons, spas, and service-based businesses with appointment bookings.",
      benefits: ["Appointment booking", "Client profiles", "Recurring payments"],
    },
    {
      icon: Truck,
      title: "Mobile & Delivery",
      description: "Take payments on the go with portable card machines and mobile POS.",
      benefits: ["Portable terminals", "Offline mode", "GPS tracking"],
    },
    {
      icon: ShoppingBag,
      title: "E-commerce",
      description: "Accept online payments with payment links, invoicing, and website integration.",
      benefits: ["Payment links", "Online checkout", "Multi-currency"],
    },
    {
      icon: Stethoscope,
      title: "Healthcare",
      description: "Secure payment solutions for clinics, pharmacies, and healthcare providers.",
      benefits: ["Secure transactions", "Insurance processing", "Patient billing"],
    },
    {
      icon: Landmark,
      title: "Government",
      description: "Payment collection and processing solutions for government agencies and councils.",
      benefits: ["Bulk processing", "Compliance ready", "Audit trails"],
    },
    {
      icon: Layers,
      title: "Agri Payments",
      description: "Consolidate multiple payment streams into one unified platform for large-scale operations.",
      benefits: ["Multi-source collection", "Unified reporting", "Real-time reconciliation"],
    },
    {
      icon: Building2,
      title: "Banking",
      description: "White-label payment infrastructure and integration solutions for financial institutions.",
      benefits: ["API integration", "White-label ready", "Regulatory compliance"],
    },
    {
      icon: BarChart3,
      title: "Pata Data & Consultancy",
      description:
        "Data-driven insights and consulting services to optimize your payment operations and business strategy.",
      benefits: ["Business analytics", "Payment optimization", "Growth strategy"],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainNav />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Built for your</span>
              <br />
              <span className="pata-hero-gradient">type of business</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you run a retail store, restaurant, or mobile service—we have tailored solutions to help you
              accept payments and grow.
            </p>
          </div>

          {/* Business Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((business) => (
              <div
                key={business.title}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <business.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{business.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{business.description}</p>

                <ul className="space-y-2 mb-5">
                  {business.benefits.map((benefit) => (
                    <li key={benefit} className="text-muted-foreground text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className="text-primary font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-20 py-16 bg-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Don't see your industry?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our solutions work for businesses of all types. Contact us to learn how Pata can help your specific needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="pata-btn-cyan">
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <ContactSalesDialog>
              <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                Contact Sales
              </button>
            </ContactSalesDialog>
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default BusinessType;
