import { Link } from "react-router-dom";
import { ChevronRight, CreditCard } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";

interface MobileManageViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileManageView = ({ profile, userEmail }: MobileManageViewProps) => {
  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

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

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link 
            to="/dashboard/settings"
            className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-sm font-bold text-white"
          >
            {initials}
          </Link>
          <Link 
            to="/dashboard/settings"
            className="px-3 py-1.5 bg-[#F5F5F5] rounded-full"
          >
            <span className="text-sm font-medium text-[#141414]">
              {profile?.business_name || "One Guy Can"}
            </span>
          </Link>
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

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileManageView;
