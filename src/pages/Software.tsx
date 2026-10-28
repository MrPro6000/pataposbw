import { ArrowRight } from "lucide-react";
import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import PataMobileServices from "@/components/PataMobileServices";
import { Button } from "@/components/ui/button";
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
              Pata Mobile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Invoices, reports, digital receipts and bulk services — together in Pata Mobile, a separate system in the Pata family.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <PataMobileServices />

      {/* CTA */}
      <section className="px-5 md:px-20 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find out more about Pata Mobile
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Talk to our team about Pata Mobile and the services your business needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <ContactSalesDialog>
                <Button size="lg">
                  Talk to us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </ContactSalesDialog>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <MainFooter />
    </div>
  );
};

export default Software;
