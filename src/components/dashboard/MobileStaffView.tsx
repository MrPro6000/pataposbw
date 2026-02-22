import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, User, MoreVertical, Shield, DollarSign, Banknote, Edit, Trash2 } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";
import { useStaff } from "@/hooks/useStaff";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { format } from "date-fns";

interface MobileStaffViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileStaffView = ({ profile, userEmail }: MobileStaffViewProps) => {
  const { staff, loading, addStaff, updateStaff, removeStaff, payStaff, payAllStaff } = useStaff();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [payConfirmOpen, setPayConfirmOpen] = useState(false);
  const [payingMember, setPayingMember] = useState<any>(null);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [payingAll, setPayingAll] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "cashier", salary: "", pay_frequency: "monthly" });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "manager": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "supervisor": return "bg-green-500/10 text-green-600 dark:text-green-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleOpenAdd = () => {
    setForm({ name: "", email: "", phone: "", role: "cashier", salary: "", pay_frequency: "monthly" });
    setEditingMember(null);
    setSheetOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setForm({ name: member.name, email: member.email || "", phone: member.phone || "", role: member.role, salary: String(member.salary), pay_frequency: member.pay_frequency });
    setEditingMember(member);
    setSheetOpen(true);
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
    setSheetOpen(false);
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
    setPayConfirmOpen(false);
    setPayingMember(null);
  };

  const handlePayAll = async () => {
    setPayingAll(true);
    const res = await payAllStaff();
    if (res.error) toast({ title: "Error", description: res.error, variant: "destructive" });
    else toast({ title: "All active staff paid!" });
    setPayingAll(false);
  };

  const activeStaff = staff.filter(s => s.status === "active");
  const totalPayroll = activeStaff.reduce((sum, s) => sum + s.salary, 0);

  return (
    <div className="min-h-screen bg-muted pb-24">
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <button onClick={handleOpenAdd} className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="px-5 py-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Team members</p>
              <p className="text-2xl font-bold text-foreground">{staff.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total Payroll</p>
              <p className="text-lg font-bold text-foreground">P{totalPayroll.toFixed(2)}</p>
            </div>
            <Button size="sm" onClick={handlePayAll} disabled={payingAll || activeStaff.length === 0}>
              <Banknote className="w-3 h-3 mr-1" /> Pay All
            </Button>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">Team</h2>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading...</p>
        ) : staff.length === 0 ? (
          <div className="text-center py-10">
            <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No team members yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="bg-card rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email || member.phone || "No contact"}</p>
                      <p className="text-xs text-muted-foreground">
                        P{member.salary.toFixed(2)} / {member.pay_frequency}
                        {member.last_paid_at && ` • Paid ${format(new Date(member.last_paid_at), "MMM d")}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                      <Shield className="w-3 h-3 inline mr-1" />{member.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setPayingMember(member); setPayConfirmOpen(true); }}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                      <DollarSign className="w-3 h-3 inline mr-0.5" /> Pay
                    </button>
                    <button onClick={() => handleOpenEdit(member)}
                      className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium">
                      <Edit className="w-3 h-3 inline mr-0.5" /> Edit
                    </button>
                    <button onClick={() => handleRemove(member.id)}
                      className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
                      <Trash2 className="w-3 h-3 inline" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleOpenAdd}
          className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add Team Member</span>
        </button>
      </div>

      {/* Add/Edit Sheet */}
      <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
        <DrawerContent className="bg-background max-h-[90vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle>{editingMember ? "Edit Staff" : "Add Staff"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-5 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" className="bg-muted border-0" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@email.com" className="bg-muted border-0" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+267 71 234 5678" className="bg-muted border-0" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="bg-muted border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger className="bg-muted border-0"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Salary (P) *</Label>
              <Input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="0.00" className="bg-muted border-0 text-xl font-bold" />
            </div>
            <Button onClick={handleSave} className="w-full h-12 font-semibold">{editingMember ? "Save Changes" : "Add Staff"}</Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Pay Confirmation */}
      <Drawer open={payConfirmOpen} onOpenChange={setPayConfirmOpen}>
        <DrawerContent className="bg-background">
          <DrawerHeader className="border-b border-border pb-4">
            <DrawerTitle>Confirm Payment</DrawerTitle>
          </DrawerHeader>
          {payingMember && (
            <div className="p-5 space-y-5">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-foreground">P{payingMember.salary.toFixed(2)}</p>
                <p className="text-muted-foreground mt-2">to {payingMember.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{payingMember.role} • {payingMember.pay_frequency}</p>
              </div>
              <Button onClick={handlePayOne} className="w-full h-12 font-semibold">Confirm Payment</Button>
              <Button variant="outline" onClick={() => setPayConfirmOpen(false)} className="w-full h-12">Cancel</Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <MobileBottomNav />
    </div>
  );
};

export default MobileStaffView;
