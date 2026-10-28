import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import PataMobileServices from "@/components/PataMobileServices";
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
              Invoices, reports, digital receipts and bulk services. These are the everyday
              tools that hold a business together — and they all live in Pata Mobile, working
              off the same information.
            </p>
            <p className="text-sm text-muted-foreground/80 mt-4">
              Also check the bottom for{" "}
              <a href="#pata-mobile" className="text-primary font-medium hover:underline underline-offset-4">
                Pata Mobile
              </a>
              .
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
                body: "Add your details, connect what you already use, and invite your team.",
              },
              {
                step: "02",
                title: "Work as normal",
                body: "Sell, invoice, send and follow up. Every action writes itself into the record.",
              },
              {
                step: "03",
                title: "Look back and see",
                body: "Reports, receipts and history are already there — no rebuilding a spreadsheet at month end.",
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

      <PataMobileServices
        eyebrow="Software products · Pata Mobile"
        title="What is included"
        intro={
          <>
            Pata Mobile is the system in the Pata family that keeps the everyday software work
            in one place — invoices, reports and digital receipts — and sends things out at
            scale: data, airtime and SIM cards to many people at once. Here is what is included.
          </>
        }
      />

      {/* CTA */}
      <section className="px-5 md:px-20 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Set up your software today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create an account and start using Pata Mobile. Everything above is waiting
              inside the dashboard.
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
