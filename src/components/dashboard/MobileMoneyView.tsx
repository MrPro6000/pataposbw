import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Percent, Send, Smartphone, Wallet } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";
import MobileFeesSheet from "./MobileFeesSheet";
import MobileCapitalSheet from "./MobileCapitalSheet";
import MobileProfileSheet from "./MobileProfileSheet";
import MobileMoneyTransferSheet from "./MobileMoneyTransferSheet";
import MobileLoanApplicationSheet from "./MobileLoanApplicationSheet";
import MobileWalletSheet from "./MobileWalletSheet";
import PataLogo from "@/components/PataLogo";
import { useTransactions } from "@/hooks/useTransactions";

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
  const [walletOpen, setWalletOpen] = useState(false);
  const { balance, transactions } = useTransactions();

  const initials = profile?.business_name?.slice(0, 2).toUpperCase() || 
                   profile?.full_name?.slice(0, 2).toUpperCase() || 
                   userEmail?.slice(0, 2).toUpperCase() || "NH";

  const personalInitials = profile?.full_name?.slice(0, 2).toUpperCase() || 
                           userEmail?.slice(0, 2).toUpperCase() || "U";

  // Recent payouts from real transactions
  const recentPayouts = transactions.slice(0, 3).map(tx => ({
    type: tx.payment_method === "payout" ? "Withdrawal" : tx.payment_method === "card" ? "Card Sale" : tx.payment_method === "mobile_money" ? "Mobile Money" : tx.type,
    date: new Date(tx.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    amount: `${tx.amount < 0 ? "-" : ""}P${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    status: tx.status,
  }));

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
          <p className="text-sm text-white/80 mb-1">Available Balance</p>
          <p className="text-5xl font-bold text-white mb-2">P{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-white/70">Withdraw to bank or mobile money</p>
        </div>
      </header>

      {/* Wallet Button */}
      <div className="px-5 py-4 -mt-4">
        <button
          onClick={() => setWalletOpen(true)}
          className="w-full bg-card rounded-2xl py-4 flex items-center justify-center gap-2 text-foreground active:bg-muted transition-colors shadow-sm border border-border/50 font-medium"
        >
          <Wallet className="w-5 h-5 text-primary" />
          <span>Wallet & Connected Accounts</span>
        </button>
      </div>

      {/* Payouts Section */}
      <div className="px-5 py-2">
        <Link to="/dashboard/payout-history" className="block bg-card rounded-2xl overflow-hidden active:scale-98 transition-transform shadow-sm border border-border/50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-card to-muted/30">
            <h2 className="font-semibold text-foreground">Recent Payouts</h2>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {recentPayouts.length === 0 ? (
            <div className="px-5 py-6 text-center text-muted-foreground">
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentPayouts.map((payout, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{payout.type}</p>
                    <p className="text-sm text-muted-foreground">{payout.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{payout.amount}</p>
                    <p className="text-xs text-muted-foreground capitalize">{payout.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <MobileFeesSheet open={feesOpen} onClose={() => setFeesOpen(false)} />
      <MobileCapitalSheet open={capitalOpen} onClose={() => setCapitalOpen(false)} />
      <MobileProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} profile={profile} userEmail={userEmail} />
      <MobileMoneyTransferSheet open={moneyTransferOpen} onClose={() => setMoneyTransferOpen(false)} />
      <MobileLoanApplicationSheet open={loanApplicationOpen} onClose={() => setLoanApplicationOpen(false)} />
      <MobileWalletSheet open={walletOpen} onClose={() => setWalletOpen(false)} />

      <MobileBottomNav />
    </div>
  );
};

export default MobileMoneyView;
