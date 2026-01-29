import { Link } from "react-router-dom";
import { ChevronLeft, Plus, Users, Search, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";

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
  const customers: Customer[] = [
    { id: "1", name: "John Doe", email: "john@example.com", phone: "+267 71 234 5678", totalSpent: 2450, visits: 12 },
    { id: "2", name: "Sarah Smith", email: "sarah@example.com", phone: "+267 72 345 6789", totalSpent: 1890, visits: 8 },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+267 73 456 7890", totalSpent: 3200, visits: 15 },
    { id: "4", name: "Emily Brown", email: "emily@example.com", phone: "+267 74 567 8901", totalSpent: 980, visits: 4 },
    { id: "5", name: "David Lee", email: "david@example.com", phone: "+267 75 678 9012", totalSpent: 4500, visits: 22 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-[#141414]" />
          </Link>
          <h1 className="font-semibold text-[#141414]">Customers</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-[#00C8E6]" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#141414]/40" />
          <Input 
            placeholder="Search customers..."
            className="pl-10 bg-white border-0 rounded-xl"
          />
        </div>
      </div>

      {/* Customer Summary */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#141414]/60">Total customers</p>
              <p className="text-2xl font-bold text-[#141414]">{customers.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#00C8E6]/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#00C8E6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="px-5">
        <h2 className="text-sm text-[#141414]/60 mb-3">All customers</h2>
        <div className="space-y-3">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#00C8E6] rounded-xl flex items-center justify-center text-white font-bold">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#141414]">{customer.name}</h3>
                    <p className="text-sm text-[#141414]/60">{customer.visits} visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#141414]">P{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-[#141414]/50">total spent</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-[#E8E8E8]">
                <a 
                  href={`mailto:${customer.email}`} 
                  className="flex items-center gap-1.5 text-sm text-[#141414]/60"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{customer.email}</span>
                </a>
                <a 
                  href={`tel:${customer.phone}`} 
                  className="flex items-center gap-1.5 text-sm text-[#141414]/60"
                >
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone.split(' ').slice(-2).join(' ')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add Customer Card */}
        <button className="w-full mt-4 border-2 border-dashed border-[#E0E0E0] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-[#00C8E6] active:bg-[#00C8E6]/5 transition-colors">
          <div className="w-12 h-12 bg-[#F0F0F0] rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-[#141414]/40" />
          </div>
          <span className="text-[#141414]/60 font-medium">Add Customer</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileCustomersView;
