import { FileText, BarChart3, Receipt, Radio, Wifi, IdCard } from "lucide-react";

/** Public website descriptions only; the POS app tools are independent. */
export const softwareServices = [
  {
    icon: FileText,
    name: "Invoice Creation",
    tagline: "Professional invoices in seconds",
    description:
      "Build an invoice with your logo and details, download it as a PDF, and keep a copy of every invoice you have ever sent.",
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
  ...softwareServices,
  {
    icon: FileText,
    name: "Automated invoicing",
    description:
      "Invoices go out on their own as soon as a sale or delivery is confirmed, so nobody has to remember to send one. A copy of every invoice is filed automatically and stays searchable whenever it is needed again.",
  },
  {
    icon: Wifi,
    name: "Bulk data sales",
    description:
      "Mobile data bundles are supplied in volume through approved partners, ready to send out in one batch. You decide who receives what, and each send is logged the moment it goes.",
  },
  {
    icon: Radio,
    name: "Bulk airtime sales & distribution",
    description:
      "Airtime is bought and released in bulk, then distributed to agents and resellers instead of being handled one voucher at a time. Every allocation is recorded, so you always know what left the account and where it went.",
  },
  {
    icon: IdCard,
    name: "SIM card distribution",
    description:
      "SIM cards are supplied and distributed to agents and retail outlets on a controlled schedule. Stock moves out in tracked batches, so each outlet's allocation is known at any point.",
  },
];

export type PataMobileService = (typeof pataMobileServices)[number];
