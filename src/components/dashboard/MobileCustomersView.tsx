import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Users, Search, Mail, Phone, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";
import { useCustomers } from "@/hooks/useCustomers";
import { useTransactions } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";

interface MobileCustomersViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileCustomersView = ({ profile, userEmail }: MobileCustomersViewProps) => {
  const { customers, createCustomer, deleteCustomer } = useCustomers();
  const { transactions } = useTransactions();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async () => {
    if (!form.name) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    const result = await createCustomer(form);
    if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    else {
      toast({ title: "Customer Added" });
      setForm({ name: "", email: "", phone: "", notes: "" });
      setAddOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCustomer(id);
    if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    else toast({ title: "Customer Deleted" });
  };

  const getCustomerTxCount = (name: string) =>
    transactions.filter(tx => tx.description?.includes(name)).length;

  const getCustomerSpent = (name: string) =>
    transactions.filter(tx => tx.description?.includes(name)).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-muted pb-24">
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <button onClick={() => setAddOpen(true)} className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card border-0 rounded-xl" />
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total customers</p>
              <p className="text-2xl font-bold text-foreground">{customers.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">All customers</h2>
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No customers yet</p>
            <p className="text-sm text-muted-foreground/70">Tap + to add your first customer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((customer) => {
              const txCount = getCustomerTxCount(customer.name);
              const spent = getCustomerSpent(customer.name);
              return (
                <div key={customer.id} className="bg-card rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                        {customer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{txCount} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">P{spent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">total spent</p>
                    </div>
                  </div>
                  {customer.notes && (
                    <p className="text-xs text-muted-foreground mb-3 italic">"{customer.notes}"</p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      {customer.email && (
                        <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[120px]">{customer.email}</span>
                        </a>
                      )}
                      {customer.phone && (
                        <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </a>
                      )}
                    </div>
                    <button onClick={() => handleDelete(customer.id)} className="text-destructive p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => setAddOpen(true)} className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add Customer</span>
        </button>
      </div>

      {/* Add Customer Drawer */}
      <Drawer open={addOpen} onOpenChange={setAddOpen}>
        <DrawerContent className="bg-background max-h-[90vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-foreground">Add Customer</DrawerTitle>
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="p-5 space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Customer name" className="bg-muted border-0" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="customer@example.com" className="bg-muted border-0" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+267 71 234 5678" className="bg-muted border-0" /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="e.g. Best customer, buys monthly..." className="bg-muted border-0" /></div>
            <Button onClick={handleAdd} className="w-full h-12 font-semibold">Add Customer</Button>
          </div>
        </DrawerContent>
      </Drawer>

      <MobileBottomNav />
    </div>
  );
};

export default MobileCustomersView;
