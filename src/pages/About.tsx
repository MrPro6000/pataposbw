import { Link } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";
import kirbyAsset from "@/assets/team/kirby.jpg.asset.json";
import mildredAsset from "@/assets/team/mildred.jpg.asset.json";

const team = [
  {
    name: "Kirby",
    role: "Executive Director",
    image: kirbyAsset.url,
    bio: "Kirby leads Pata's day-to-day execution — from merchant operations and terminal rollouts to partnerships with banks and mobile money providers across Botswana. He keeps the business grounded in what merchants actually need: fast settlement, honest pricing and hardware that works in a spaza shop as well as it does in a restaurant.",
    phone: "+267 73 495 519",
    email: "info@pata.com",
  },
  {
    name: "Mildred",
    role: "Marketing Director",
    image: mildredAsset.url,
    bio: "Mildred shapes how Botswana meets Pata. She builds the brand, the campaigns and the merchant community around it — translating a payments platform into a story small business owners recognise as their own. Her focus is simple: every trader, from Gaborone to Maun, should know there is a local way to get paid.",
    email: "sales@pata.com",
  },
  {
    name: "Shaun Motsumi",
    role: "CEO",
    bio: "Sets Pata's long-term vision — building financial infrastructure that keeps value inside Botswana. Oversees strategy, capital and the company's expansion across the region.",
    email: "info@pata.com",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainNav />

      <main>
        <section className="px-5 md:px-20 pt-16 pb-12 max-w-5xl">
          <p className="text-sm font-medium text-primary mb-4">About us</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Built in Botswana, for Botswana business
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Pata is a Botswana payments and fintech company giving merchants everything they
            need to get paid — smart terminals, an online payment gateway, mobile money,
            invoicing and growth capital, all in one place. We build locally because we
            understand locally: pula pricing, +267 numbers, Orange Money, MyZaka, Smega and
            POSO Money, and the realities of trading here.
          </p>
        </section>

        <section className="px-5 md:px-20 py-12 border-t border-border">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            <div>
              <h2 className="text-xl font-semibold mb-2">Our mission</h2>
              <p className="text-sm text-muted-foreground">
                Make accepting payments simple and affordable for every business, from the
                street vendor to the national retailer.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">What we build</h2>
              <p className="text-sm text-muted-foreground">
                Payment terminals, a payment gateway, wallets, payouts, invoicing and
                short-term business capital — designed to work together.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Why it matters</h2>
              <p className="text-sm text-muted-foreground">
                Every transaction processed at home keeps value, data and jobs in Botswana.
                That is the whole point.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-20 py-16 border-t border-border">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Leadership</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            The people behind Pata.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role} at Pata`}
                    loading="lazy"
                    className="w-full h-72 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-72 bg-muted flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{member.bio}</p>
                  <div className="pt-2 border-t border-border flex flex-col gap-2">
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </a>
                    )}
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-20 py-16 border-t border-border">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            General enquiries: <a className="text-primary" href="mailto:info@pata.com">info@pata.com</a>{" "}
            · Sales: <a className="text-primary" href="mailto:sales@pata.com">sales@pata.com</a>
          </p>
          <Link to="/signup" className="pata-btn-outline-light dark:pata-btn-outline-dark inline-flex items-center">
            Get started
          </Link>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default About;
