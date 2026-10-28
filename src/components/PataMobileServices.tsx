import { Smartphone } from "lucide-react";
import { pataMobileServices } from "@/data/softwareServices";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function ServiceCard({ service, index }: { service: (typeof pataMobileServices)[number]; index: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <article
      ref={ref}
      className={`group relative h-full rounded-lg border border-border bg-card p-6 transition-all duration-500 motion-reduce:transition-none hover:border-primary/40 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0"}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
          <service.icon className="pata-mobile-icon h-5 w-5 text-primary" />
        </span>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">0{index + 1}</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{service.name}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
    </article>
  );
}

export default function PataMobileServices() {
  return (
    <section id="pata-mobile" aria-labelledby="pata-mobile-heading" className="scroll-mt-28 border-t border-border bg-secondary px-5 py-12 md:px-20 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Software products · Pata Mobile</p>
            <h2 id="pata-mobile-heading" className="mb-4 text-3xl font-bold text-foreground md:text-4xl">What is included in Pata Mobile</h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              A separate system in the Pata family for invoices, reports, digital receipts and bulk distribution. Explore its seven services below.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-5 w-5 text-primary" />
            Separate system, same Pata family
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {pataMobileServices.map((service, index) => <ServiceCard key={service.name} service={service} index={index} />)}
        </div>
      </div>
    </section>
  );
}