import PataLogo from "./PataLogo";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface MainFooterProps {
  theme?: "dark" | "light";
}

const MainFooter = ({ theme: propTheme }: MainFooterProps) => {
  const { theme: contextTheme } = useTheme();
  const isDark = propTheme ? propTheme === "dark" : contextTheme === "dark";

  const footerLinks = {
    Products: [
      "Card Machines",
      "Point of Sale",
      "Online Payments",
      "Pata Capital",
      "Pata App",
      "Product Finder",
    ],
    "Business Type": [
      "Retail",
      "Food & Beverage",
      "Services",
      "Health & Beauty",
      "E-commerce",
    ],
    Resources: [
      "Pricing",
      "Blog",
      "Help Centre",
      "Developer Docs",
      "System Status",
    ],
    Company: [
      "About Us",
      "Careers",
      "Press",
      "Contact Us",
    ],
  };

  return (
    <footer className="bg-background text-foreground py-16 px-6 md:px-20 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <PataLogo className="h-5 mb-6" />
            <p className="text-sm text-muted-foreground mb-6">
              Empowering African businesses with seamless payments, smart terminals, and growth capital. Built in Botswana, serving the continent.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Pata Technologies (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
