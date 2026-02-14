import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  MessageSquare, 
  HelpCircle, 
  Phone, 
  Mail,
  ChevronRight,
  FileText,
  Video
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";
import SupportChatPanel from "./SupportChatPanel";

interface MobileSupportViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileSupportView = ({ profile, userEmail }: MobileSupportViewProps) => {
  const [showLiveChat, setShowLiveChat] = useState(false);

  const helpTopics = [
    { title: "Getting Started", description: "Setup guides and tutorials", icon: Video },
    { title: "Payments", description: "Card, mobile money, online payments", icon: FileText },
    { title: "Devices", description: "Terminal setup and troubleshooting", icon: FileText },
    { title: "Account & Billing", description: "Pricing, invoices, subscription", icon: FileText },
  ];

  const contactOptions = [
    { label: "Live Chat", description: "Chat with our team", icon: MessageSquare, action: "chat" },
    { label: "Call Us", description: "+267 300 1234", icon: Phone, action: "call" },
    { label: "Email", description: "support@pata.co.bw", icon: Mail, action: "email" },
  ];

  const handleContact = (action: string) => {
    if (action === "chat") setShowLiveChat(true);
    else if (action === "call") window.location.href = "tel:+2673001234";
    else if (action === "email") window.location.href = "mailto:support@pata.co.bw";
  };

  if (showLiveChat) {
    return (
      <div className="min-h-screen bg-muted flex flex-col">
        <SupportChatPanel onClose={() => setShowLiveChat(false)} className="flex-1 rounded-none border-0" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <div className="w-10" />
        </div>
      </header>

      {/* Support Hero */}
      <div className="px-5 py-6">
        <div className="bg-primary rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-primary-foreground/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-primary-foreground mb-1">How can we help?</h2>
          <p className="text-primary-foreground/80 text-sm">We're here to support you 24/7</p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="px-5 mb-6">
        <h2 className="text-sm text-muted-foreground mb-3">Contact us</h2>
        <div className="grid grid-cols-3 gap-3">
          {contactOptions.map((option) => (
            <button 
              key={option.label}
              onClick={() => handleContact(option.action)}
              className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-98 transition-transform border border-border"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <option.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Help Topics */}
      <div className="px-5 mb-6">
        <h2 className="text-sm text-muted-foreground mb-3">Help topics</h2>
        <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border">
          {helpTopics.map((topic) => (
            <button 
              key={topic.title}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                  <topic.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
            </button>
          ))}
        </div>
      </div>

      {/* Open Tickets */}
      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">Your tickets</h2>
        <div className="bg-card rounded-2xl p-5 text-center border border-border">
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm">No open tickets</p>
          <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-sm">
            Create Ticket
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileSupportView;
