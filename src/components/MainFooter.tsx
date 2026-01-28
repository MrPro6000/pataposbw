import YocoLogo from "./YocoLogo";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

interface MainFooterProps {
  theme?: "dark" | "light";
}

const MainFooter = ({ theme = "dark" }: MainFooterProps) => {
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#141414]" : "bg-[#E8F4F8]";
  const textClass = isDark ? "text-white" : "text-[#141414]";
  const mutedClass = isDark ? "text-white/60" : "text-[#141414]/60";

  const footerLinks = {
    Products: [
      "Card Machines",
      "Point of Sale",
      "Online Payments",
      "Yoco Capital",
      "Yoco App",
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
    <footer className={`${bgClass} ${textClass} py-16 px-6 md:px-20`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <YocoLogo className="h-5 mb-6" />
            <p className={`text-sm ${mutedClass} mb-6`}>
              Market leader in card machines, online payments, point of sale solutions and flexible business funding.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className={`${mutedClass} hover:${textClass} transition-colors`}>
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className={`${mutedClass} hover:${textClass} transition-colors`}>
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className={`${mutedClass} hover:${textClass} transition-colors`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`${mutedClass} hover:${textClass} transition-colors`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`${mutedClass} hover:${textClass} transition-colors`}>
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
                    <a href="#" className={`text-sm ${mutedClass} hover:${textClass} transition-colors`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t ${isDark ? 'border-white/10' : 'border-[#141414]/10'} pt-8 flex flex-col md:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm ${mutedClass}`}>
            © 2024 Yoco Technologies (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className={`text-sm ${mutedClass} hover:${textClass} transition-colors`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-sm ${mutedClass} hover:${textClass} transition-colors`}>
              Terms of Service
            </a>
            <a href="#" className={`text-sm ${mutedClass} hover:${textClass} transition-colors`}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
