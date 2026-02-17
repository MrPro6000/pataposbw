import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomers } from "@/hooks/useCustomers";
import { useTransactions } from "@/hooks/useTransactions";
import { Search, Plus, Users, Mail, Phone, ChevronRight, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", notes: "" });
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { customers, createCustomer, deleteCustomer } = useCustomers();
  const { transactions } = useTransactions();

  if (isMobile) { return <MobileDashboardHome />; }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer = selectedCustomerId ? customers.find(c => c.id === selectedCustomerId) : null;
  // Match transactions by customer name in description
  const selectedTxs = selectedCustomer
    ? transactions.filter(tx => tx.description?.includes(selectedCustomer.name))
    : [];
  const totalSpent = selectedTxs.reduce((s, t) => s + Math.abs(t.amount), 0);

  const handleAdd = async () => {
    if (!newCustomer.name) {
      toast({ title: "Error", description: "Customer name is required", variant: "destructive" });
      return;
    }
    const result = await createCustomer(newCustomer);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Customer Added" });
      setNewCustomer({ name: "", email: "", phone: "", notes: "" });
      setAddDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCustomer(id);
    if (result.error) toast({ title: "Error", description: result.error, variant: "destructive" });
    else { toast({ title: "Customer Deleted" }); setSelectedCustomerId(null); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer list</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No customers yet</h3>
          <p className="text-muted-foreground">Add your first customer to get started</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {filteredCustomers.map((customer, index) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomerId(customer.id)}
              className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left ${index !== 0 ? 'border-t border-border' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold">{customer.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.email || customer.phone || "No contact info"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Customer name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="customer@example.com" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="+267 71 234 5678" /></div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={newCustomer.notes} onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})} placeholder="e.g. Best customer, buys monthly..." /></div>
            <Button onClick={handleAdd} className="w-full">Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Panel */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCustomerId(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-xl border-l border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Customer Profile</h2>
              <button onClick={() => setSelectedCustomerId(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">{selectedCustomer.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{selectedCustomer.name}</h3>
                {selectedCustomer.email && (
                  <a href={`mailto:${selectedCustomer.email}`} className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Mail className="w-3 h-3" /> {selectedCustomer.email}
                  </a>
                )}
                {selectedCustomer.phone && (
                  <a href={`tel:${selectedCustomer.phone}`} className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {selectedCustomer.phone}
                  </a>
                )}
              </div>
              {selectedCustomer.notes && (
                <div className="bg-muted rounded-xl p-4 mb-4">
                  <p className="text-sm text-muted-foreground font-medium mb-1">Notes</p>
                  <p className="text-foreground text-sm">{selectedCustomer.notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">P{totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedTxs.length}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
              </div>
              {selectedTxs.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Transaction History</h4>
                  <div className="space-y-3">
                    {selectedTxs.map((tx) => (
                      <div key={tx.id} className="p-3 bg-muted rounded-xl">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-foreground">P{Math.abs(tx.amount).toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tx.description || tx.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="destructive" onClick={() => handleDelete(selectedCustomer.id)} className="w-full">
                <Trash2 className="w-4 h-4 mr-2" /> Delete Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Customers;
