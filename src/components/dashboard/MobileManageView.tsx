import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Store, 
  Percent, 
  Receipt, 
  Bell, 
  HelpCircle,
  LogOut,
  Users,
  Smartphone
} from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSettingsSheet from "./MobileSettingsSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MobileManageViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

type SettingsSection = "business" | "store" | "payments" | "tax" | "receipts" | "notifications" | "support" | "devices" | "customers";

const MobileManageView = ({ profile, userEmail }: MobileManageViewProps) => {
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

  // Mock stock data
  const stockData = [
    { label: "Out of stock", count: 0, color: "text-red-500" },
    { label: "Low stock", count: 0, color: "text-orange-500" },
    { label: "In stock", count: 1, color: "text-green-500" },
  ];

  // Mock staff data
  const staffMembers = [
    { name: "Nic HTEST", role: "Supervisor" },
    { name: "Nic Haralambous", role: "Manager" },
    { name: "Nicholas Haralambous", role: "Administrator" },
  ];

  // Settings items
  const settingsItems = [
    { id: "business" as const, label: "Business Profile", description: "Company details", icon: Building2 },
    { id: "store" as const, label: "Store Details", description: "Hours & location", icon: Store },
    { id: "payments" as const, label: "Payment Methods", description: "Card, mobile, cash", icon: CreditCard },
    { id: "tax" as const, label: "Tax / VAT", description: "VAT settings", icon: Percent },
    { id: "receipts" as const, label: "Receipts", description: "Customization", icon: Receipt },
    { id: "notifications" as const, label: "Notifications", description: "Alerts & summaries", icon: Bell },
    { id: "support" as const, label: "Help & Support", description: "FAQs & contact", icon: HelpCircle },
    { id: "devices" as const, label: "Devices", description: "Card machines & POS", icon: Smartphone },
    { id: "customers" as const, label: "Customers", description: "Customer database", icon: Users },
  ];

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

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white"
          >
            {personalInitials}
          </button>
          <button 
            onClick={() => handleOpenSettings("business", "Business Profile")}
            className="px-3 py-1.5 bg-[#F5F5F5] rounded-full"
          >
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "One Guy Can"}
            </span>
          </button>
        </div>
      </header>

      {/* Manage Title */}
      <div className="px-5 py-4">
        <h1 className="text-2xl font-bold text-[#141414]">Manage</h1>
      </div>

      {/* Stock & Products Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Stock Card */}
          <Link to="/dashboard/products" className="bg-white rounded-2xl p-4 active:scale-98 transition-transform">
            <p className="font-semibold text-[#141414] mb-3">Stock</p>
            <div className="space-y-2">
              {stockData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm ${item.color}`}>{item.label}</span>
                  <span className="text-sm font-medium text-[#141414]">{item.count}</span>
                </div>
              ))}
            </div>
          </Link>
          
          {/* Products Card */}
          <Link to="/dashboard/products" className="bg-white rounded-2xl p-4 active:scale-98 transition-transform">
            <p className="font-semibold text-[#141414] mb-2">Products</p>
            <p className="text-4xl font-bold text-[#141414]">7</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-[#141414]/60">Categories</span>
              <span className="text-sm font-medium text-[#141414]">3</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Staff Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/staff" className="block bg-white rounded-2xl overflow-hidden active:scale-98 transition-transform">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
            <h2 className="font-semibold text-[#141414]">Staff</h2>
            <ChevronRight className="w-5 h-5 text-[#141414]/40" />
          </div>
          
          <div className="divide-y divide-[#E8E8E8]">
            {staffMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <p className="font-medium text-[#141414]">{member.name}</p>
                <p className="text-sm text-[#141414]/60">{member.role}</p>
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* Card Machines Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/devices" className="block bg-white rounded-2xl p-5 active:scale-98 transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00C8E6]/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#00C8E6]" />
              </div>
              <div>
                <p className="font-semibold text-[#141414]">Card machines</p>
                <p className="text-sm text-green-500">1 active</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#141414]/40" />
          </div>
        </Link>
      </div>

      {/* Settings Section */}
      <div className="px-5 py-2">
        <h2 className="text-sm text-[#141414]/60 mb-3">Settings</h2>
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-[#E8E8E8]">
          {settingsItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleOpenSettings(item.id, item.label)}
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

      {/* Logout Button */}
      <div className="px-5 py-2">
        <button 
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 active:bg-red-50 transition-colors"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
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

export default MobileManageView;
