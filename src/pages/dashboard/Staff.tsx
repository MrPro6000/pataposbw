import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  UserPlus, 
  Shield,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  status: "active" | "pending";
  lastActive: string;
}

const initialStaff: StaffMember[] = [
  { id: "STF001", name: "John Owner", email: "john@patabusiness.com", role: "admin", status: "active", lastActive: "Now" },
  { id: "STF002", name: "Sarah Manager", email: "sarah@patabusiness.com", role: "manager", status: "active", lastActive: "2 hours ago" },
  { id: "STF003", name: "Mike Cashier", email: "mike@patabusiness.com", role: "cashier", status: "active", lastActive: "1 day ago" },
  { id: "STF004", name: "Lisa Cashier", email: "lisa@patabusiness.com", role: "cashier", status: "pending", lastActive: "Invited" },
];

const rolePermissions = {
  admin: ["Full access to all features", "Manage staff and permissions", "View and export reports", "Process payments and refunds"],
  manager: ["View reports and analytics", "Manage products and inventory", "Process payments and refunds", "View customer data"],
  cashier: ["Process payments", "View own transactions", "Access POS terminal"],
};

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier" as "admin" | "manager" | "cashier",
  });
  const isMobile = useIsMobile();

  // Show mobile view on mobile devices
  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-700";
      case "manager": return "bg-blue-100 text-blue-700";
      case "cashier": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleOpenAddModal = () => {
    setFormData({ name: "", email: "", role: "cashier" });
    setEditingMember(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (member: StaffMember) => {
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
    });
    setEditingMember(member);
    setIsAddModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    if (editingMember) {
      setStaff(staff.map(s => 
        s.id === editingMember.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newMember: StaffMember = {
        id: `STF${String(staff.length + 1).padStart(3, '0')}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "pending",
        lastActive: "Invited",
      };
      setStaff([...staff, newMember]);
    }
    setIsAddModalOpen(false);
  };

  const handleRemove = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Staff</h1>
          <p className="text-[#141414]/60">Manage team members and permissions</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Staff
        </Button>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl overflow-hidden mb-6">
        {staff.map((member, index) => (
          <div 
            key={member.id}
            className={`flex items-center justify-between p-4 ${
              index !== 0 ? 'border-t border-[#f0f0f0]' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F6F6F6] rounded-full flex items-center justify-center">
                {member.role === "admin" ? (
                  <Shield className="w-5 h-5 text-purple-600" />
                ) : (
                  <User className="w-5 h-5 text-[#141414]/60" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#141414]">{member.name}</h3>
                  {member.status === "pending" && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                  )}
                </div>
                <p className="text-sm text-[#141414]/60">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                {member.role}
              </span>
              <span className="text-sm text-[#141414]/60 hidden md:block">{member.lastActive}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-[#f0f0f0] rounded-lg">
                    <MoreVertical className="w-4 h-4 text-[#141414]/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => handleOpenEditModal(member)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Role
                  </DropdownMenuItem>
                  {member.role !== "admin" && (
                    <DropdownMenuItem 
                      onClick={() => handleRemove(member.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Roles & Permissions Info */}
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#141414] mb-4">Roles & Permissions</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${
                  role === "admin" ? "text-purple-600" : 
                  role === "manager" ? "text-blue-600" : "text-gray-600"
                }`} />
                <span className="font-medium text-[#141414] capitalize">{role}</span>
              </div>
              <ul className="space-y-2">
                {permissions.map((perm, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#141414]/70">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Staff Member' : 'Invite Staff Member'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@email.com"
                disabled={!!editingMember}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(v: any) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
              {editingMember ? 'Save Changes' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Staff;
