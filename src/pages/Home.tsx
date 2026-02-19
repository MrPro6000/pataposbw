import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronRight, CreditCard, Smartphone, Globe, Phone } from "lucide-react";
import heroPhoneFront from "@/assets/hero-phone-front.png";
import heroPhoneBack from "@/assets/hero-phone-back.png";
import trustedBadge from "@/assets/trusted-users-badge.png";

// ── Feature cards data ──────────────────────────────────────────────────────
const features = [
  {
    title: "PataPOS",
    icon: Smartphone,
    tagline: "Your store in your pocket",
    description:
      "Transform your smartphone into a complete point of sale. Manage products, track inventory, and accept payments on the go.",
    link: "/products",
  },
  {
    title: "Card Payments",
    icon: CreditCard,
    tagline: "Every card, everywhere",
    description:
      "Accept tap, chip, and swipe payments from all major cards and mobile wallets with real-time confirmation.",
    link: "/card-machines",
  },
  {
    title: "Payment Gateway",
    icon: Globe,
    tagline: "Sell online seamlessly",
    description:
      "Connect to your website or WhatsApp. Create payment links and accept online payments in minutes.",
    link: "/online-payments",
  },
  {
    title: "Mukuru Transfer",
    icon: ArrowUpRight,
    tagline: "Connect globally",
    description:
      "Send and receive money across borders via Mukuru. Fast, secure international transfers at competitive rates.",
    link: "/products",
  },
  {
    title: "Mobile Money",
    icon: Phone,
    tagline: "Pay with mobile",
    description:
      "Accept and process mobile money payments from Orange Money, Smega, and MyZaka. Seamless integration for your business.",
    link: "/online-payments",
  },
];

const faqs = [
  {
    q: "How do I get started with Pata?",
    a: "Simply sign up, complete your KYC verification, set up your business profile, and you're ready to start accepting payments.",
  },
  {
    q: "What payment methods does Pata support?",
    a: "Pata supports card payments (Visa, Mastercard), mobile money (Orange Money, Smega, MyZaka), and international transfers via Mukuru.",
  },
  {
    q: "Is there a contract or setup fee?",
    a: "No contracts and no setup fees. Pata operates on a simple transaction-based pricing model.",
  },
  {
    q: "How fast are payouts?",
    a: "Payouts are processed within 24 hours. With instant payout enabled, funds can arrive even faster.",
  },
];

