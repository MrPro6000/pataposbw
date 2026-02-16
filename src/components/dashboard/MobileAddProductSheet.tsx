import { useState } from "react";
import { X, Package, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

interface MobileAddProductSheetProps {
  open: boolean;
  onClose: () => void;
}

const categories = ["Beverages", "Food", "Bakery", "Electronics", "Clothing", "Other"];

const MobileAddProductSheet = ({ open, onClose }: MobileAddProductSheetProps) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addProduct } = useProducts();

  const handleSubmit = async () => {
    if (!productName || !price || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in product name, price, and category",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await addProduct({
      name: productName,
      price: parseFloat(price),
      category,
      stock: stock ? parseInt(stock) : 0,
    });
    setIsSubmitting(false);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Product added",
      description: `${productName} has been added to your inventory`,
    });

    setProductName("");
    setPrice("");
    setCategory("");
    setStock("");
    setSku("");
    onClose();
  };

  const resetAndClose = () => {
    setProductName("");
    setPrice("");
    setCategory("");
    setStock("");
    setSku("");
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && resetAndClose()}>
      <DrawerContent className="bg-background max-h-[95vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <DrawerTitle className="text-foreground">Add Product</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-muted rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border mb-2">
              <Camera className="w-8 h-8 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add Photo</span>
            </div>
            <button className="flex items-center gap-2 text-primary text-sm font-medium">
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-name" className="text-foreground">Product Name *</Label>
            <Input id="product-name" placeholder="e.g. Cappuccino" value={productName} onChange={(e) => setProductName(e.target.value)} className="h-12 bg-muted border-0 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">Price (P) *</Label>
            <Input id="price" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 bg-muted border-0 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 bg-muted border-0 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-foreground">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-foreground">Stock Quantity</Label>
            <Input id="stock" type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} className="h-12 bg-muted border-0 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku" className="text-foreground">SKU (Optional)</Label>
            <Input id="sku" placeholder="e.g. BEV-CAP-001" value={sku} onChange={(e) => setSku(e.target.value)} className="h-12 bg-muted border-0 rounded-xl" />
          </div>
        </div>

        <div className="p-4 border-t border-border bg-background">
          <Button onClick={handleSubmit} disabled={isSubmitting || !productName || !price || !category} className="w-full h-14 font-semibold text-lg">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                Adding...
              </div>
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileAddProductSheet;
