import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileStaffView from "@/components/dashboard/MobileStaffView";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStaff } from "@/hooks/useStaff";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Shield, User, MoreVertical, Edit, Trash2, DollarSign, CheckCircle, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Staff = () => {
  const { staff, loading, addStaff, updateStaff, removeStaff, payStaff, payAllStaff } = useStaff();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payingMember, setPayingMember] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [payingAll, setPayingAll] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "cashier", salary: "", pay_frequency: "monthly" });

  if (isMobile) {
    return <MobileStaffView profile={userProfile} />;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-500/20 text-purple-400";
      case "manager": return "bg-blue-500/20 text-blue-400";
      case "supervisor": return "bg-green-500/20 text-green-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleOpenAdd = () => {
    setForm({ name: "", email: "", phone: "", role: "cashier", salary: "", pay_frequency: "monthly" });
    setEditingMember(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setForm({ name: member.name, email: member.email || "", phone: member.phone || "", role: member.role, salary: String(member.salary), pay_frequency: member.pay_frequency });
    setEditingMember(member);
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.salary) return;
    if (editingMember) {
      const res = await updateStaff(editingMember.id, { name: form.name, email: form.email, phone: form.phone, role: form.role, salary: parseFloat(form.salary), pay_frequency: form.pay_frequency });
      if (res.error) toast({ title: "Error", description: res.error, variant: "destructive" });
      else toast({ title: "Staff updated" });
    } else {
      const res = await addStaff({ name: form.name, email: form.email, phone: form.phone, role: form.role, salary: parseFloat(form.salary), pay_frequency: form.pay_frequency });
      if (res.error) toast({ title: "Error", description: res.error, variant: "destructive" });
      else toast({ title: "Staff added" });
    }
    setIsAddOpen(false);
  };

  const handleRemove = async (id: string) => {
    await removeStaff(id);
    toast({ title: "Staff removed" });
  };

  const handlePayOne = async () => {
    if (!payingMember) return;
    const res = await payStaff(payingMember.id, payingMember.salary);
    if (res.error) toast({ title: "Error", description: res.error, variant: "destructive" });
    else toast({ title: `P${payingMember.salary.toFixed(2)} paid to ${payingMember.name}` });
    setIsPayOpen(false);
    setPayingMember(null);
  };

  const handlePayAll = async () => {
    setPayingAll(true);
    const res = await payAllStaff();
    if (res.error) toast({ title: "Error", description: res.error, variant: "destructive" });
    else toast({ title: "All active staff paid successfully" });
    setPayingAll(false);
  };

  const totalPayroll = staff.filter(s => s.status === "active").reduce((sum, s) => sum + s.salary, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff & Payroll</h1>
          <p className="text-muted-foreground">Manage team members and payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePayAll} disabled={payingAll || staff.filter(s => s.status === "active").length === 0}>
            <Banknote className="w-4 h-4 mr-2" /> Pay All (P{totalPayroll.toFixed(2)})
          </Button>
          <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" /> Add Staff
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading staff...</div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No team members yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          {staff.map((member, index) => (
            <div key={member.id} className={`flex items-center justify-between p-4 ${index !== 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>{member.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email || member.phone || "No contact"}</p>
                  <p className="text-xs text-muted-foreground">
                    P{member.salary.toFixed(2)} / {member.pay_frequency}
                    {member.last_paid_at && ` • Last paid ${format(new Date(member.last_paid_at), "MMM d")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setPayingMember(member); setIsPayOpen(true); }}>
                  <DollarSign className="w-3 h-3 mr-1" /> Pay
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 hover:bg-muted rounded-lg"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border">
                    <DropdownMenuItem onClick={() => handleOpenEdit(member)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemove(member.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingMember ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+267 71 234 5678" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pay Frequency</Label>
                <Select value={form.pay_frequency} onValueChange={(v) => setForm({ ...form, pay_frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Salary Amount (P) *</Label>
              <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingMember ? "Save Changes" : "Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay Confirmation Dialog */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Payment</DialogTitle></DialogHeader>
          {payingMember && (
            <div className="py-4 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">P{payingMember.salary.toFixed(2)}</p>
                <p className="text-muted-foreground mt-1">to {payingMember.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{payingMember.role} • {payingMember.pay_frequency}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayOpen(false)}>Cancel</Button>
            <Button onClick={handlePayOne}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Staff;
