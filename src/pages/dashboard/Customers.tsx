import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  Search, 
  Plus, 
  Users,
  Mail,
  Phone,
  ChevronRight,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  { id: "CUS001", name: "John Smith", email: "john@email.com", phone: "+27 82 123 4567", totalSpent: 2450.00, transactions: 12, lastVisit: "2025-01-28" },
  { id: "CUS002", name: "Sarah Johnson", email: "sarah@email.com", phone: "+27 83 234 5678", totalSpent: 1890.00, transactions: 8, lastVisit: "2025-01-27" },
  { id: "CUS003", name: "Michael Brown", email: "michael@email.com", totalSpent: 3200.00, transactions: 15, lastVisit: "2025-01-26" },
  { id: "CUS004", name: "Emily Davis", email: "emily@email.com", phone: "+27 84 345 6789", totalSpent: 950.00, transactions: 5, lastVisit: "2025-01-25" },
  { id: "CUS005", name: "David Wilson", email: "david@email.com", totalSpent: 4100.00, transactions: 20, lastVisit: "2025-01-24" },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email) return;
    
    const newCustomer: Customer = {
      id: `CUS${String(customers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      totalSpent: 0,
      transactions: 0,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ name: "", email: "", phone: "" });
    setIsAddModalOpen(false);
  };

  // Mock purchase history
  const purchaseHistory = [
    { id: "TXN001", date: "2025-01-28", amount: 150.00, items: "2x Cappuccino, 1x Croissant" },
    { id: "TXN002", date: "2025-01-25", amount: 89.00, items: "1x Avocado Toast" },
    { id: "TXN003", date: "2025-01-22", amount: 210.00, items: "3x Espresso, 2x Muffin" },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Customers</h1>
          <p className="text-[#141414]/60">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40" />
          <Input 
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {filteredCustomers.map((customer, index) => (
          <button
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className={`w-full flex items-center justify-between p-4 hover:bg-[#fafafa] transition-colors text-left ${
              index !== 0 ? 'border-t border-[#f0f0f0]' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00C8E6]/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00C8E6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#141414]">{customer.name}</h3>
                <p className="text-sm text-[#141414]/60">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-[#141414]">R{customer.totalSpent.toFixed(2)}</p>
                <p className="text-sm text-[#141414]/60">{customer.transactions} transactions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#141414]/30" />
            </div>
          </button>
        ))}
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedCustomer(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
            <div className="p-6 border-b border-[#f0f0f0] flex items-center justify-between">
              <h2 className="text-xl font-semibold">Customer Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-[#f0f0f0] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#00C8E6]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-10 h-10 text-[#00C8E6]" />
                </div>
                <h3 className="text-xl font-bold text-[#141414]">{selectedCustomer.name}</h3>
                <p className="text-[#141414]/60">Customer since Jan 2025</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-[#F6F6F6] rounded-xl">
                  <Mail className="w-5 h-5 text-[#141414]/60" />
                  <span className="text-[#141414]">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-[#F6F6F6] rounded-xl">
                    <Phone className="w-5 h-5 text-[#141414]/60" />
                    <span className="text-[#141414]">{selectedCustomer.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F6F6F6] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#141414]">R{selectedCustomer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-[#141414]/60">Total Spent</p>
                </div>
                <div className="bg-[#F6F6F6] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#141414]">{selectedCustomer.transactions}</p>
                  <p className="text-sm text-[#141414]/60">Transactions</p>
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <h4 className="font-semibold text-[#141414] mb-3">Purchase History</h4>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="p-3 bg-[#F6F6F6] rounded-xl">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-[#141414]">R{purchase.amount.toFixed(2)}</span>
                        <span className="text-sm text-[#141414]/60">{purchase.date}</span>
                      </div>
                      <p className="text-sm text-[#141414]/60">{purchase.items}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input 
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+27 00 000 0000"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer} className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;
