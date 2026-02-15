import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  UserPlus,
  Shield,
  Code,
  Briefcase,
  HeadphonesIcon,
  DollarSign,
  X,
  Crown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMember {
  user_id: string;
  role: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

const TEAM_ROLES = [
  { value: "admin", label: "Admin", icon: Crown, color: "text-red-500", bg: "bg-red-500/20" },
  { value: "cto", label: "CTO", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/20" },
  { value: "developer", label: "Developer", icon: Code, color: "text-blue-500", bg: "bg-blue-500/20" },
  { value: "support", label: "Support", icon: HeadphonesIcon, color: "text-green-500", bg: "bg-green-500/20" },
  { value: "finance", label: "Finance", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/20" },
];

const AdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [allUsers, setAllUsers] = useState<{ user_id: string; email: string; full_name: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeam();
    fetchUsers();
  }, []);

  const fetchTeam = async () => {
    try {
      // Get all non-'user' roles with profile info
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at")
        .neq("role", "user");

      if (error) throw error;

      // Get profiles for these users
      const userIds = (roles || []).map((r) => r.user_id);
      if (userIds.length === 0) {
        setTeamMembers([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      const members: TeamMember[] = (roles || []).map((r) => ({
        user_id: r.user_id,
        role: r.role,
        email: profileMap.get(r.user_id)?.email || "Unknown",
        full_name: profileMap.get(r.user_id)?.full_name || null,
        created_at: r.created_at || "",
      }));

      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast({ title: "Error", description: "Please select a user and role", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      // Check if user already has this role
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedUserId)
        .eq("role", selectedRole as any);

      if (existing && existing.length > 0) {
        toast({ title: "Already assigned", description: "This user already has this role", variant: "destructive" });
        setProcessing(false);
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUserId, role: selectedRole as any });

      if (error) throw error;

      toast({ title: "Role Assigned", description: `Successfully assigned ${selectedRole} role` });
      setShowAddDialog(false);
      setSelectedUserId("");
      setSelectedRole("");
      fetchTeam();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!memberToRemove) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", memberToRemove.user_id)
        .eq("role", memberToRemove.role as any);

      if (error) throw error;

      toast({ title: "Role Removed", description: `Removed ${memberToRemove.role} role from ${memberToRemove.email}` });
      setShowRemoveDialog(false);
      setMemberToRemove(null);
      fetchTeam();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const getRoleInfo = (role: string) => {
    return TEAM_ROLES.find((r) => r.value === role) || TEAM_ROLES[0];
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = allUsers.filter(
    (u) =>
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-white/60">Assign roles and manage your team's access</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {TEAM_ROLES.map((role) => (
          <div key={role.value} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${role.bg}`}>
            <role.icon className={`w-4 h-4 ${role.color}`} />
            <span className={`text-sm font-medium ${role.color}`}>{role.label}</span>
          </div>
        ))}
      </div>

      {/* Team Table */}
      <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Member</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Role</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Assigned</th>
                <th className="text-right py-4 px-6 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-white/40">Loading...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-white/40">No team members found</td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => {
                  const roleInfo = getRoleInfo(member.role);
                  return (
                    <tr key={`${member.user_id}-${member.role}-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{member.full_name || "No name"}</p>
                          <p className="text-white/40 text-sm">{member.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${roleInfo.bg}`}>
                          <roleInfo.icon className={`w-3.5 h-3.5 ${roleInfo.color}`} />
                          <span className={`text-sm font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/60 text-sm">
                        {member.created_at ? new Date(member.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setMemberToRemove(member); setShowRemoveDialog(true); }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription className="text-white/60">
              Assign a role to a registered user. They must have signed up on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/60 mb-2 block">Search User</label>
              <Input
                placeholder="Search by email or name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40"
              />
              {userSearch && (
                <div className="mt-2 max-h-40 overflow-y-auto bg-[#0f0f0f] rounded-lg border border-white/10">
                  {filteredUsers.slice(0, 10).map((u) => (
                    <button
                      key={u.user_id}
                      onClick={() => { setSelectedUserId(u.user_id); setUserSearch(u.email || ""); }}
                      className={`w-full text-left px-3 py-2 hover:bg-white/10 text-sm ${
                        selectedUserId === u.user_id ? "bg-white/10 text-white" : "text-white/60"
                      }`}
                    >
                      <p className="text-white">{u.full_name || "No name"}</p>
                      <p className="text-white/40 text-xs">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-white/60 mb-2 block">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {TEAM_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <role.icon className={`w-4 h-4 ${role.color}`} />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-white/60">
                  {selectedRole === "admin" && "Full access to all admin features and settings."}
                  {selectedRole === "cto" && "Can view Dashboard, Analytics, Users, and all technical sections."}
                  {selectedRole === "developer" && "Can view Dashboard, Analytics, and technical monitoring."}
                  {selectedRole === "support" && "Can view Support Tickets, Live Chats, Users, and KYC."}
                  {selectedRole === "finance" && "Can view Dashboard, Analytics, Transactions, and AML monitoring."}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={processing || !selectedUserId || !selectedRole}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {processing ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Role Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500">Remove Role</DialogTitle>
            <DialogDescription className="text-white/60">
              Remove the <strong className="text-white">{memberToRemove?.role}</strong> role from{" "}
              <strong className="text-white">{memberToRemove?.email}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleRemoveRole} disabled={processing} className="bg-red-600 hover:bg-red-700 text-white">
              {processing ? "Removing..." : "Remove Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTeam;
