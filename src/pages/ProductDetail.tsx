import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Minus, Plus, Heart, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const product = {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort padding.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop"
    ],
    category: "Electronics",
    inStock: true,
    rating: 4.8,
    reviews: 127
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-6 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square cursor-pointer overflow-hidden rounded-lg border border-border bg-muted transition-all hover:border-primary"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviews} reviews
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
              {product.inStock ? (
                <Badge variant="outline" className="border-primary text-primary">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Shipping</span>
                <span className="font-medium">On orders over $50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">2-3 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returns</span>
                <span className="font-medium">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-muted-foreground">
                {product.description}
              </p>
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>Premium build quality</li>
                <li>Long-lasting battery life</li>
                <li>Comfortable for extended wear</li>
                <li>Advanced features and connectivity</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <p className="text-muted-foreground">Reviews content coming soon...</p>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Standard delivery takes 2-3 business days.
                Express shipping available at checkout.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
