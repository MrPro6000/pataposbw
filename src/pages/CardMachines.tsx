import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import pataHeroImg from "@/assets/pata-pos-hero.png";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import { ArrowDown, Star, Check, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CartButton from "@/components/CartButton";

// Import device images
import pataSpazaImg from "@/assets/devices/pata-spaza.jpeg";
import pataSilverImg from "@/assets/devices/pata-silver.jpeg";
import goPataImg from "@/assets/devices/go-pata.jpeg";
import pataDiamondImg from "@/assets/devices/pata-diamond.jpeg";
import pataProImg from "@/assets/devices/pata-pro.jpeg";
import pataPlatinumImg from "@/assets/devices/pata-platinum.jpeg";

const CardMachines = () => {
  const { addItem } = useCart();
  const machines = [
    {
      name: "Go Pata",
      price: "P880",
      image: pataPlatinumImg,
      description: "Compact, portable terminal perfect for on-the-go transactions.",
      features: ["Physical keypad", "Built-in printer", "All-day battery"],
      badge: "Best Seller",
    },
    {
      name: "Pata Silver",
      price: "P3,480",
      image: pataSilverImg,
      description: "Sleek touchscreen tablet for modern retail environments.",
      features: ["Touchscreen display", "Compact design", "Fast processing"],
      badge: null,
    },
    {
      name: "Pata Pro",
      price: "P3,880",
      image: pataProImg,
      description: "Professional-grade terminal with integrated thermal printer.",
      features: ["Built-in printer", "NFC contactless", "Touchscreen"],
      badge: "Most Popular",
    },
    {
      name: "Pata Diamond",
      price: "P1,980",
      image: pataDiamondImg,
      description: "Entry-level terminal with essential features for small businesses.",
      features: ["Large touchscreen", "Thermal printer", "4G connectivity"],
      badge: null,
    },
    {
      name: "Pata Platinum",
      price: "P998",
      image: goPataImg,
      description: "Durable keypad terminal built for high-volume retail.",
      features: ["Rugged design", "Physical keypad", "Card chip reader"],
      badge: null,
    },
    {
      name: "Pata Spaza",
      price: "P6,600",
      image: pataSpazaImg,
      description: "Complete POS system with dual displays for retail stores.",
      features: ["Customer display", "Receipt printer", "Full POS system"],
      badge: "Enterprise",
    },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pata-badge mb-6">
                <Star className="w-4 h-4 text-primary" />
                <span>Limited-time <span className="text-primary">offers</span> – while stocks last</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Accept every<br />
                payment,<br />
                <span className="pata-hero-gradient">anywhere</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Tap, swipe, scan, or insert. Our smart terminals accept all cards, mobile wallets, and QR payments—empowering you to never miss a sale.
              </p>

              <div className="flex items-center gap-4">
                <Link to="/shop" className="pata-btn-cyan">
                  View all devices
                  <ArrowDown className="w-4 h-4" />
                </Link>
                <ContactSalesDialog>
                  <button className="text-foreground font-semibold hover:opacity-80 transition-opacity uppercase text-sm tracking-wide">
                    Talk to Sales
                  </button>
                </ContactSalesDialog>
              </div>
            </div>

            <div className="relative">
              <img 
                src={pataHeroImg} 
                alt="Pata POS payment terminal in use" 
                className="w-full h-auto rounded-3xl object-cover aspect-[4/3]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="px-6 md:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Sale now on</h2>
            <p className="text-muted-foreground mt-2">While stocks last.</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-20 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Choose your payment terminal</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <div key={machine.name} className="bg-card rounded-2xl p-6 relative border border-border hover:shadow-lg transition-shadow">
                {machine.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {machine.badge}
                  </div>
                )}
                
                <div className="aspect-square bg-gradient-to-br from-muted to-secondary rounded-xl mb-6 flex items-center justify-center p-4">
                  <img src={machine.image} alt={machine.name} className="w-full h-full object-contain" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{machine.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-foreground">{machine.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{machine.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {machine.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => addItem({
                    id: machine.name.toLowerCase().replace(/\s+/g, '-'),
                    name: machine.name,
                    price: parseInt(machine.price.replace(/[^0-9]/g, '')),
                    image: machine.image,
                    category: "device"
                  })}
                  className="w-full pata-btn-cyan justify-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default CardMachines;
