import { useState, useEffect } from "react";
import { X, ChevronLeft, Wallet, CheckCircle, AlertCircle, TrendingDown, Calendar, Percent, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";

interface MobileLoanRepaymentSheetProps {
  open: boolean;
  onClose: () => void;
}

interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  status: string | null;
  created_at: string;
  business_name: string | null;
}

const INTEREST_RATE = 0.15;
const TERM_MONTHS = 12;

const MobileLoanRepaymentSheet = ({ open, onClose }: MobileLoanRepaymentSheetProps) => {
  const { toast } = useToast();
  const { balance, addTransaction } = useTransactions();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [view, setView] = useState<"list" | "detail" | "confirm" | "processing" | "success">("list");
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const fetchLoans = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["approved", "active"])
      .order("created_at", { ascending: false });

    setLoans((data || []) as LoanApplication[]);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchLoans();
      setView("list");
      setSelectedLoan(null);
      setAcceptedTerms(false);
    }
  }, [open]);

  const getLoanDetails = (loan: LoanApplication) => {
    const totalRepayable = loan.amount * (1 + INTEREST_RATE);
    const monthlyPayment = totalRepayable / TERM_MONTHS;
    const totalInterest = loan.amount * INTEREST_RATE;
    const monthsElapsed = Math.floor(
      (Date.now() - new Date(loan.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    const monthsRemaining = Math.max(TERM_MONTHS - monthsElapsed, 1);
    const amountPaid = monthlyPayment * Math.min(monthsElapsed, TERM_MONTHS);
    const outstanding = Math.max(totalRepayable - amountPaid, monthlyPayment);

    return { totalRepayable, monthlyPayment, totalInterest, monthsRemaining, outstanding };
  };

  const handleSelectLoan = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setView("detail");
  };

  const handleProceedToConfirm = () => {
    if (!selectedLoan) return;
    const { outstanding } = getLoanDetails(selectedLoan);
    if (balance < outstanding) {
      toast({
        title: "Insufficient Balance",
        description: `You need P${outstanding.toFixed(2)} in your wallet to make this payment.`,
        variant: "destructive",
      });
      return;
    }
    setView("confirm");
  };

  const handleConfirmRepayment = async () => {
    if (!selectedLoan || !acceptedTerms) return;
    setIsProcessing(true);
    setView("processing");

    await new Promise((r) => setTimeout(r, 2500));

    const { outstanding } = getLoanDetails(selectedLoan);

    // Deduct from wallet via transaction
    const result = await addTransaction({
      type: "loan_repayment",
      payment_method: "wallet",
      amount: -outstanding,
      description: `Loan Repayment • ${selectedLoan.business_name || "Business"} • ${selectedLoan.purpose}`,
      status: "completed",
    });

    if (result.error) {
      toast({ title: "Payment Failed", description: result.error, variant: "destructive" });
      setView("confirm");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
    setView("success");
  };

  const reset = () => {
    setView("list");
    setSelectedLoan(null);
    setAcceptedTerms(false);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => { if (!isOpen) reset(); }} dismissible={false}>
      <DrawerContent className="bg-background max-h-[92vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => view === "list" ? onClose() : setView(view === "confirm" ? "detail" : "list")}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <DrawerTitle className="text-foreground">
                {view === "list" ? "Repay Loan" : view === "detail" ? "Loan Details" : view === "confirm" ? "Confirm Repayment" : view === "success" ? "Payment Successful" : "Processing..."}
              </DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-5 pb-10 space-y-4">

          {/* LIST VIEW */}
          {view === "list" && (
            <>
              <div className="bg-muted rounded-2xl px-4 py-3 flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Wallet Balance</span>
                <span className="text-lg font-bold text-foreground">P{balance.toFixed(2)}</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : loans.length === 0 ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-foreground font-semibold mb-1">No active loans</p>
                  <p className="text-sm text-muted-foreground">You don't have any approved loans to repay.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Active Loans</p>
                  {loans.map((loan) => {
                    const { outstanding, monthsRemaining } = getLoanDetails(loan);
                    return (
                      <button
                        key={loan.id}
                        onClick={() => handleSelectLoan(loan)}
                        className="w-full bg-card rounded-2xl p-4 border border-border text-left active:bg-muted transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-foreground">P{loan.amount.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground capitalize">{loan.purpose}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium capitalize">
                            {loan.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-3">
                          <span className="text-muted-foreground">Outstanding</span>
                          <span className="text-foreground font-bold text-red-500">P{outstanding.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Months remaining</span>
                          <span className="text-foreground font-medium">{monthsRemaining}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* DETAIL VIEW */}
          {view === "detail" && selectedLoan && (() => {
            const { totalRepayable, monthlyPayment, totalInterest, monthsRemaining, outstanding } = getLoanDetails(selectedLoan);
            return (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <p className="font-semibold text-foreground text-lg border-b border-border pb-3">
                    Loan Summary
                  </p>
                  {[
                    { icon: TrendingDown, label: "Original Amount", value: `P${selectedLoan.amount.toLocaleString()}`, color: "text-primary" },
                    { icon: Percent, label: "Interest Rate", value: "15% per annum", color: "text-amber-500" },
                    { icon: Calendar, label: "Term", value: "12 months", color: "text-blue-500" },
                    { icon: Wallet, label: "Monthly Payment", value: `P${monthlyPayment.toFixed(2)}`, color: "text-green-500" },
                    { icon: TrendingDown, label: "Total Interest", value: `P${totalInterest.toFixed(2)}`, color: "text-red-500" },
                    { icon: TrendingDown, label: "Total Repayable", value: `P${totalRepayable.toFixed(2)}`, color: "text-foreground" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon className={`w-4 h-4 ${color}`} />
                        {label}
                      </div>
                      <span className={`font-semibold text-sm ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/10 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                      <p className="text-3xl font-bold text-red-500">P{outstanding.toFixed(2)}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{monthsRemaining} months left</p>
                      <p>Started {format(new Date(selectedLoan.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-2xl p-3 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Your wallet balance</span>
                  <span className={`font-semibold ${balance >= outstanding ? "text-green-500" : "text-red-500"}`}>
                    P{balance.toFixed(2)}
                  </span>
                </div>

                {balance < outstanding && (
                  <div className="flex items-start gap-2 bg-red-500/10 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600">
                      Insufficient wallet balance. Please top up your wallet before making a repayment.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleProceedToConfirm}
                  className="w-full h-12 font-semibold"
                  disabled={balance < outstanding}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Pay from Wallet
                </Button>
              </div>
            );
          })()}

          {/* CONFIRM VIEW */}
          {view === "confirm" && selectedLoan && (() => {
            const { outstanding } = getLoanDetails(selectedLoan);
            return (
              <div className="space-y-5">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
                  <p className="font-semibold text-foreground border-b border-border pb-3">Payment Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment method</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> Wallet
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loan purpose</span>
                    <span className="font-medium text-foreground capitalize">{selectedLoan.purpose}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                    <span className="text-foreground">Amount to deduct</span>
                    <span className="text-red-500">-P{outstanding.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining balance</span>
                    <span className="font-semibold text-foreground">P{(balance - outstanding).toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-muted rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    By confirming, you authorize Pata to deduct <strong className="text-foreground">P{outstanding.toFixed(2)}</strong> from your Pata wallet as a loan repayment. This action is final and cannot be reversed.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      I agree to the deduction and understand this reduces my outstanding loan balance.
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handleConfirmRepayment}
                  disabled={!acceptedTerms || isProcessing}
                  className="w-full h-12 font-semibold bg-red-500 hover:bg-red-600 text-white"
                >
                  Confirm Payment of P{outstanding.toFixed(2)}
                </Button>
              </div>
            );
          })()}

          {/* PROCESSING */}
          {view === "processing" && (
            <div className="flex flex-col items-center justify-center py-20 space-y-5">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Processing repayment...</p>
                <p className="text-sm text-muted-foreground mt-1">Pulling funds from your wallet</p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {view === "success" && selectedLoan && (() => {
            const { outstanding } = getLoanDetails(selectedLoan);
            return (
              <div className="flex flex-col items-center space-y-5 py-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground mb-1">Payment Successful!</p>
                  <p className="text-muted-foreground text-sm">Your loan repayment has been processed.</p>
                </div>
                <div className="w-full bg-card border border-border rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount paid</span>
                    <span className="font-bold text-foreground">P{outstanding.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid from</span>
                    <span className="font-medium text-foreground">Pata Wallet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{format(new Date(), "d MMM yyyy, h:mm a")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-2">
                    <span className="text-muted-foreground">New wallet balance</span>
                    <span className="font-bold text-foreground">P{(balance - outstanding).toFixed(2)}</span>
                  </div>
                </div>
                <Button onClick={reset} className="w-full h-12 font-semibold">Done</Button>
              </div>
            );
          })()}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileLoanRepaymentSheet;
