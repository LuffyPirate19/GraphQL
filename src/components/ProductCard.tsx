import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
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
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1
    });
    toast.success("Added to cart");
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
        <span className="text-2xl font-bold">${price.toFixed(2)}</span>
        <Button 
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