// ── Shared arrow icon for buttons ──────────────────────────────────────────
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div className="bg-[#030810] text-white min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="flex items-center justify-between px-5 md:px-12 lg:px-20 h-[68px] sticky top-0 z-50 bg-[#030810]/90 backdrop-blur-md border-b border-white/[0.06]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/pata-icon.png" alt="Pata" className="h-7 w-7" />
          <span className="font-extrabold text-xl tracking-widest text-white">PATA</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Products", to: "/products" },
            { label: "Business Type", to: "/business-type" },
            { label: "Pricing", to: "/pricing" },
            { label: "Shop", to: "/shop" },
            { label: "Support", to: "#" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm text-white/70 hover:text-white transition-colors font-medium tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-sm font-semibold text-white hover:bg-white/5 transition-all"
          >
            Login <Arrow />
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1e6ff5] hover:bg-[#1a5ed4] text-sm font-semibold text-white transition-all"
          >
            Get Started <Arrow />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-68px)] flex items-center px-5 md:px-12 lg:px-20 py-16 overflow-hidden">
        {/* Big blue radial glow behind the phones */}
        <div
          className="absolute right-0 top-0 w-[750px] h-[750px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, rgba(20,80,220,0.55) 0%, rgba(10,40,140,0.25) 40%, transparent 70%)",
          }}
        />
        {/* Subtle dark overlay on left to keep text readable */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #030810 35%, transparent 65%)" }}
        />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">

          {/* ── Left copy ── */}
          <div className="max-w-[640px]">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-md border border-white/20 bg-white/[0.06] text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 mb-8">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.8 5.2L13 7L8.8 8.8L7 13L5.2 8.8L1 7L5.2 5.2L7 1Z" fill="#1e6ff5" />
              </svg>
              PAYMENTS MADE EASIER, NO HASSLE, NO CONTRACTS.
            </div>

            {/* Hero headline — Barlow Condensed Italic Black */}
            <h1 className="font-hero font-black italic leading-[0.9] tracking-tight mb-8 uppercase">
              <span className="block text-[clamp(3.5rem,8vw,7rem)] text-white">
                YOUR BUSINESS,
              </span>
              <span
                className="block text-[clamp(3.5rem,8vw,7rem)]"
                style={{ color: "#1e6ff5" }}
              >
                YOUR POCKET
              </span>
            </h1>

            <p className="text-white/55 text-base md:text-[17px] max-w-[500px] mb-10 leading-relaxed">
              Turn your phone into a complete payment terminal. Accept card payments, scan &amp; pay, send money worldwide, and manage your entire business&nbsp; all from your pocket.
            </p>

            {/* CTA Buttons — rectangle style like Framer */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg border border-white/30 text-sm font-semibold text-white hover:bg-white/5 transition-all"
              >
                Start accepting Payments <Arrow />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#1e6ff5] hover:bg-[#1a5ed4] text-sm font-semibold text-white transition-all"
              >
                Explore Products <Arrow />
              </Link>
            </div>
          </div>

          {/* ── Right — phone mockups ── */}
          <div className="relative flex justify-center lg:justify-end items-center h-[520px] lg:h-[600px]">

            {/* Back phone (tilted right, partially behind) */}
            <div
              className="absolute right-[-20px] md:right-[-10px] top-8 z-10"
              style={{ transform: "rotate(10deg) translateX(10px)" }}
            >
              <img
                src={heroPhoneBack}
                alt=""
                className="w-[160px] md:w-[200px] lg:w-[220px] object-contain"
                style={{ filter: "drop-shadow(0 30px 60px rgba(5,20,80,0.8))" }}
              />
            </div>

            {/* Front phone (main, slightly tilted left) */}
            <div
              className="relative z-20"
              style={{ transform: "rotate(-2deg) translateX(-20px)" }}
            >
              <img
                src={heroPhoneFront}
                alt="Pata app"
                className="w-[240px] md:w-[290px] lg:w-[340px] object-contain"
                style={{ filter: "drop-shadow(0 40px 80px rgba(10,40,160,0.5))" }}
              />
            </div>

            {/* Trusted users badge — bottom left */}
            <div className="absolute bottom-[2%] left-0 md:left-[-10px] z-30">
              <img
                src={trustedBadge}
                alt="152,78k+ Trusted Users"
                className="w-[200px] md:w-[240px] object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="benefits" className="px-5 md:px-12 lg:px-20 py-24 bg-[#070d1a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1e6ff5] text-xs font-bold uppercase tracking-widest text-center mb-3">
            Payments made easier across Botswana
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center mb-4">
            One platform.{" "}
            <span style={{ color: "#1e6ff5" }}>Infinite possibilities.</span>
          </h2>
          <p className="text-white/45 text-center max-w-xl mx-auto mb-14 text-sm md:text-base">
            Pata gives businesses of any size the tools to grow revenue, save time and save money, all from one account. No more reconciling between systems.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="group bg-[#0b1220] hover:bg-[#0f1a2e] border border-white/[0.07] hover:border-[#1e6ff5]/30 rounded-2xl p-6 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1e6ff5]/15 flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-[#1e6ff5]" />
                </div>
                <p className="text-white/35 text-xs mb-1.5">{feature.tagline}</p>
                <h3 className="text-white font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{feature.description}</p>
                <span className="inline-flex items-center gap-1.5 text-[#1e6ff5] text-sm font-medium group-hover:gap-2.5 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="px-5 md:px-12 lg:px-20 py-20 bg-[#050a14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/capital"
            className="group relative overflow-hidden bg-[#0b1220] border border-white/[0.07] rounded-2xl p-8 hover:border-[#1e6ff5]/35 transition-all"
          >
            <div
              className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #1e6ff5 0%, transparent 70%)" }}
            />
            <p className="text-white/40 text-sm mb-2">Funding that flows with you</p>
            <h3 className="text-white text-2xl font-extrabold mb-3">Pata Capital</h3>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Access business funding in 24 hours. No paperwork, flexible repayment that adjusts with your sales.
            </p>
            <span className="inline-flex items-center gap-2 text-[#1e6ff5] font-semibold text-sm group-hover:gap-3 transition-all">
              Check your offer <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/products"
            className="group relative overflow-hidden bg-[#0b1220] border border-white/[0.07] rounded-2xl p-8 hover:border-white/20 transition-all"
          >
            <div
              className="absolute top-0 right-0 w-52 h-52 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
            />
            <p className="text-white/40 text-sm mb-2">Send money across borders</p>
            <h3 className="text-white text-2xl font-extrabold mb-3">Mukuru Transfer</h3>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Fast, secure international money transfers via Mukuru. Send and receive across borders at competitive rates.
            </p>
            <span className="inline-flex items-center gap-2 text-white/50 font-semibold text-sm group-hover:text-white group-hover:gap-3 transition-all">
              Learn more <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-5 md:px-12 lg:px-20 py-20 bg-[#070d1a]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#1e6ff5] text-xs font-bold uppercase tracking-widest text-center mb-4">
            WE'VE GOT YOU COVERED
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-[#0b1220] border border-white/[0.07] rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="text-white font-semibold text-sm md:text-base pr-4">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-white/35 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#050a14] text-white py-16 px-5 md:px-12 lg:px-20 border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <img src="/pata-icon.png" alt="Pata" className="h-6 w-6" />
                <span className="font-extrabold text-sm tracking-widest">PATA</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Empowering African businesses with seamless payments, smart terminals, and growth capital. Built in Botswana.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xl" role="img" aria-label="Botswana flag">🇧🇼</span>
                <span className="text-white/35 text-xs">Made in Botswana</span>
              </div>
            </div>

            {[
              { title: "Products", items: ["Card Machines", "Point of Sale", "Online Payments", "Pata Capital", "Pata App"] },
              { title: "Business Type", items: ["Retail", "Food & Beverage", "Services", "Health & Beauty", "E-commerce"] },
              { title: "Resources", items: ["Pricing", "Blog", "Help Centre", "Developer Docs"] },
              { title: "Company", items: ["About Us", "Careers", "Press", "Contact Us"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-white/35 text-sm hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.07] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">© 2025 Pata Technologies (Pty) Ltd. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="text-white/30 text-sm hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
