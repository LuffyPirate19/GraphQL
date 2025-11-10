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
      className="group cursor-pointer overflow-hidden border-border hover-lift transition-all duration-300 bg-card"
      onClick={() => navigate(`/products/${id}`)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img 
            src={image || "/placeholder.svg"} 
            alt={name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {!inStock && (
            <Badge className="absolute left-3 top-3 bg-destructive animate-scale-in">
              Out of Stock
            </Badge>
          )}
          {category && (
            <Badge className="absolute right-3 top-3 bg-background/95 backdrop-blur-sm border border-border/50 shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              {category}
            </Badge>
          )}
          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <Button 
              variant="secondary" 
              size="sm"
              className="shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${id}`);
              }}
            >
              Quick View
            </Button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
            <div className="flex items-center gap-1 text-sm bg-primary/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-2 p-5 pt-0 border-t border-border/50">
        <div>
          <span className="text-2xl font-bold gradient-text">₹{price.toFixed(2)}</span>
        </div>
        <Button 
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="gap-2 relative hover:scale-105 transition-transform duration-200"
          variant={isInCart ? "default" : "outline"}
        >
          <ShoppingCart className={`h-4 w-4 transition-transform ${isInCart ? 'scale-110' : ''}`} />
          <span className="font-semibold">{isInCart ? `In Cart (${cartQuantity})` : "Add"}</span>
          {isInCart && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary shadow-lg animate-pulse-glow">
              ✓
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
