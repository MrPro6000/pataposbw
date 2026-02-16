import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Package, Users, TrendingUp, Calendar } from "lucide-react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, PieChart, Pie, Cell } from "recharts";
import MobileBottomNav from "./MobileBottomNav";
import PataLogo from "@/components/PataLogo";
import { useTransactions } from "@/hooks/useTransactions";
import { format, subDays, startOfDay, isAfter } from "date-fns";

interface MobileReportsViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

type Period = "today" | "week" | "month" | "year";

const MobileReportsView = ({ profile, userEmail }: MobileReportsViewProps) => {
  const { transactions, loading } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const periods: { id: Period; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
  ];

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let cutoff: Date;
    switch (selectedPeriod) {
      case "today": cutoff = startOfDay(now); break;
      case "week": cutoff = subDays(now, 7); break;
      case "month": cutoff = subDays(now, 30); break;
      case "year": cutoff = subDays(now, 365); break;
    }
    return transactions.filter(t => isAfter(new Date(t.created_at), cutoff));
  }, [transactions, selectedPeriod]);

  const revenue = filteredTransactions
    .filter(t => t.amount > 0 && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const itemsSold = filteredTransactions.filter(t => t.amount > 0 && t.status === "completed").length;

  const uniqueCustomers = new Set(
    filteredTransactions.filter(t => t.description).map(t => t.description)
  ).size || Math.min(itemsSold, Math.ceil(itemsSold * 0.7));

  const avgOrder = itemsSold > 0 ? Math.round(revenue / itemsSold) : 0;

  // Sales by day chart
  const salesByDate = useMemo(() => {
    const days = selectedPeriod === "today" ? 1 : selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 7 : 7;
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const dayTx = filteredTransactions.filter(t => {
        const txDate = new Date(t.created_at);
        return txDate.toDateString() === date.toDateString() && t.amount > 0 && t.status === "completed";
      });
      return {
        date: format(date, "EEE").charAt(0),
        sales: dayTx.reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [filteredTransactions, selectedPeriod]);

  // Payment methods breakdown
  const paymentMethods = useMemo(() => {
    const methods: Record<string, number> = {};
    filteredTransactions.filter(t => t.amount > 0).forEach(t => {
      const label = t.payment_method === "mobile_money" ? "Mobile Money" :
                    t.payment_method === "card" ? "Card" :
                    t.payment_method === "cash" ? "Cash" :
                    t.payment_method === "wallet" ? "Wallet" :
                    t.payment_method === "payment_link" ? "Payment Link" : "Other";
      methods[label] = (methods[label] || 0) + t.amount;
    });
    const total = Object.values(methods).reduce((s, v) => s + v, 0) || 1;
    const colors = {
      "Card": "hsl(var(--primary))",
      "Mobile Money": "hsl(45 93% 47%)",
      "Cash": "hsl(142 71% 45%)",
      "Wallet": "hsl(262 83% 58%)",
      "Payment Link": "hsl(200 70% 50%)",
      "Other": "hsl(var(--muted-foreground))",
    };
    return Object.entries(methods).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100),
      color: colors[name as keyof typeof colors] || "hsl(var(--muted-foreground))",
    }));
  }, [filteredTransactions]);

  const chartConfig = {
    sales: { label: "Sales", color: "hsl(var(--primary))" },
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <PataLogo className="h-5" />
          <div className="w-10" />
        </div>
      </header>

      {/* Period Selector */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedPeriod === period.id ? "bg-foreground text-background" : "bg-card text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="px-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Revenue</span>
                </div>
                <p className="text-xl font-bold text-foreground">P{revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Items Sold</span>
                </div>
                <p className="text-xl font-bold text-foreground">{itemsSold.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Customers</span>
                </div>
                <p className="text-xl font-bold text-foreground">{uniqueCustomers}</p>
              </div>
              <div className="bg-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Avg. Order</span>
                </div>
                <p className="text-xl font-bold text-foreground">P{avgOrder}</p>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="px-5 mb-4">
            <div className="bg-card rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-4">Sales by Day</p>
              <div className="h-32">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={salesByDate} barSize={20}>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          {paymentMethods.length > 0 && (
            <div className="px-5 mb-4">
              <div className="bg-card rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-4">Payment Methods</p>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <PieChart>
                        <Pie
                          data={paymentMethods}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={40}
                          dataKey="value"
                        >
                          {paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {paymentMethods.map((method) => (
                      <div key={method.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: method.color }} />
                          <span className="text-sm text-foreground">{method.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{method.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          <div className="px-5 mb-4">
            <h3 className="font-semibold text-foreground mb-3">Recent Sales</h3>
            <div className="space-y-2">
              {filteredTransactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="bg-card rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{tx.description || tx.payment_method}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "MMM d, h:mm a")}</p>
                  </div>
                  <p className={`font-semibold ${tx.amount < 0 ? "text-orange-500" : "text-foreground"}`}>
                    {tx.amount < 0 ? "-" : ""}P{Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <p className="text-center text-muted-foreground py-6">No transactions for this period</p>
              )}
            </div>
          </div>

          {/* Quick Reports */}
          <div className="px-5">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-card rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
                <p className="text-sm text-muted-foreground mb-auto">Product report</p>
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </button>
              <button className="bg-card rounded-2xl p-4 min-h-[100px] flex flex-col active:scale-98 transition-transform">
                <p className="text-sm text-muted-foreground mb-auto">Staff report</p>
                <Users className="w-8 h-8 text-muted-foreground/50" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileReportsView;
