import { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";
import { 
  Download, 
  CalendarIcon,
  TrendingUp,
  Package,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [dateRange, setDateRange] = useState("week");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();
  const { transactions } = useTransactions();
  const { products } = useProducts();

  if (isMobile) {
    return <MobileDashboardHome />;
  }

  // Filter transactions by date range
  const now = new Date();
  let rangeStart: Date;
  let rangeEnd: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  if (dateRange === "custom" && customDate) {
    rangeStart = new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate());
    rangeEnd = new Date(rangeStart); rangeEnd.setDate(rangeEnd.getDate() + 1);
  } else {
    switch (dateRange) {
      case "today": rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
      case "month": rangeStart = new Date(now.getFullYear(), now.getMonth(), 1); break;
      case "year": rangeStart = new Date(now.getFullYear(), 0, 1); break;
      default: rangeStart = new Date(now); rangeStart.setDate(rangeStart.getDate() - 7);
    }
  }

  const filteredTx = transactions.filter(t => t.amount > 0 && t.status === "completed" && new Date(t.created_at) >= rangeStart && new Date(t.created_at) < rangeEnd);
  const totalRevenue = filteredTx.reduce((s, t) => s + t.amount, 0);
  const totalTxCount = filteredTx.length;
  const avgOrder = totalTxCount > 0 ? totalRevenue / totalTxCount : 0;

  // Sales by date (last 7 days)
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const salesByDate = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
    const dayTotal = transactions
      .filter(t => t.amount > 0 && t.status === "completed" && new Date(t.created_at) >= dayStart && new Date(t.created_at) < dayEnd)
      .reduce((s, t) => s + t.amount, 0);
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, sales: dayTotal };
  });

  // Payment methods breakdown
  const methodTotals: Record<string, number> = {};
  filteredTx.forEach(t => {
    const m = t.payment_method || "other";
    methodTotals[m] = (methodTotals[m] || 0) + t.amount;
  });
  const methodColors: Record<string, string> = { card: "#0066FF", mobile_money: "#F97316", cash: "#22C55E", wallet: "#8B5CF6", tap: "#6B7280", qr: "#EC4899", other: "#94A3B8" };
  const paymentMethods = Object.entries(methodTotals).map(([name, value]) => ({
    name: name.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
    value: totalRevenue > 0 ? Math.round((value / totalRevenue) * 100) : 0,
    color: methodColors[name] || "#94A3B8",
  }));

  const chartConfig = {
    sales: { label: "Sales", color: "#0066FF" },
    revenue: { label: "Revenue", color: "hsl(var(--foreground))" },
  };

  const handleExport = (type: string) => {
    const csv = ["Date,Type,Amount,Status,Description"]
      .concat(filteredTx.map(t => `${t.created_at},${t.type},${t.amount},${t.status},${t.description || ""}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${dateRange}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Insights into your business performance</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={dateRange} onValueChange={(v) => { setDateRange(v); if (v !== "custom") setCustomDate(undefined); }}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Day</SelectItem>
            </SelectContent>
          </Select>
          {dateRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !customDate && "text-muted-foreground")}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {customDate ? format(customDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          )}
          <Button onClick={() => handleExport('csv')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">P{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalTxCount}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Products</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Avg. Order</span>
          </div>
          <p className="text-2xl font-bold text-foreground">P{avgOrder.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Sales by Date</h2>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={salesByDate}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `P${value}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sales" fill="#0066FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h2>
          {paymentMethods.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">No data yet</div>
          ) : (
            <div className="flex items-center">
              <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex-1 space-y-2">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                      <span className="text-foreground text-sm">{method.name}</span>
                    </div>
                    <span className="font-semibold text-foreground text-sm">{method.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
