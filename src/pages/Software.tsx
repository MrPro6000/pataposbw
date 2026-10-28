import { Link } from "react-router-dom";
import { ArrowRight, Check, Smartphone } from "lucide-react";
import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import { softwareServices, pataMobileServices } from "@/data/softwareServices";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const connections = [
  "Bank accounts",
  "Mobile money wallets",
  "Card terminals",
  "Online store & WhatsApp",
  "Supplier accounts",
  "Team member logins",
];

const Software = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <MainNav />

      {/* Hero */}
      <section className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-4">
              Software products
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 max-w-3xl">
              The simple software that
              <br />
              <span className="pata-hero-gradient">makes it one system</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Catalogue, invoices, records, connected accounts, stock, staff and reports.
              These are the everyday tools that hold a business together — and they are all
              part of Pata, working off the same information.
            </p>
            <p className="text-sm text-muted-foreground/80 mt-4">
              Also check the bottom for{" "}
              <a href="#pata-mobile" className="text-primary font-medium hover:underline underline-offset-4">Pata Mobile</a>.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* How the pieces fit */}
      <section className="px-5 md:px-20 py-10 border-y border-border bg-secondary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8">
              One set of records, every part of the business
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                step: "01",
                title: "Set it up once",
                body: "List your products, connect your accounts, add your team and customers.",
              },
              {
                step: "02",
                title: "Work as normal",
                body: "Sell, invoice, buy stock and pay staff. Every action writes itself into the record.",
              },
              {
                step: "03",
                title: "Look back and see",
                body: "Reports, balances and history are already there — no rebuilding a spreadsheet at month end.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={0.1 * i}>
                <div className="bg-card border border-border rounded-2xl p-6 h-full">
                  <span className="text-3xl font-bold text-primary/40">{item.step}</span>
                  <h3 className="font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What is included
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl">
              Nine pieces of software, all included, all sharing the same data.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {softwareServices.map((service, i) => (
              <AnimatedSection key={service.name} delay={0.06 * i}>
                <div className="group bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className="w-11 h-11 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {service.tagline}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Connections */}
      <section className="px-5 md:px-20 py-12 md:py-16 border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Everything connects to everything else
            </h2>
            <p className="text-muted-foreground">
              The reason the software holds together is that the accounts do. Link what you
              already use and the catalogue, records and reports all read from the same place.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="bg-card border border-border rounded-2xl p-6">
              <ul className="grid sm:grid-cols-2 gap-3">
                {connections.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pata Mobile — sister system */}
      <section id="pata-mobile" className="px-5 md:px-20 py-12 md:py-20 border-t border-border scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <div className="pata-mobile-panel relative overflow-hidden rounded-3xl border border-border p-6 md:p-10">
            <span aria-hidden className="pata-mobile-glow" />
            <AnimatedSection>
              <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-3">
                    Another system in the family
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Pata Mobile
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Alongside Patapos there is Pata Mobile — the system built for bulk digital
                    services. Where Patapos keeps the business records, Pata Mobile sends things
                    out at scale: data, airtime, SIM cards and invoices to many people at once.
                    A few of the services it offers:
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground shrink-0">
                  <Smartphone className="w-3.5 h-3.5 text-primary" />
                  Separate system, same Pata family
                </span>
              </div>
            </AnimatedSection>

            <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {pataMobileServices.map((service, i) => (
                <AnimatedSection key={service.name} delay={0.12 * i}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                    <span className="absolute right-5 top-5 text-xs font-semibold tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                    <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-300 group-hover:bg-primary/25">
                      <span aria-hidden className="pata-mobile-ring" />
                      <service.icon
                        className="pata-mobile-icon relative w-5 h-5 text-primary"
                        style={{ animationDelay: `${i * 0.5}s` }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <span aria-hidden className="pata-mobile-rule" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-20 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Set up your software today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create an account, list your products and connect your accounts. Everything
              above is waiting inside the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup" className="pata-btn-cyan inline-flex">
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ContactSalesDialog>
                <button className="pata-btn-outline-light dark:pata-btn-outline-dark inline-flex items-center gap-2">
                  Talk to us
                </button>
              </ContactSalesDialog>
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline px-3 py-3"
              >
                See pricing
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Software;
