import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import { ArrowRight, ShoppingCart, Check } from "lucide-react";
import { Link } from "react-router-dom";

// Import device images
import pataSpazaImg from "@/assets/devices/pata-spaza.jpeg";
import pataSilverImg from "@/assets/devices/pata-silver.jpeg";
import goPataImg from "@/assets/devices/go-pata.jpeg";
import pataDiamondImg from "@/assets/devices/pata-diamond.jpeg";
import pataProImg from "@/assets/devices/pata-pro.jpeg";
import pataPlatinumImg from "@/assets/devices/pata-platinum.jpeg";

const Shop = () => {
  const devices = [
    {
      name: "Go Pata",
      price: "P780",
      image: goPataImg,
      description: "Compact handheld terminal with physical keypad. Perfect for quick transactions.",
      features: ["Physical keypad", "Built-in printer", "All-day battery"],
      badge: "Best Seller",
    },
    {
      name: "Pata Silver",
      price: "P4,880",
      image: pataSilverImg,
      description: "Sleek touchscreen tablet. Modern and portable for any business.",
      features: ["Touchscreen display", "Compact design", "Fast processing"],
    },
    {
      name: "Pata Pro",
      price: "P3,880",
      image: pataProImg,
      description: "Powerful handheld with built-in thermal printer and NFC tap.",
      features: ["Built-in printer", "NFC tap to pay", "Touchscreen"],
      badge: "Most Popular",
    },
    {
      name: "Pata Diamond",
      price: "P680",
      image: pataDiamondImg,
      description: "Premium handheld with large touchscreen and thermal printer.",
      features: ["Large touchscreen", "Thermal printer", "4G connectivity"],
    },
    {
      name: "Pata Platinum",
      price: "P999",
      image: pataPlatinumImg,
      description: "Classic keypad terminal with reliable performance and durability.",
      features: ["Durable design", "Physical keypad", "Card chip reader"],
    },
    {
      name: "Pata Spaza",
      price: "P3,800",
      image: pataSpazaImg,
      description: "Full POS system with large display and customer-facing screen. Ideal for retail stores.",
      features: ["Customer display", "Receipt printer", "Full POS system"],
      badge: "Enterprise",
    },
  ];

  const accessories = [
    { name: "Charging Dock", price: "P149", image: "/placeholder.svg" },
    { name: "Carry Case", price: "P99", image: "/placeholder.svg" },
    { name: "Receipt Paper (10 rolls)", price: "P79", image: "/placeholder.svg" },
    { name: "Screen Protector", price: "P49", image: "/placeholder.svg" },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Shop Pata<br />
              <span className="pata-hero-gradient">devices</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get the hardware you need to start accepting payments today. Free delivery across Botswana.
            </p>
          </div>

          {/* Devices Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {devices.map((device) => (
              <div
                key={device.name}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-muted to-secondary p-4 flex items-center justify-center">
                  {device.badge && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-10">
                      {device.badge}
                    </span>
                  )}
                  <img 
                    src={device.image} 
                    alt={device.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{device.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary">{device.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{device.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {device.features.map((feature) => (
                      <li key={feature} className="text-muted-foreground text-sm flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Accessories */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Accessories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {accessories.map((accessory) => (
                <div
                  key={accessory.name}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <img 
                      src={accessory.image} 
                      alt={accessory.name}
                      className="w-16 h-16 object-contain opacity-50"
                    />
                  </div>
                  <h4 className="text-foreground font-medium text-sm mb-1">{accessory.name}</h4>
                  <p className="text-primary font-semibold">{accessory.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="px-6 md:px-20 py-12 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Free Delivery", sublabel: "Across Botswana" },
              { label: "1 Year Warranty", sublabel: "On all devices" },
              { label: "24/7 Support", sublabel: "Always here to help" },
              { label: "Easy Returns", sublabel: "14-day return policy" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-foreground font-semibold">{item.label}</p>
                <p className="text-muted-foreground text-sm">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Shop;
