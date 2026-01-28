import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "active" | "inactive";
}

const initialProducts: Product[] = [
  { id: "PRD001", name: "Espresso", price: 28.00, category: "Beverages", stock: 999, status: "active" },
  { id: "PRD002", name: "Cappuccino", price: 35.00, category: "Beverages", stock: 999, status: "active" },
  { id: "PRD003", name: "Croissant", price: 25.00, category: "Bakery", stock: 24, status: "active" },
  { id: "PRD004", name: "Avocado Toast", price: 65.00, category: "Food", stock: 15, status: "active" },
  { id: "PRD005", name: "Fresh Juice", price: 45.00, category: "Beverages", stock: 50, status: "active" },
  { id: "PRD006", name: "Muffin", price: 22.00, category: "Bakery", stock: 0, status: "inactive" },
];

const categories = ["Beverages", "Bakery", "Food", "Snacks", "Other"];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setFormData({ name: "", price: "", category: "", stock: "" });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
    });
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.category) return;

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name, price: parseFloat(formData.price), category: formData.category, stock: parseInt(formData.stock) || 0 }
          : p
      ));
    } else {
      const newProduct: Product = {
        id: `PRD${String(products.length + 1).padStart(3, '0')}`,
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        status: "active",
      };
      setProducts([...products, newProduct]);
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Products</h1>
          <p className="text-[#141414]/60">Manage your product catalog</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141414]/40" />
          <Input 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#00C8E6]/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#00C8E6]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-[#f0f0f0] rounded-lg">
                    <MoreVertical className="w-4 h-4 text-[#141414]/60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => handleOpenEditModal(product)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h3 className="font-semibold text-[#141414] mb-1">{product.name}</h3>
            <p className="text-sm text-[#141414]/60 mb-3">{product.category}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[#141414]">P{product.price.toFixed(2)}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cappuccino"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (P)</Label>
              <Input 
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input 
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct} className="bg-[#00C8E6] hover:bg-[#00b8d4] text-[#141414]">
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
