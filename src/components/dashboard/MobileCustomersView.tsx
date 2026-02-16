import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Users, Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";

interface MobileCustomersViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  visits: number;
}

const MobileCustomersView = ({ profile, userEmail }: MobileCustomersViewProps) => {
  const customers: Customer[] = [];

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <button className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search customers..."
            className="pl-10 bg-card border-0 rounded-xl"
          />
        </div>
      </div>

      {/* Customer Summary */}
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

      {/* Customers List */}
      <div className="px-5">
        <h2 className="text-sm text-muted-foreground mb-3">All customers</h2>
        <div className="space-y-3">
          {customers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No customers yet</p>
              <p className="text-sm text-muted-foreground/60">Customers will appear here as they make purchases</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="bg-card rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.visits} visits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">P{customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">total spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">{customer.email}</span>
                  </a>
                  <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone.split(' ').slice(-2).join(' ')}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Customer Card */}
        <button className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add Customer</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileCustomersView;
