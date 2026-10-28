import { Link } from "react-router-dom";
import { ArrowRight, Smartphone } from "lucide-react";
import { pataMobileServices } from "@/data/softwareServices";
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

const total = pataMobileServices.length;

function ServiceCard({ service, index }: { service: (typeof pataMobileServices)[number]; index: number }) {
  const isOddLast = index === total - 1 && total % 2 === 1;
  return (
    <AnimatedSection delay={0.12 * index} className={isOddLast ? "sm:col-span-2" : ""}>
      <div
        className={`group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 ${
          isOddLast ? "sm:flex sm:flex-col sm:items-center sm:text-center" : ""
        }`}
      >
        <span aria-hidden className="absolute right-5 top-5 text-xs font-semibold tabular-nums text-muted-foreground">
          0{index + 1}
        </span>
        <div className="relative mb-5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 transition-colors duration-300 group-hover:bg-primary/25">
          <span aria-hidden className="pata-mobile-ring" />
          <service.icon
            aria-hidden
            className="pata-mobile-icon relative w-5 h-5 text-primary"
            style={{ animationDelay: `${index * 0.5}s` }}
          />
        </div>
        <div className={`relative ${isOddLast ? "max-w-2xl" : ""}`}>
          <h3 className="mb-2 text-lg font-semibold text-foreground">{service.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
        </div>

        <span aria-hidden className="pata-mobile-rule" />
      </div>
    </AnimatedSection>
  );
}

type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
};

export default function PataMobileServices({
  eyebrow = "Software products · Pata Mobile",
  title = "What is included in Pata Mobile",
  intro = "A separate system in the Pata family for invoices, reports, digital receipts and bulk distribution. Explore its seven services below.",
  ctaLabel,
  ctaTo = "/software-products",
}: Props) {
  return (
    <section
      id="pata-mobile"
      aria-labelledby="pata-mobile-heading"
      className="scroll-mt-28 border-t border-border bg-background px-5 py-12 md:px-20 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="pata-mobile-panel relative overflow-hidden rounded-3xl border border-border p-6 md:p-10">
          <span aria-hidden className="pata-mobile-glow" />
          <AnimatedSection>
            <div className="relative mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm font-semibold text-primary">{eyebrow}</p>
                <h2 id="pata-mobile-heading" className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  {title}
                </h2>
                <p className="max-w-2xl leading-relaxed text-muted-foreground">{intro}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground md:self-auto">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                Separate system, same Pata family
              </span>
            </div>
          </AnimatedSection>

          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {pataMobileServices.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} />
            ))}
          </div>

          {ctaLabel && (
            <AnimatedSection delay={0.2} className="relative mt-10">
              <Link
                to={ctaTo}
                className="pata-btn-outline-light dark:pata-btn-outline-dark inline-flex items-center gap-2"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}
