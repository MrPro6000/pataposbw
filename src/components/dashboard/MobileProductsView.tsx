import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Plus, Package, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";
import MobileAddProductSheet from "./MobileAddProductSheet";
import PataLogo from "@/components/PataLogo";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

interface MobileProductsViewProps {
  profile: { full_name: string | null; business_name: string | null } | null;
  userEmail?: string;
}

const MobileProductsView = ({ profile, userEmail }: MobileProductsViewProps) => {
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, deleteProduct } = useProducts();

  const handleBack = () => {
    const fromPage = location.state?.from;
    if (fromPage === "sales") {
      navigate("/dashboard/sales");
    } else {
      navigate("/dashboard");
    }
  };

  const allCategories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stockCounts = {
    in_stock: products.filter(p => p.stock_status === "in_stock").length,
    low_stock: products.filter(p => p.stock_status === "low_stock").length,
    out_of_stock: products.filter(p => p.stock_status === "out_of_stock").length,
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

  const handleDelete = async (id: string, name: string) => {
    const result = await deleteProduct(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${name} removed`);
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      <header className="bg-background px-5 pt-4 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <PataLogo className="h-5" />
          <button onClick={() => setAddProductOpen(true)} className="w-10 h-10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card border-0 rounded-xl" />
        </div>
      </div>

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

      {allCategories.length > 1 && (
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category ? "bg-foreground text-background" : "bg-card text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-5">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const badge = getStockBadge(product.stock_status);
              return (
                <div key={product.id} className="bg-card rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category} • Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-bold text-foreground">P{product.price.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(product.id, product.name)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:bg-destructive/10">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No products yet</p>
                <p className="text-sm text-muted-foreground/70">Add your first product above</p>
              </div>
            )}
          </div>
        )}

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

      <MobileAddProductSheet open={addProductOpen} onClose={() => setAddProductOpen(false)} />
      <MobileBottomNav />
    </div>
  );
};

export default MobileProductsView;
