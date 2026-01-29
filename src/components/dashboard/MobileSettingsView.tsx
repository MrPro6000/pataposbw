import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Building2, 
  Store, 
  CreditCard, 
  Percent, 
  Receipt, 
  Bell,
  HelpCircle,
  LogOut
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";

interface MobileSettingsViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileSettingsView = ({ profile, userEmail }: MobileSettingsViewProps) => {
  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const settingsGroups = [
    {
      title: "Business",
      items: [
        { label: "Business Profile", icon: Building2, description: "Company details and registration" },
        { label: "Store Details", icon: Store, description: "Operating hours and location" },
      ]
    },
    {
      title: "Payments",
      items: [
        { label: "Payment Methods", icon: CreditCard, description: "Card, mobile money, wallet" },
        { label: "Tax / VAT", icon: Percent, description: "VAT settings and number" },
        { label: "Receipts", icon: Receipt, description: "Receipt customization" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { label: "Notifications", icon: Bell, description: "Alerts and summaries" },
        { label: "Help & Support", icon: HelpCircle, description: "FAQs and contact" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white">
            {initials}
          </div>
          <div className="px-3 py-1.5 bg-[#F5F5F5] rounded-full">
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "One Guy Can"}
            </span>
          </div>
        </div>
      </header>

      {/* Settings Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-[#141414]">Settings</h1>
        <p className="text-sm text-[#141414]/60">{userEmail}</p>
      </div>

      {/* Settings Groups */}
      <div className="px-5 space-y-4">
        {settingsGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E8E8E8]">
              <h2 className="text-sm font-semibold text-[#141414]/60 uppercase tracking-wide">
                {group.title}
              </h2>
            </div>
            <div className="divide-y divide-[#E8E8E8]">
              {group.items.map((item) => (
                <button 
                  key={item.label}
                  className="w-full flex items-center justify-between px-4 py-4 active:bg-[#F5F5F5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#141414]/60" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-[#141414]">{item.label}</p>
                      <p className="text-xs text-[#141414]/50">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#141414]/30" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-red-50 transition-colors">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-medium text-red-500">Log Out</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileSettingsView;
