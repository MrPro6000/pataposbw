import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Percent, Send, Smartphone } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-muted to-pata-cream dark:from-background dark:to-background pb-24">
      {/* Header with gradient accent */}
      <header className="bg-gradient-to-br from-primary via-primary to-primary/90 px-5 pt-4 pb-8 sticky top-0 z-40 rounded-b-3xl shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between mb-6">
          <PataLogo className="h-5 [&_*]:fill-white" />
          <button 
            onClick={() => setProfileOpen(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-sm font-bold text-white border border-white/20"
          >
            {personalInitials}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-white/80 mb-1">Payout amount</p>
          <p className="text-5xl font-bold text-white mb-2">P4.34</p>
          <p className="text-sm text-white/70">You are below the minimum payout amount</p>
        </div>
      </header>

      {/* Instant Payout Button */}
      <div className="px-5 py-4 -mt-4">
        <button className="w-full bg-card rounded-2xl py-4 flex items-center justify-center gap-2 text-foreground active:bg-muted transition-colors shadow-sm border border-border/50 font-medium">
          <Zap className="w-5 h-5 text-warning" />
          <span>Instant payout</span>
        </button>
      </div>

      {/* Payouts Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/payouts" className="block bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform shadow-sm border border-border/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-card to-muted/30">
            <h2 className="font-semibold text-foreground">Payouts</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="divide-y divide-border">
            {payouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
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

      {/* Mobile Money Loans Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setLoanApplicationOpen(true)}
          className="w-full bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-5 active:scale-98 transition-transform text-left border border-amber-200/50 dark:border-amber-700/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Smartphone className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Mobile Money Loans</p>
              <p className="text-sm text-muted-foreground">Orange Money, Smega, MyZaka</p>
            </div>
          </div>
        </button>
      </div>

      {/* Send Money Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setMoneyTransferOpen(true)}
          className="w-full bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl p-5 active:scale-98 transition-transform text-left border border-orange-200/50 dark:border-orange-700/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Send className="w-6 h-6 text-white" />
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
          className="w-full bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10 rounded-2xl p-5 active:scale-98 transition-transform text-left border border-cyan-200/50 dark:border-cyan-700/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Pata Capital</p>
              <p className="text-sm text-muted-foreground">Find out more</p>
            </div>
          </div>
        </button>
      </div>

      {/* Fees Section */}
      <div className="px-5 py-2">
        <button 
          onClick={() => setFeesOpen(true)}
          className="w-full bg-card rounded-2xl p-5 active:scale-98 transition-transform text-left shadow-sm border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-slate-600 dark:text-slate-300" />
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
