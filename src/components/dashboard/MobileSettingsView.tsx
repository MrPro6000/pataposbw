import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Store, 
  CreditCard, 
  Percent, 
  Receipt, 
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Palette,
  LayoutGrid
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSettingsSheet from "./MobileSettingsSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import PataLogo from "@/components/PataLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MobileSettingsViewProps {
  profile: { full_name: string | null; business_name: string | null; email?: string | null; phone?: string | null; avatar_url?: string | null } | null;
  userEmail?: string;
  userId?: string;
  onProfileUpdated?: () => void;
}

type SettingsSection = "business" | "store" | "payments" | "tax" | "receipts" | "notifications" | "support" | "theme" | "dashboard";

const MobileSettingsView = ({ profile, userEmail, userId, onProfileUpdated }: MobileSettingsViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SettingsSection>("business");
  const [sectionTitle, setSectionTitle] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  const handleOpenSettings = (section: SettingsSection, title: string) => {
    setSelectedSection(section);
    setSectionTitle(title);
    setSettingsSheetOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const settingsGroups = [
    {
      title: "Business",
      items: [
        { id: "business" as const, label: "Business Profile", icon: Building2, description: "Company details and registration" },
        { id: "store" as const, label: "Store Details", icon: Store, description: "Operating hours and location" },
      ]
    },
    {
      title: "Payments",
      items: [
        { id: "payments" as const, label: "Payment Methods", icon: CreditCard, description: "Card, mobile money, wallet" },
        { id: "tax" as const, label: "Tax / VAT", icon: Percent, description: "VAT settings and number" },
        { id: "receipts" as const, label: "Receipts", icon: Receipt, description: "Receipt customization" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { id: "dashboard" as const, label: "Dashboard", icon: LayoutGrid, description: "Choose what features to show" },
        { id: "theme" as const, label: "Appearance", icon: Palette, description: "Theme and colors" },
        { id: "notifications" as const, label: "Notifications", icon: Bell, description: "Alerts and summaries" },
        { id: "support" as const, label: "Help & Support", icon: HelpCircle, description: "FAQs and contact" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground"
          >
            {personalInitials}
          </button>
        </div>
      </header>

      {/* Settings Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">{userEmail}</p>
      </div>

      {/* Settings Groups */}
      <div className="px-5 space-y-4">
        {settingsGroups.map((group) => (
          <div key={group.title} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {group.title}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {group.items.map((item) => (
                <button 
                  key={item.label}
                  onClick={() => handleOpenSettings(item.id, item.label)}
                  className="w-full flex items-center justify-between px-4 py-4 active:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted border border-border rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full bg-card border border-border rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-red-500/10 transition-colors"
        >
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-medium text-red-500">Log Out</span>
        </button>
      </div>

      {/* Settings Sheet */}
      <MobileSettingsSheet
        open={settingsSheetOpen}
        onClose={() => setSettingsSheetOpen(false)}
        section={selectedSection}
        title={sectionTitle}
        profile={profile}
        userId={userId}
        onProfileUpdated={onProfileUpdated}
      />

      {/* Profile Sheet */}
      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        userEmail={userEmail}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileSettingsView;
