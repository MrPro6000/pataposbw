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
    { id: "1", name: "Thato Molefe", role: "Supervisor", email: "thato@pata.co.bw", status: "active" },
    { id: "2", name: "Maipelego Kgosi", role: "Manager", email: "maipelego@pata.co.bw", status: "active" },
    { id: "3", name: "Magadi Seretse", role: "Administrator", email: "magadi@pata.co.bw", status: "active" },
    { id: "4", name: "Theo Mothibi", role: "Supervisor", email: "theo@pata.co.bw", status: "active" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "Manager": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Supervisor": return "bg-green-500/10 text-green-600 dark:text-green-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <button className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Staff Summary */}
      <div className="px-5 py-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Team members</p>
              <p className="text-2xl font-bold text-foreground">{staffMembers.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">Team</h2>
        <div className="space-y-3">
          {staffMembers.map((member) => (
            <div key={member.id} className="bg-card rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <button className="p-2">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  <Shield className="w-3 h-3 inline mr-1" />
                  {member.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Staff Card */}
        <button className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add Team Member</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileStaffView;
