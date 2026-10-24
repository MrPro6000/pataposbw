import { Link } from "react-router-dom";
import {
  Link2,
  FileText,
  Zap,
  Globe,
  Smartphone,
  PiggyBank,
  Bus,
  BarChart3,
  ArrowRight
} from "lucide-react";

const softwareProducts = [
  {
    icon: Link2,
    name: "Payment Links",
    description: "Create and share links to get paid instantly — no card machine needed.",
    path: "/dashboard/sales"
  },
  {
    icon: FileText,
    name: "Digital Invoices",
    description: "Send professional invoices with PDF downloads and payment tracking.",
    path: "/dashboard/sales"
  },
  {
    icon: Zap,
    name: "Kazang Services",
    description: "Airtime, data, prepaid electricity, bills, TV and more in one place.",
    path: "/dashboard/sales"
  },
  {
    icon: Globe,
    name: "Payment Gateway",
    description: "Accept online payments from customers anywhere in Botswana and beyond.",
    path: "/dashboard/sales"
  },
  {
    icon: Smartphone,
    name: "E-Wallet Transfers",
    description: "Send money straight from your Pata Wallet to any mobile money wallet.",
    path: "/dashboard/payouts"
  },
  {
    icon: PiggyBank,
    name: "Pata Capital",
    description: "Apply for business funding from P1,000 up to P100,000.",
    path: "/dashboard/hub"
  },
  {
    icon: Bus,
    name: "Transport Fares",
    description: "Log and manage fares for your transport business.",
    path: "/dashboard/transport"
  },
  {
    icon: BarChart3,
    name: "Business Reports",
    description: "Track sales, stock and performance with detailed reports.",
    path: "/dashboard/reports"
  },
];

const SoftwareProductsList = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {softwareProducts.map((product) => (
        <Link
          key={product.name}
          to={product.path}
          className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all"
        >
          <div className="w-11 h-11 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
            <product.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
            {product.name}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default SoftwareProductsList;
