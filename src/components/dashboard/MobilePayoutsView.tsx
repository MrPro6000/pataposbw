import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Zap, Building2, ChevronRight } from "lucide-react";
import MobileBottomNav from "./MobileBottomNav";

const payoutsData = [
  { id: "PAY001", type: "Payout", date: "28 Jan 2025", amount: "P5,420.00", status: "processing" as const, reference: "PAYOUT-2025-001" },
  { id: "PAY002", type: "Payout", date: "21 Jan 2025", amount: "P8,930.00", status: "completed" as const, reference: "PAYOUT-2025-002" },
  { id: "PAY003", type: "Instant Payout", date: "14 Jan 2025", amount: "P6,780.00", status: "completed" as const, reference: "PAYOUT-2025-003" },
  { id: "PAY004", type: "Payout", date: "7 Jan 2025", amount: "P4,560.00", status: "completed" as const, reference: "PAYOUT-2025-004" },
  { id: "PAY005", type: "Payout", date: "31 Dec 2024", amount: "P12,340.00", status: "completed" as const, reference: "PAYOUT-2024-052" },
  { id: "PAY006", type: "Instant Payout", date: "24 Dec 2024", amount: "P3,210.00", status: "completed" as const, reference: "PAYOUT-2024-051" },
];

const MobilePayoutsView = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status: "completed" | "processing") => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3" /> Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
        <Clock className="w-3 h-3" /> Processing
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border px-5 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard/payouts")} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Payouts</h1>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-5 py-4 space-y-3">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground">
          <p className="text-sm opacity-80 mb-1">Available Balance</p>
          <p className="text-3xl font-bold">P12,450.00</p>
          <p className="text-sm opacity-70 mt-1">Next payout: Monday</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Processing</span>
            </div>
            <p className="text-lg font-bold text-foreground">P5,420.00</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Paid This Month</span>
            </div>
            <p className="text-lg font-bold text-foreground">P67,890.00</p>
          </div>
        </div>
      </div>

      {/* Instant Payout */}
      <div className="px-5 pb-3">
        <button className="w-full bg-card rounded-2xl py-4 flex items-center justify-center gap-2 text-foreground active:bg-muted transition-colors shadow-sm border border-border/50 font-medium">
          <Zap className="w-5 h-5 text-warning" />
          <span>Instant Payout</span>
        </button>
      </div>

      {/* Bank Account */}
      <div className="px-5 pb-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">First National Bank</p>
              <p className="text-xs text-muted-foreground">•••• •••• 4532</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="px-5">
        <h2 className="font-semibold text-foreground mb-3">Payout History</h2>
        <div className="space-y-2">
          {payoutsData.map((payout) => (
            <div key={payout.id} className="bg-card border border-border rounded-2xl p-4 active:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{payout.type}</p>
                <p className="font-semibold text-foreground">{payout.amount}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{payout.date}</p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">{payout.reference}</p>
                </div>
                {getStatusBadge(payout.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobilePayoutsView;
