import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Package, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";
import MobileAddProductSheet from "./MobileAddProductSheet";
import PataLogo from "@/components/PataLogo";

interface MobileProductsViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
}

const MobileProductsView = ({ profile, userEmail }: MobileProductsViewProps) => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to navigate back based on referrer
  const handleBack = () => {
    // Check if we came from a specific page via state
    const fromPage = location.state?.from;
    if (fromPage === "sales") {
      navigate("/dashboard/sales");
    } else {
      navigate("/dashboard");
    }
  };

  const products: Product[] = [
    { id: "1", name: "Cappuccino", price: 35, category: "Beverages", stock: 50, stockStatus: "in_stock" },
    { id: "2", name: "Espresso", price: 28, category: "Beverages", stock: 45, stockStatus: "in_stock" },
    { id: "3", name: "Avocado Toast", price: 65, category: "Food", stock: 8, stockStatus: "low_stock" },
    { id: "4", name: "Croissant", price: 25, category: "Bakery", stock: 0, stockStatus: "out_of_stock" },
    { id: "5", name: "Fresh Juice", price: 45, category: "Beverages", stock: 20, stockStatus: "in_stock" },
    { id: "6", name: "Sandwich", price: 55, category: "Food", stock: 12, stockStatus: "in_stock" },
    { id: "7", name: "Muffin", price: 30, category: "Bakery", stock: 3, stockStatus: "low_stock" },
  ];

  const stockCounts = {
    in_stock: products.filter(p => p.stockStatus === "in_stock").length,
    low_stock: products.filter(p => p.stockStatus === "low_stock").length,
    out_of_stock: products.filter(p => p.stockStatus === "out_of_stock").length,
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "in_stock": return "text-green-500";
      case "low_stock": return "text-orange-500";
      case "out_of_stock": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "in_stock": return { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", label: "In Stock" };
      case "low_stock": return { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", label: "Low Stock" };
      case "out_of_stock": return { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", label: "Out of Stock" };
      default: return { bg: "bg-muted", text: "text-muted-foreground", label: "Unknown" };
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <PataLogo className="h-5" />
          <button 
            onClick={() => setAddProductOpen(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search products..."
            className="pl-10 bg-card border-0 rounded-xl"
          />
        </div>
      </div>

      {/* Stock Summary */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-3 text-center">
            <p className={`text-lg font-bold ${getStockColor("out_of_stock")}`}>{stockCounts.out_of_stock}</p>
            <p className="text-xs text-muted-foreground">Out of stock</p>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center">
            <p className={`text-lg font-bold ${getStockColor("low_stock")}`}>{stockCounts.low_stock}</p>
            <p className="text-xs text-muted-foreground">Low stock</p>
          </div>
          <div className="bg-card rounded-2xl p-3 text-center">
            <p className={`text-lg font-bold ${getStockColor("in_stock")}`}>{stockCounts.in_stock}</p>
            <p className="text-xs text-muted-foreground">In stock</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All", "Beverages", "Food", "Bakery"].map((category, i) => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                i === 0 ? "bg-foreground text-background" : "bg-card text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="px-5">
        <div className="space-y-3">
          {products.map((product) => {
            const badge = getStockBadge(product.stockStatus);
            return (
              <div key={product.id} className="bg-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">P{product.price}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Product Card */}
        <button 
          onClick={() => setAddProductOpen(true)}
          className="w-full mt-4 border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 active:border-primary active:bg-primary/5 transition-colors"
        >
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <span className="text-muted-foreground font-medium">Add Product</span>
        </button>
      </div>

      {/* Add Product Sheet */}
      <MobileAddProductSheet
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileProductsView;
