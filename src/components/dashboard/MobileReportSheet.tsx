import { X, ChevronLeft, Package, Users, TrendingUp, BarChart3 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MobileReportSheetProps {
  open: boolean;
  onClose: () => void;
  reportType: "product" | "staff" | "revenue";
}

const MobileReportSheet = ({ open, onClose, reportType }: MobileReportSheetProps) => {
  const productData = [
    { name: "Coffee", sales: 45, revenue: 225 },
    { name: "Sandwich", sales: 32, revenue: 480 },
    { name: "Pastry", sales: 28, revenue: 140 },
    { name: "Juice", sales: 22, revenue: 110 },
    { name: "Salad", sales: 18, revenue: 270 },
  ];

  const staffData = [
    { name: "John D.", transactions: 45, revenue: 2250 },
    { name: "Mary S.", transactions: 38, revenue: 1900 },
    { name: "Peter M.", transactions: 32, revenue: 1600 },
    { name: "Alice K.", transactions: 28, revenue: 1400 },
  ];

  const revenueData = [
    { day: "Mon", amount: 1200 },
    { day: "Tue", amount: 1450 },
    { day: "Wed", amount: 980 },
    { day: "Thu", amount: 1680 },
    { day: "Fri", amount: 2100 },
    { day: "Sat", amount: 2450 },
    { day: "Sun", amount: 1890 },
  ];

  const chartConfig = {
    sales: { label: "Sales", color: "#00C8E6" },
    revenue: { label: "Revenue", color: "#00C8E6" },
    transactions: { label: "Transactions", color: "#00C8E6" },
    amount: { label: "Amount", color: "#00C8E6" },
  };

  const getTitle = () => {
    switch (reportType) {
      case "product": return "Product Report";
      case "staff": return "Staff Report";
      case "revenue": return "Revenue Report";
    }
  };

  const getIcon = () => {
    switch (reportType) {
      case "product": return Package;
      case "staff": return Users;
      case "revenue": return TrendingUp;
    }
  };

  const Icon = getIcon();

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="bg-white max-h-[90vh]">
        <DrawerHeader className="border-b border-[#E8E8E8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 text-[#141414]" />
                </button>
              </DrawerClose>
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-[#00C8E6]" />
                <DrawerTitle className="text-[#141414]">{getTitle()}</DrawerTitle>
              </div>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-5 overflow-y-auto pb-10">
          {/* Time Period Selector */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
            {["Today", "This Week", "This Month", "Custom"].map((period) => (
              <button
                key={period}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  period === "This Week"
                    ? "bg-[#00C8E6] text-[#141414]"
                    : "bg-[#F5F5F5] text-[#141414]/60"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {reportType === "product" && (
            <>
              {/* Product Chart */}
              <div className="bg-[#F5F5F5] rounded-2xl p-4 mb-5">
                <h3 className="font-medium text-[#141414] mb-3">Top Products by Sales</h3>
                <div className="h-48">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={productData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#00C8E6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Product List */}
              <h3 className="font-medium text-[#141414] mb-3">All Products</h3>
              <div className="space-y-3">
                {productData.map((product) => (
                  <div key={product.name} className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#141414]">{product.name}</p>
                      <p className="text-sm text-[#141414]/60">{product.sales} units sold</p>
                    </div>
                    <p className="font-bold text-[#141414]">P{product.revenue}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {reportType === "staff" && (
            <>
              {/* Staff Summary */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <p className="text-sm text-[#141414]/60">Total Staff</p>
                  <p className="text-2xl font-bold text-[#141414]">{staffData.length}</p>
                </div>
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <p className="text-sm text-[#141414]/60">Total Sales</p>
                  <p className="text-2xl font-bold text-[#141414]">
                    P{staffData.reduce((acc, s) => acc + s.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Staff List */}
              <h3 className="font-medium text-[#141414] mb-3">Staff Performance</h3>
              <div className="space-y-3">
                {staffData.map((staff, index) => (
                  <div key={staff.name} className="bg-[#F5F5F5] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00C8E6] rounded-xl flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="font-medium text-[#141414]">{staff.name}</p>
                      </div>
                      <p className="font-bold text-[#141414]">P{staff.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-sm text-[#141414]/60">
                      <span>{staff.transactions} transactions</span>
                      <span>Avg: P{Math.round(staff.revenue / staff.transactions)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {reportType === "revenue" && (
            <>
              {/* Revenue Summary */}
              <div className="bg-gradient-to-br from-[#00C8E6] to-[#00b8d4] rounded-2xl p-5 mb-5 text-center">
                <p className="text-white/80 text-sm mb-1">Total Revenue (This Week)</p>
                <p className="text-3xl font-bold text-white">
                  P{revenueData.reduce((acc, d) => acc + d.amount, 0).toLocaleString()}
                </p>
              </div>

              {/* Revenue Chart */}
              <div className="bg-[#F5F5F5] rounded-2xl p-4 mb-5">
                <h3 className="font-medium text-[#141414] mb-3">Daily Revenue</h3>
                <div className="h-48">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#00C8E6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Daily Breakdown */}
              <h3 className="font-medium text-[#141414] mb-3">Daily Breakdown</h3>
              <div className="space-y-2">
                {revenueData.map((day) => (
                  <div key={day.day} className="flex items-center justify-between p-3 bg-[#F5F5F5] rounded-xl">
                    <span className="text-[#141414]">{day.day}</span>
                    <span className="font-bold text-[#141414]">P{day.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileReportSheet;
