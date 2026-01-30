import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Percent } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobileFeesSheet from "./MobileFeesSheet";
import MobileCapitalSheet from "./MobileCapitalSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import PataLogo from "@/components/PataLogo";

interface MobileMoneyViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileMoneyView = ({ profile, userEmail }: MobileMoneyViewProps) => {
  const [feesOpen, setFeesOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  // Mock payouts data
  const payouts = [
    { type: "Payout", date: "9 May 2024", amount: "P16.34", fees: "Fees -P35.16" },
    { type: "Instant Payout", date: "8 May 2024", amount: "-P12.45", fees: "Fees P17.25" },
    { type: "Instant Payout", date: "8 May 2024", amount: "-P12.45", fees: "Fees P17.25" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white px-5 pt-4 pb-6 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-[#0066FF] rounded-xl flex items-center justify-center text-sm font-bold text-white"
          >
            {personalInitials}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#141414]/60 mb-1">Payout amount</p>
          <p className="text-5xl font-bold text-[#141414] mb-2">P4.34</p>
          <p className="text-sm text-[#141414]/60">You are below the minimum payout amount</p>
        </div>
      </header>

      {/* Instant Payout Button */}
      <div className="px-5 py-4">
        <button className="w-full bg-[#F5F5F5] rounded-2xl py-4 flex items-center justify-center gap-2 text-[#141414]/60 active:bg-[#E8E8E8] transition-colors">
          <Zap className="w-5 h-5" />
          <span className="font-medium">Instant payout</span>
        </button>
      </div>

      {/* Payouts Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/payouts" className="block bg-white rounded-2xl overflow-hidden active:scale-98 transition-transform">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
            <h2 className="font-semibold text-[#141414]">Payouts</h2>
            <ChevronRight className="w-5 h-5 text-[#141414]/40" />
          </div>
          
          <div className="divide-y divide-[#E8E8E8]">
            {payouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-[#141414]">{payout.type}</p>
                  <p className="text-sm text-[#141414]/60">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#141414]">{payout.amount}</p>
                  <p className="text-sm text-[#141414]/60">{payout.fees}</p>
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* Pata Capital Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setCapitalOpen(true)}
          className="w-full bg-white rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="font-semibold text-[#141414]">Pata Capital</p>
              <p className="text-sm text-[#141414]/60">Find out more</p>
            </div>
          </div>
        </button>
      </div>

      {/* Fees Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setFeesOpen(true)}
          className="w-full bg-white rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-[#141414]/60" />
            </div>
            <div>
              <p className="font-semibold text-[#141414]">Fees</p>
              <p className="text-sm text-[#141414]/60">All the fees related to your business</p>
            </div>
          </div>
        </button>
      </div>

      {/* Fees Sheet */}
      <MobileFeesSheet
        open={feesOpen}
        onClose={() => setFeesOpen(false)}
      />

      {/* Capital Sheet */}
      <MobileCapitalSheet
        open={capitalOpen}
        onClose={() => setCapitalOpen(false)}
      />

      {/* Profile Sheet */}
      <MobileProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        userEmail={userEmail}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileMoneyView;
