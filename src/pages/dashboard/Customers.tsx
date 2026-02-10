import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Plus, Users, Mail, Phone, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  transactions: number;
  lastVisit: string;
}

const initialCustomers: Customer[] = [
  { id: "CUS001", name: "Keabetswe Moeng", email: "keabetswe@email.com", phone: "+267 72 123 4567", totalSpent: 2450.00, transactions: 12, lastVisit: "2025-01-28" },
  { id: "CUS002", name: "Onalenna Kgosi", email: "onalenna@email.com", phone: "+267 73 234 5678", totalSpent: 1890.00, transactions: 8, lastVisit: "2025-01-27" },
  { id: "CUS003", name: "Tebogo Molefe", email: "tebogo@email.com", totalSpent: 3200.00, transactions: 15, lastVisit: "2025-01-26" },
  { id: "CUS004", name: "Lesego Motswagole", email: "lesego@email.com", phone: "+267 74 345 6789", totalSpent: 950.00, transactions: 5, lastVisit: "2025-01-25" },
  { id: "CUS005", name: "Kagiso Seretse", email: "kagiso@email.com", totalSpent: 4100.00, transactions: 20, lastVisit: "2025-01-24" },
  { id: "CUS006", name: "Tsabong Sub-District Council", email: "accounts@tsabongcouncil.gov.bw", phone: "+267 65 440 123", totalSpent: 28500.00, transactions: 45, lastVisit: "2025-01-28" },
  { id: "CUS007", name: "Tlokweng Land Board", email: "payments@tlokwenglandboard.gov.bw", phone: "+267 39 281 00", totalSpent: 15200.00, transactions: 32, lastVisit: "2025-01-27" },
  { id: "CUS008", name: "Gaborone City Council", email: "revenue@gaboronecity.gov.bw", phone: "+267 36 588 00", totalSpent: 72000.00, transactions: 120, lastVisit: "2025-01-28" },
  { id: "CUS009", name: "Extension 14 Clinic", email: "admin@ext14clinic.gov.bw", phone: "+267 39 531 22", totalSpent: 8900.00, transactions: 18, lastVisit: "2025-01-26" },
  { id: "CUS010", name: "Mogoditshane Primary Hospital", email: "finance@mogoditshanehospital.gov.bw", phone: "+267 39 189 00", totalSpent: 34500.00, transactions: 55, lastVisit: "2025-01-25" },
  { id: "CUS011", name: "Broadhurst Magistrate Court", email: "accounts@broadhurstcourt.gov.bw", phone: "+267 39 544 11", totalSpent: 19800.00, transactions: 40, lastVisit: "2025-01-24" },
  { id: "CUS012", name: "Francistown Municipal Council", email: "revenue@francistowncouncil.gov.bw", phone: "+267 24 113 00", totalSpent: 56000.00, transactions: 90, lastVisit: "2025-01-27" },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const isMobile = useIsMobile();

  if (isMobile) { return <MobileDashboardHome />; }

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email) return;
    setCustomers([...customers, { id: `CUS${String(customers.length + 1).padStart(3, '0')}`, name: formData.name, email: formData.email, phone: formData.phone || undefined, totalSpent: 0, transactions: 0, lastVisit: new Date().toISOString().split('T')[0] }]);
    setFormData({ name: "", email: "", phone: "" });
    setIsAddModalOpen(false);
  };

  const purchaseHistory = [
    { id: "TXN001", date: "2025-01-28", amount: 150.00, items: "2x Cappuccino, 1x Croissant" },
    { id: "TXN002", date: "2025-01-25", amount: 89.00, items: "1x Avocado Toast" },
    { id: "TXN003", date: "2025-01-22", amount: 210.00, items: "3x Espresso, 2x Muffin" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filteredCustomers.map((customer, index) => (
          <button
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left ${index !== 0 ? 'border-t border-border' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{customer.name}</h3>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-foreground">P{customer.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{customer.transactions} transactions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCustomer(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-xl border-l border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Customer Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{selectedCustomer.name}</h3>
                <p className="text-muted-foreground">Customer since Jan 2025</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{selectedCustomer.phone}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">P{selectedCustomer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedCustomer.transactions}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Purchase History</h4>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="p-3 bg-muted rounded-xl">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-foreground">P{purchase.amount.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">{purchase.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{purchase.items}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer name" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="customer@email.com" /></div>
            <div className="space-y-2"><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+267 70 000 0000" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer} className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;
