import {
  Package,
  FileText,
  BookOpen,
  Link2,
  Layers,
  Users,
  Contact,
  BarChart3,
  Receipt,
  Radio,
  Wifi,
  IdCard,
} from "lucide-react";

/**
 * The software services Pata offers as a service — the tools that hold a
 * business together. Deliberately framed around everyday software work
 * (cataloguing, invoicing, record keeping, connecting accounts) rather than
 * payment collection, so the public site can lead with the software itself.
 */
export const softwareServices = [
  {
    icon: Package,
    name: "Product Catalogue",
    tagline: "Everything you sell, in one list",
    description:
      "List every item with its price, category and photo. Add, edit or retire products from any device and the catalogue stays the same everywhere.",
  },
  {
    icon: FileText,
    name: "Invoice Creation",
    tagline: "Professional invoices in seconds",
    description:
      "Build an invoice with your logo and details, download it as a PDF, and keep a copy of every invoice you have ever sent.",
  },
  {
    icon: BookOpen,
    name: "Record Keeping",
    tagline: "A book that writes itself",
    description:
      "Every sale, purchase, expense and payout is logged as it happens. Search, filter and export the history whenever you need it.",
  },
  {
    icon: Link2,
    name: "Account Connections",
    tagline: "Your accounts, one place",
    description:
      "Connect bank accounts, mobile money wallets and card terminals so balances and activity sit together instead of scattered across apps.",
  },
  {
    icon: Layers,
    name: "Stock Control",
    tagline: "Know what you have left",
    description:
      "Track what is in stock, what is running low and what is sold out — before it costs you a sale.",
  },
  {
    icon: Users,
    name: "Staff & Roles",
    tagline: "Your team, properly organised",
    description:
      "Add team members, give each person a role and permissions, and keep payroll records in the same system as the rest of the business.",
  },
  {
    icon: Contact,
    name: "Customer Records",
    tagline: "Remember every customer",
    description:
      "Keep customer details and their history with your business, ready the moment they walk in or call.",
  },
  {
    icon: BarChart3,
    name: "Reports & Insights",
    tagline: "See how the business is doing",
    description:
      "Read sales, stock and performance by day, week or month in charts you can understand at a glance.",
  },
  {
    icon: Receipt,
    name: "Digital Receipts",
    tagline: "Proof of every transaction",
    description:
      "Issue receipts with your own branding, customise what appears on them, and let customers keep a copy on their phone.",
  },
];

export type SoftwareService = (typeof softwareServices)[number];

/**
 * Services that sit in Pata Mobile — the sister system that handles bulk
 * digital services. Listed as capabilities only: no packages, no prices.
 */
export const pataMobileServices = [
  {
    icon: FileText,
    name: "Automated invoicing",
    description: "Invoices generated and sent automatically, with a copy kept of every one.",
  },
  {
    icon: Wifi,
    name: "Bulk data sales",
    description: "Mobile data bundles supplied in bulk through approved partners.",
  },
  {
    icon: Radio,
    name: "Bulk airtime sales & distribution",
    description: "Airtime sold and distributed in bulk to resellers, agents and customers.",
  },
  {
    icon: IdCard,
    name: "SIM card distribution",
    description: "SIM cards distributed to agents and retail outlets.",
  },
];

export type PataMobileService = (typeof pataMobileServices)[number];
