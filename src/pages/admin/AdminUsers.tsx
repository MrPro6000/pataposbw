import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Shield, 
  Ban, 
  DollarSign,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface User {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  account_status: string;
  transaction_limit: number;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "frozen">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [newLimit, setNewLimit] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("account_status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (user: User, newStatus: "active" | "suspended" | "frozen") => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ account_status: newStatus })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `User account is now ${newStatus}`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateLimit = async () => {
    if (!selectedUser || !newLimit) return;
    
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ transaction_limit: parseFloat(newLimit) })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: "Limit Updated",
        description: `Transaction limit set to P ${parseFloat(newLimit).toLocaleString()}`,
      });

      setShowLimitDialog(false);
      setSelectedUser(null);
      setNewLimit("");
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update limit",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.business_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs">Active</span>;
      case "suspended":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Suspended</span>;
      case "frozen":
        return <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">Frozen</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
        <p className="text-white/60">Manage user accounts, limits, and access</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search by email, name, or business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "suspended", "frozen"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === f 
                  ? "bg-red-500 text-white" 
                  : "bg-[#1a1a1a] text-white/60 hover:text-white"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">User</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Business</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Limit</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white/60 text-sm font-medium">Joined</th>
                <th className="text-right py-4 px-6 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{user.full_name || "No name"}</p>
                        <p className="text-white/40 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white/60">{user.business_name || "-"}</td>
                    <td className="py-4 px-6 text-white font-mono">
                      P {user.transaction_limit?.toLocaleString() || "50,000"}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(user.account_status)}</td>
                    <td className="py-4 px-6 text-white/60 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setNewLimit(user.transaction_limit?.toString() || "50000");
                              setShowLimitDialog(true);
                            }}
                            className="text-white hover:bg-white/10"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Set Limit
                          </DropdownMenuItem>
                          {user.account_status !== "active" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user, "active")}
                              className="text-green-500 hover:bg-white/10"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {user.account_status !== "suspended" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user, "suspended")}
                              className="text-yellow-500 hover:bg-white/10"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {user.account_status !== "frozen" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user, "frozen")}
                              className="text-red-500 hover:bg-white/10"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Freeze
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limit Dialog */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Set Transaction Limit</DialogTitle>
            <DialogDescription className="text-white/60">
              Set the maximum transaction amount for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">P</span>
            <Input
              type="number"
              placeholder="50000"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="pl-8 bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLimitDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLimit}
              disabled={processing || !newLimit}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {processing ? "Updating..." : "Update Limit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
