import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  Download, 
  Calendar,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const salesByDate = [
  { date: "Jan 22", sales: 4500 },
  { date: "Jan 23", sales: 5200 },
  { date: "Jan 24", sales: 4800 },
  { date: "Jan 25", sales: 6100 },
  { date: "Jan 26", sales: 5500 },
  { date: "Jan 27", sales: 7200 },
  { date: "Jan 28", sales: 6800 },
];

const salesByProduct = [
  { name: "Cappuccino", sales: 245, revenue: 8575 },
  { name: "Espresso", sales: 189, revenue: 5292 },
  { name: "Avocado Toast", sales: 156, revenue: 10140 },
  { name: "Croissant", sales: 134, revenue: 3350 },
  { name: "Fresh Juice", sales: 98, revenue: 4410 },
];

const paymentMethods = [
  { name: "Card", value: 65, color: "#00C8E6" },
  { name: "Tap to Pay", value: 25, color: "#141414" },
  { name: "Online", value: 10, color: "#9333EA" },
];

const Reports = () => {
  const [dateRange, setDateRange] = useState("week");

  const chartConfig = {
    sales: { label: "Sales", color: "#00C8E6" },
    revenue: { label: "Revenue", color: "#141414" },
  };

  const handleExport = (type: string) => {
    // Mock export functionality
    alert(`Exporting ${type} report...`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Reports & Analytics</h1>
          <p className="text-[#141414]/60">Insights into your business performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport('PDF')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00C8E6]" />
            <span className="text-sm text-[#141414]/60">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#141414]">R67,890</p>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-[#00C8E6]" />
            <span className="text-sm text-[#141414]/60">Items Sold</span>
          </div>
          <p className="text-2xl font-bold text-[#141414]">1,247</p>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#00C8E6]" />
            <span className="text-sm text-[#141414]/60">Customers</span>
          </div>
          <p className="text-2xl font-bold text-[#141414]">342</p>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00C8E6]" />
            <span className="text-sm text-[#141414]/60">Avg. Order</span>
          </div>
          <p className="text-2xl font-bold text-[#141414]">R198</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sales by Date */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#141414]">Sales by Date</h2>
            <Button variant="ghost" size="sm" onClick={() => handleExport('sales-csv')}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={salesByDate}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
                tickFormatter={(value) => `R${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sales" fill="#00C8E6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#141414] mb-4">Payment Methods</h2>
          <div className="flex items-center">
            <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex-1 space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                    <span className="text-[#141414]">{method.name}</span>
                  </div>
                  <span className="font-semibold text-[#141414]">{method.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#f0f0f0] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#141414]">Top Products</h2>
          <Button variant="ghost" size="sm" onClick={() => handleExport('products-csv')}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F6F6]">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Product</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Units Sold</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">Revenue</th>
                <th className="text-left p-4 text-sm font-medium text-[#141414]/60">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {salesByProduct.map((product, index) => (
                <tr key={product.name} className="border-t border-[#f0f0f0]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#00C8E6]/20 rounded-full flex items-center justify-center text-xs font-medium text-[#00C8E6]">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#141414]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#141414]">{product.sales}</td>
                  <td className="p-4 font-semibold text-[#141414]">R{product.revenue.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00C8E6]" 
                          style={{ width: `${(product.revenue / salesByProduct[0].revenue) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#141414]/60">
                        {Math.round((product.revenue / salesByProduct.reduce((a, b) => a + b.revenue, 0)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
