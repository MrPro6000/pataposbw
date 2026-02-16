import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileDashboardHome from "@/components/dashboard/MobileDashboardHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProducts } from "@/hooks/useProducts";
import { 
  Search, 
  Plus, 
  Package,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = ["Beverages", "Bakery", "Food", "Snacks", "Other"];

const Products = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", category: "", stock: "" });
  const isMobile = useIsMobile();
  const { toast } = useToast();

  if (isMobile) {
    return <MobileDashboardHome />;
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => { setFormData({ name: "", price: "", category: "", stock: "" }); setEditingProductId(null); setIsAddModalOpen(true); };
  const handleOpenEditModal = (product: typeof products[0]) => { setFormData({ name: product.name, price: product.price.toString(), category: product.category, stock: product.stock.toString() }); setEditingProductId(product.id); setIsAddModalOpen(true); };
  
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) return;
    if (editingProductId) {
      const { error } = await updateProduct(editingProductId, { name: formData.name, price: parseFloat(formData.price), category: formData.category, stock: parseInt(formData.stock) || 0, stock_status: (parseInt(formData.stock) || 0) === 0 ? "out_of_stock" : "in_stock" });
      if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
      toast({ title: "Product updated" });
    } else {
      const { error } = await addProduct({ name: formData.name, price: parseFloat(formData.price), category: formData.category, stock: parseInt(formData.stock) || 0 });
      if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
      toast({ title: "Product added" });
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await deleteProduct(id);
    if (error) { toast({ title: "Error", description: error, variant: "destructive" }); return; }
    toast({ title: "Product deleted" });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground mb-1">No products yet</h3>
          <p className="text-muted-foreground mb-4">Add your first product to start selling</p>
          <Button onClick={handleOpenAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 hover:bg-muted rounded-lg">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border">
                    <DropdownMenuItem onClick={() => handleOpenEditModal(product)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-foreground">P{product.price.toFixed(2)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="name">Product Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Cappuccino" /></div>
            <div className="space-y-2"><Label htmlFor="price">Price (P)</Label><Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" /></div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="stock">Stock Quantity</Label><Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct} className="bg-primary hover:bg-primary/90 text-primary-foreground">{editingProductId ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
