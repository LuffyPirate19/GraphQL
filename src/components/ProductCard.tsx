import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@/hooks/use-graphql";
import { ADD_TO_CART } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { getProductImage } from "@/utils/productImages";

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
      className="group cursor-pointer overflow-hidden border-border/50 card-hover bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-2xl"
      onClick={() => navigate(`/products/${id}`)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 shine">
          <img 
            src={getProductImage(name, category, image)} 
            alt={name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:brightness-110 group-hover:rotate-1"
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x800/4A90E2/FFFFFF?text=" + encodeURIComponent(name.substring(0, 15));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          {!inStock && (
            <Badge className="absolute left-3 top-3 bg-destructive/90 backdrop-blur-sm shadow-lg animate-bounce-slow z-10">
              Out of Stock
            </Badge>
          )}
          {category && (
            <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground backdrop-blur-md border-2 border-primary-foreground/20 shadow-xl font-bold group-hover:bg-primary-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300 z-10 px-3 py-1">
              {category}
            </Badge>
          )}
          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-[2px]">
            <Button 
              variant="secondary" 
              size="sm"
              className="shadow-2xl glow transform scale-90 group-hover:scale-100 transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${id}`);
              }}
            >
              Quick View
            </Button>
          </div>
          {/* Floating rating badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
            <Star className="h-3.5 w-3.5 fill-primary text-primary animate-pulse-glow" />
            <span className="text-xs font-bold text-foreground">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 text-gradient-animated">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-3 p-5 pt-0 border-t border-border/30 bg-gradient-to-br from-card/50 to-muted/20">
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold text-gradient-animated">₹{price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">per unit</span>
        </div>
        <Button 
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="gap-2 relative hover:scale-110 transition-all duration-300 glow group/btn"
          variant={isInCart ? "default" : "outline"}
        >
          <ShoppingCart className={`h-4 w-4 transition-all duration-300 ${isInCart ? 'scale-125 rotate-12' : 'group-hover/btn:scale-110 group-hover/btn:-rotate-12'}`} />
          <span className="font-semibold">{isInCart ? `In Cart (${cartQuantity})` : "Add to Cart"}</span>
          {isInCart && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary shadow-xl animate-pulse-glow ring-2 ring-primary/30">
              ✓
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
