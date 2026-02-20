import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LoanApplication {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  business_name: string | null;
  business_type: string | null;
  monthly_revenue: number | null;
  years_in_business: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  profile?: { full_name: string | null; email: string | null; phone: string | null };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

const AdminLoans = () => {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Fetch profiles for each loan
    const userIds = [...new Set((data || []).map((l) => l.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, phone")
      .in("user_id", userIds);

    const profileMap: Record<string, { full_name: string | null; email: string | null; phone: string | null }> = {};
    (profiles || []).forEach((p) => {
      profileMap[p.user_id] = { full_name: p.full_name, email: p.email, phone: p.phone };
    });

    setLoans(
      (data || []).map((l) => ({
        ...l,
        profile: profileMap[l.user_id] || { full_name: null, email: null, phone: null },
      }))
    );
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    const { error } = await supabase
      .from("loan_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "Loan Approved" : "Loan Rejected", description: `Application has been ${status}.` });
      setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
    setUpdating(null);
  };

  // Parse repayment plan from purpose string
  const parseRepaymentPlan = (purpose: string) => {
    const parts = purpose.split(" | ");
    return {
      purpose: parts[0] || purpose,
      repaymentPlan: parts.find((p) => p.startsWith("Repayment plan:"))?.replace("Repayment plan: ", "") || "—",
      provider: parts.find((p) => p.startsWith("Provider:"))?.replace("Provider: ", "") || "—",
    };
  };

  const pendingLoans = loans.filter((l) => l.status === "pending");
  const reviewedLoans = loans.filter((l) => l.status !== "pending");

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Loan Applications</h1>
        <p className="text-white/60">Review and approve merchant capital requests</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending", count: loans.filter((l) => l.status === "pending").length, color: "text-yellow-500" },
          { label: "Approved", count: loans.filter((l) => l.status === "approved").length, color: "text-green-500" },
          { label: "Rejected", count: loans.filter((l) => l.status === "rejected").length, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] rounded-2xl p-5">
            <p className="text-white/50 text-sm mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{loading ? "…" : s.count}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-16">Loading applications…</div>
      ) : loans.length === 0 ? (
        <div className="text-center py-16">
          <Wallet className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No loan applications yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingLoans.length > 0 && (
            <section>
              <h2 className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4">Pending Review ({pendingLoans.length})</h2>
              <div className="space-y-3">
                {pendingLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} expanded={expanded} setExpanded={setExpanded} updating={updating} updateStatus={updateStatus} parseRepaymentPlan={parseRepaymentPlan} />
                ))}
              </div>
            </section>
          )}

          {reviewedLoans.length > 0 && (
            <section>
              <h2 className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4">Reviewed ({reviewedLoans.length})</h2>
              <div className="space-y-3">
                {reviewedLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} expanded={expanded} setExpanded={setExpanded} updating={updating} updateStatus={updateStatus} parseRepaymentPlan={parseRepaymentPlan} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

interface LoanCardProps {
  loan: LoanApplication;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  updating: string | null;
  updateStatus: (id: string, status: "approved" | "rejected") => void;
  parseRepaymentPlan: (purpose: string) => { purpose: string; repaymentPlan: string; provider: string };
}

const LoanCard = ({ loan, expanded, setExpanded, updating, updateStatus, parseRepaymentPlan }: LoanCardProps) => {
  const isExpanded = expanded === loan.id;
  const parsed = parseRepaymentPlan(loan.purpose);
  const totalRepayable = loan.amount * 1.15;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setExpanded(isExpanded ? null : loan.id)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-white font-semibold">
              {loan.profile?.full_name || loan.business_name || "Unknown Merchant"}
            </p>
            <p className="text-white/50 text-sm">
              {loan.business_name} · {loan.business_type} · {format(new Date(loan.created_at), "d MMM yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-bold text-lg">P{loan.amount.toLocaleString()}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[loan.status || "pending"]}`}>
              {loan.status || "pending"}
            </span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-white/10 p-5 space-y-5">
          {/* Merchant Info */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Merchant Details</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Email", value: loan.profile?.email || "—" },
                { label: "Phone", value: loan.profile?.phone || "—" },
                { label: "Business", value: loan.business_name || "—" },
                { label: "Industry", value: loan.business_type || "—" },
                { label: "Monthly Revenue", value: loan.monthly_revenue ? `P${loan.monthly_revenue.toLocaleString()}` : "—" },
                { label: "Years in Business", value: loan.years_in_business?.toString() || "—" },
              ].map((item) => (
                <div key={item.label} className="bg-[#111] rounded-xl p-3">
                  <p className="text-white/40 text-xs mb-1">{item.label}</p>
                  <p className="text-white text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Details */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Loan Details</p>
            <div className="bg-[#111] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Purpose</span>
                <span className="text-white font-medium">{parsed.purpose}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Requested Amount</span>
                <span className="text-white font-bold">P{loan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Total Repayable (15% p.a.)</span>
                <span className="text-amber-400 font-bold">P{totalRepayable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                <span className="text-white/50">Repayment Plan</span>
                <span className="text-white font-medium text-right max-w-[60%]">{parsed.repaymentPlan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Disbursement Provider</span>
                <span className="text-white font-medium capitalize">{parsed.provider}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {loan.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => updateStatus(loan.id, "rejected")}
                disabled={updating === loan.id}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => updateStatus(loan.id, "approved")}
                disabled={updating === loan.id}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {updating === loan.id ? "Updating…" : "Approve"}
              </Button>
            </div>
          )}

          {loan.status !== "pending" && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
              loan.status === "approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              {loan.status === "approved" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              This application has been {loan.status}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLoans;
