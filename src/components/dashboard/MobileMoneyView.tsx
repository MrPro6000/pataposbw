import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Percent, Send, Banknote } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobileFeesSheet from "./MobileFeesSheet";
import MobileCapitalSheet from "./MobileCapitalSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import MobileMoneyTransferSheet from "./MobileMoneyTransferSheet";
import MobileLoanApplicationSheet from "./MobileLoanApplicationSheet";
import PataLogo from "@/components/PataLogo";

interface MobileMoneyViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileMoneyView = ({ profile, userEmail }: MobileMoneyViewProps) => {
  const [feesOpen, setFeesOpen] = useState(false);
  const [capitalOpen, setCapitalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moneyTransferOpen, setMoneyTransferOpen] = useState(false);
  const [loanApplicationOpen, setLoanApplicationOpen] = useState(false);

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
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-6 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-6">
          <PataLogo className="h-5" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground"
          >
            {personalInitials}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Payout amount</p>
          <p className="text-5xl font-bold text-foreground mb-2">P4.34</p>
          <p className="text-sm text-muted-foreground">You are below the minimum payout amount</p>
        </div>
      </header>

      {/* Instant Payout Button */}
      <div className="px-5 py-4">
        <button className="w-full bg-muted rounded-2xl py-4 flex items-center justify-center gap-2 text-muted-foreground active:bg-border transition-colors">
          <Zap className="w-5 h-5" />
          <span className="font-medium">Instant payout</span>
        </button>
      </div>

      {/* Payouts Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/payouts" className="block bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Payouts</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="divide-y divide-border">
            {payouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">{payout.type}</p>
                  <p className="text-sm text-muted-foreground">{payout.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{payout.amount}</p>
                  <p className="text-sm text-muted-foreground">{payout.fees}</p>
                </div>
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* Send Money Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setMoneyTransferOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Send Money</p>
              <p className="text-sm text-muted-foreground">International transfers via Mukuru</p>
            </div>
          </div>
        </button>
      </div>

      {/* Pata Capital Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setCapitalOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Pata Capital</p>
              <p className="text-sm text-muted-foreground">Find out more</p>
            </div>
          </div>
        </button>
      </div>

      {/* Business Loan Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setLoanApplicationOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Business Loan</p>
              <p className="text-sm text-muted-foreground">Apply for funding</p>
            </div>
          </div>
        </button>
      </div>

      {/* Fees Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setFeesOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Percent className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Fees</p>
              <p className="text-sm text-muted-foreground">All the fees related to your business</p>
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

      {/* Money Transfer Sheet */}
      <MobileMoneyTransferSheet
        open={moneyTransferOpen}
        onClose={() => setMoneyTransferOpen(false)}
      />

      {/* Loan Application Sheet */}
      <MobileLoanApplicationSheet
        open={loanApplicationOpen}
        onClose={() => setLoanApplicationOpen(false)}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileMoneyView;
