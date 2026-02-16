import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { Search, Plus, Users, Mail, Phone, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Customers are derived from transaction descriptions for now
// In a full implementation, a customers table would exist

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();

  if (isMobile) { return <MobileDashboardHome />; }

  // Derive unique customers from transaction descriptions
  const customerMap = new Map<string, { totalSpent: number; txCount: number; lastDate: string }>();
  transactions.forEach(tx => {
    if (tx.description) {
      // Extract customer name from descriptions like "Mode: CustomerName — From → To"
      const match = tx.description.match(/:\s*(.+?)\s*—/);
      const name = match ? match[1].trim() : tx.description.split(" ")[0];
      if (name && name.length > 1) {
        const existing = customerMap.get(name) || { totalSpent: 0, txCount: 0, lastDate: tx.created_at };
        existing.totalSpent += Math.abs(tx.amount);
        existing.txCount += 1;
        if (new Date(tx.created_at) > new Date(existing.lastDate)) existing.lastDate = tx.created_at;
        customerMap.set(name, existing);
      }
    }
  });

  const customers = Array.from(customerMap.entries()).map(([name, data]) => ({
    name,
    totalSpent: data.totalSpent,
    transactions: data.txCount,
    lastVisit: data.lastDate,
  }));

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedData = selectedCustomer ? customers.find(c => c.name === selectedCustomer) : null;
  const selectedTxs = selectedCustomer
    ? transactions.filter(tx => tx.description?.includes(selectedCustomer))
    : [];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Customers derived from your transactions</p>
        </div>
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
          <p className="text-muted-foreground">Customers will appear here as you make transactions</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {filteredCustomers.map((customer, index) => (
            <button
              key={customer.name}
              onClick={() => setSelectedCustomer(customer.name)}
              className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left ${index !== 0 ? 'border-t border-border' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.transactions} transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="font-semibold text-foreground">P{customer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Last: {new Date(customer.lastVisit).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedData && (
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
                <h3 className="text-xl font-bold text-foreground">{selectedCustomer}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">P{selectedData.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedData.transactions}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
              </div>
              <div>
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
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Customers;
