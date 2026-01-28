import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background px-10 md:px-20 py-4 flex items-center justify-between">
      <a 
        href="#" 
        className="flex items-center gap-1.5 yoco-link"
      >
        System status
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
      <div className="flex items-center gap-6">
        <a href="#" className="yoco-link">Help</a>
        <a href="#" className="yoco-link">Privacy</a>
        <a href="#" className="yoco-link">Terms</a>
      </div>
    </footer>
  );
};

export default Footer;
