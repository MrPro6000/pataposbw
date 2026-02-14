import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Shield, 
  Ban, 
  DollarSign,
  MoreVertical,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  suspension_reason: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "frozen">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newLimit, setNewLimit] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendAction, setSuspendAction] = useState<"suspended" | "frozen">("suspended");
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

  const handleActivate = async (user: User) => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ account_status: "active", suspension_reason: null } as any)
        .eq("id", user.id);

      if (error) throw error;
      toast({ title: "Account Activated", description: `${user.email} is now active` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleSuspendOrFreeze = async () => {
    if (!selectedUser || !suspendReason.trim()) {
      toast({ title: "Error", description: "Please provide a reason", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ account_status: suspendAction, suspension_reason: suspendReason.trim() } as any)
        .eq("id", selectedUser.id);

      if (error) throw error;
      toast({
        title: suspendAction === "suspended" ? "Account Suspended" : "Account Frozen",
        description: `${selectedUser.email} has been ${suspendAction}`,
      });
      setShowSuspendDialog(false);
      setSuspendReason("");
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ user_id: selectedUser.user_id }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete user");

      toast({ title: "Account Deleted", description: `${selectedUser.email} has been permanently removed` });
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      toast({ title: "Limit Updated", description: `Transaction limit set to P ${parseFloat(newLimit).toLocaleString()}` });
      setShowLimitDialog(false);
      setSelectedUser(null);
      setNewLimit("");
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
                  <td colSpan={6} className="py-12 text-center text-white/40">Loading...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">No users found</td>
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
                    <td className="py-4 px-6">
                      <div>
                        {getStatusBadge(user.account_status)}
                        {user.suspension_reason && user.account_status !== "active" && (
                          <p className="text-white/30 text-xs mt-1 max-w-[200px] truncate" title={user.suspension_reason}>
                            {user.suspension_reason}
                          </p>
                        )}
                      </div>
                    </td>
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
                              onClick={() => handleActivate(user)}
                              className="text-green-500 hover:bg-white/10"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {user.account_status !== "suspended" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user);
                                setSuspendAction("suspended");
                                setSuspendReason("");
                                setShowSuspendDialog(true);
                              }}
                              className="text-yellow-500 hover:bg-white/10"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {user.account_status !== "frozen" && (
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user);
                                setSuspendAction("frozen");
                                setSuspendReason("");
                                setShowSuspendDialog(true);
                              }}
                              className="text-red-500 hover:bg-white/10"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Freeze
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
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
            <Button variant="outline" onClick={() => setShowLimitDialog(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleUpdateLimit} disabled={processing || !newLimit} className="bg-red-500 hover:bg-red-600 text-white">
              {processing ? "Updating..." : "Update Limit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Freeze Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${suspendAction === "frozen" ? "text-red-500" : "text-yellow-500"}`} />
              {suspendAction === "frozen" ? "Freeze Account" : "Suspend Account"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {suspendAction === "frozen" 
                ? `This will freeze ${selectedUser?.email}'s account. They will not be able to access the platform.`
                : `This will suspend ${selectedUser?.email}'s account. They will see a warning when they try to log in.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-white">Reason (shown to the user) *</Label>
            <Textarea
              placeholder="e.g., Suspicious activity detected, Pending document verification..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleSuspendOrFreeze}
              disabled={processing || !suspendReason.trim()}
              className={suspendAction === "frozen" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-black"}
            >
              {processing ? "Processing..." : suspendAction === "frozen" ? "Freeze Account" : "Suspend Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <Trash2 className="w-5 h-5" />
              Delete Account Permanently
            </DialogTitle>
            <DialogDescription className="text-white/60">
              This will permanently delete <strong className="text-white">{selectedUser?.email}</strong> and all their data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">
              ⚠️ All user data including transactions, KYC submissions, support tickets, and profile information will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {processing ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
