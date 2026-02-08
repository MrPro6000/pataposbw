import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartButton = () => {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5 text-foreground" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
