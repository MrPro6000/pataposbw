import { Link } from "react-router-dom";
import { ArrowUpRight, CreditCard, Smartphone, Globe, Phone, ChevronDown, ChevronRight } from "lucide-react";

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

const Home = () => {
  return (
    <div className="bg-[#050a14] text-white min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="flex items-center justify-between px-5 md:px-16 lg:px-24 h-16 border-b border-white/5 sticky top-0 z-50 bg-[#050a14]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <img src="/pata-icon.png" alt="Pata" className="h-7 w-7" />
          <span className="font-bold text-lg tracking-tight">PATA</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
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
              className="text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-white/20 text-sm font-medium text-white hover:bg-white/5 transition-all"
          >
            Login <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1e6ff5] hover:bg-[#1a5ed4] text-sm font-semibold text-white transition-all"
          >
            Get Started <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center px-5 md:px-16 lg:px-24 py-20 overflow-hidden">
        {/* Glowing radial behind phones */}
        <div
          className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(30,111,245,0.32) 0%, rgba(30,111,245,0.07) 50%, transparent 72%)",
          }}
        />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs font-semibold uppercase tracking-widest text-white/65 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e6ff5]" />
              Payments made easier, no hassle, no contracts.
            </div>

            <h1 className="font-extrabold leading-none tracking-tight mb-8">
              <span className="block text-5xl md:text-6xl lg:text-7xl text-white uppercase">
                YOUR BUSINESS,
              </span>
              <span
                className="block text-5xl md:text-6xl lg:text-7xl uppercase"
                style={{ color: "#1e6ff5" }}
              >
                YOUR POCKET
              </span>
            </h1>

            <p className="text-white/55 text-base md:text-lg max-w-md mb-10 leading-relaxed">
              Turn your phone into a complete payment terminal. Accept card payments, scan &amp; pay, send money worldwide, and manage your entire business all from your pocket.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/5 transition-all"
              >
                Start accepting Payments <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1e6ff5] hover:bg-[#1a5ed4] text-sm font-semibold text-white transition-all"
              >
                Explore Products <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — phone mockups */}
          <div className="relative flex justify-center lg:justify-end items-center h-[520px]">
            {/* Back phone */}
            <div className="absolute right-0 top-0 w-[200px] md:w-[230px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-10 rotate-6 bg-[#0d1526]">
              <div className="h-[460px] md:h-[520px] flex flex-col p-4 gap-3">
                <div className="flex justify-between text-white/30 text-[9px] mb-1">
                  <span>PATA</span>
                  <div className="w-5 h-2.5 rounded-sm border border-white/20 relative">
                    <div className="absolute inset-[2px] right-[3px] bg-white/30 rounded-sm" />
                  </div>
                </div>
                <div className="bg-[#1e3a6e]/60 rounded-2xl p-4 text-center border border-[#1e6ff5]/20">
                  <p className="text-white/40 text-[10px] mb-1">Payout amount</p>
                  <p className="text-white font-bold text-2xl">P1204.00</p>
                  <p className="text-white/30 text-[10px] mt-1">Net transfer</p>
                </div>
                <div className="mt-2 space-y-2">
                  {[
                    { label: "Payout", date: "9 May 2024", amt: "P16.35" },
                    { label: "Instant Payout", date: "8 May 2024", amt: "-P12.45" },
                    { label: "Instant Payout", date: "8 May 2024", amt: "-P12.45" },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#111c33] rounded-xl px-3 py-2.5">
                      <div>
                        <p className="text-white/70 text-[10px] font-medium">{row.label}</p>
                        <p className="text-white/30 text-[9px]">{row.date}</p>
                      </div>
                      <span className="text-white/70 text-[10px] font-semibold">{row.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Front phone */}
            <div className="relative w-[215px] md:w-[250px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl z-20 -rotate-2 bg-[#0b1220]">
              <div className="h-[480px] md:h-[540px] flex flex-col p-4 gap-3">
                <div className="flex justify-between items-center text-white/35 text-[9px] pb-1">
                  <span>1:01</span>
                  <div className="bg-[#1a2744] px-2 py-0.5 rounded-full text-white/60 text-[9px] font-bold">PATA</div>
                </div>

                <div className="bg-[#1e6ff5]/15 rounded-2xl p-4 text-center border border-[#1e6ff5]/25">
                  <p className="text-white/45 text-[10px] mb-1">Payout amount</p>
                  <p className="text-white font-bold text-3xl">P4.34</p>
                  <p className="text-white/35 text-[10px] mt-1">You are below the minimum payout amount</p>
                </div>

                <div className="bg-[#1e6ff5] rounded-xl py-2.5 text-center">
                  <p className="text-white text-xs font-semibold">⚡ Instant payout</p>
                </div>

                <div>
                  <p className="text-white font-semibold text-xs mb-2">Payouts</p>
                  <div className="space-y-0">
                    {[
                      { label: "Payout", date: "9 May 2024", amt: "P16.35", fees: "Fees: P0.35" },
                      { label: "Instant Payout", date: "8 May 2024", amt: "-P12.45", fees: "Fees: P17.25" },
                      { label: "Instant Payout", date: "8 May 2024", amt: "-P12.45", fees: "Fees: P17.25" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <div>
                          <p className="text-white text-[10px] font-medium">{row.label}</p>
                          <p className="text-white/35 text-[9px]">{row.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-[10px] font-semibold">{row.amt}</p>
                          <p className="text-white/35 text-[9px]">{row.fees}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating trust badge */}
            <div className="absolute bottom-4 left-0 md:-left-6 bg-[#0d1526] border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl z-30">
              <div className="flex -space-x-2">
                {["#1e6ff5", "#10b981", "#f59e0b"].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#0d1526]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-base leading-none">152,78k+</p>
                <p className="text-white/45 text-xs mt-0.5">Trusted Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="benefits" className="px-5 md:px-16 lg:px-24 py-20 bg-[#070d1a]">
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
      <section className="px-5 md:px-16 lg:px-24 py-20 bg-[#050a14]">
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
      <section className="px-5 md:px-16 lg:px-24 py-20 bg-[#070d1a]">
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
      <footer className="bg-[#050a14] text-white py-16 px-5 md:px-16 lg:px-24 border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <img src="/pata-icon.png" alt="Pata" className="h-6 w-6" />
                <span className="font-bold text-sm">PATA</span>
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
