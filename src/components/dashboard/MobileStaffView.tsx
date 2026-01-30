import { Link } from "react-router-dom";
import { ChevronLeft, Plus, User, MoreVertical, Shield } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";

interface MobileStaffViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "active" | "inactive";
}

const MobileStaffView = ({ profile, userEmail }: MobileStaffViewProps) => {
  const staffMembers: StaffMember[] = [
    { id: "1", name: "Nic HTEST", role: "Supervisor", email: "nic@example.com", status: "active" },
    { id: "2", name: "Nic Haralambous", role: "Manager", email: "nic.h@example.com", status: "active" },
    { id: "3", name: "Nicholas Haralambous", role: "Administrator", email: "nicholas@example.com", status: "active" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator": return "bg-purple-100 text-purple-600";
      case "Manager": return "bg-blue-100 text-blue-600";
      case "Supervisor": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-[#141414]" />
          </Link>
          <PataLogo className="h-5" />
          <button className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-[#0066FF]" />
          </button>
        </div>
      </header>

      {/* Staff Summary */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#141414]/60">Team members</p>
              <p className="text-2xl font-bold text-[#141414]">{staffMembers.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#0066FF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="px-5">
        <h2 className="text-sm text-[#141414]/60 mb-3">Team</h2>
        <div className="space-y-3">
          {staffMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0066FF] rounded-xl flex items-center justify-center text-white font-bold">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#141414]">{member.name}</h3>
                    <p className="text-sm text-[#141414]/60">{member.email}</p>
                  </div>
                </div>
                <button className="p-2">
                  <MoreVertical className="w-5 h-5 text-[#141414]/40" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  <Shield className="w-3 h-3 inline mr-1" />
                  {member.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Staff Card */}
        <button className="w-full mt-4 border-2 border-dashed border-[#E0E0E0] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-[#0066FF] active:bg-[#0066FF]/5 transition-colors">
          <div className="w-12 h-12 bg-[#F0F0F0] rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-[#141414]/40" />
          </div>
          <span className="text-[#141414]/60 font-medium">Add Team Member</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileStaffView;
