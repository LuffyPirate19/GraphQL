import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@/hooks/use-graphql";
import { ADD_TO_CART } from "@/lib/graphql/mutations";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
}

const ProductCard = ({ 
  id, 
  name, 
  description, 
  price, 
  image, 
  category,
  inStock = true,
  rating = 4.5 
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  
  // Check if product is in cart
  const cartItem = items.find(item => item.id === id);
  const isInCart = cartItem !== undefined;
  const cartQuantity = cartItem?.quantity || 0;
  
  // Mutation for server cart sync
  const { mutate: addToCartMutation } = useMutation(ADD_TO_CART, {
    onError: (error) => {
      // Error already handled, but don't show toast to avoid spam
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Add to local cart state
      addItem({
        id,
        name,
        price,
        image,
        quantity: 1
      });
      
      // Also add to server cart if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await addToCartMutation({
            productId: id,
            quantity: 1,
          });
        } catch (error) {
          // Error already handled by onError
        }
      }
      
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border transition-all duration-300 hover:shadow-lg"
      onClick={() => navigate(`/products/${id}`)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={image || "/placeholder.svg"} 
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!inStock && (
            <Badge className="absolute left-3 top-3 bg-destructive">
              Out of Stock
            </Badge>
          )}
          {category && (
            <Badge className="absolute right-3 top-3 bg-background/90">
              {category}
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{rating}</span>
            </div>
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-2 p-4 pt-0">
        <span className="text-2xl font-bold">₹{price.toFixed(2)}</span>
        <Button 
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="gap-2 relative"
          variant={isInCart ? "default" : "outline"}
        >
          <ShoppingCart className="h-4 w-4" />
          {isInCart ? `In Cart (${cartQuantity})` : "Add"}
          {isInCart && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary shadow-md">
              ✓
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
