import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@/hooks/use-graphql";
import { ShoppingCart, Star, Minus, Plus, Heart, Share2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { GET_PRODUCT } from "@/lib/graphql/queries";
import { ADD_TO_CART } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { getProductImages } from "@/utils/productImages";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Check if product is in cart
  const cartItem = items.find(item => item.id === id);
  const isInCart = cartItem !== undefined;
  const cartQuantity = cartItem?.quantity || 0;

  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  const { mutate: addToCartMutation, loading: addingToCart } = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      toast.success("Added to cart");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });

  const product = data?.product;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Add to local cart state
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || product.images?.[0] || "/placeholder.svg",
        quantity,
      });

      // Also add to server cart if authenticated
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await addToCartMutation({
            productId: product.id,
            quantity,
          });
        } catch (error) {
          // Error already handled by onError
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
        toast.success("Shared successfully");
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-destructive">
            {error ? `Error: ${error.message}` : "Product not found"}
          </p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = getProductImages(
    product.name,
    product.category?.name,
    product.images && product.images.length > 0 
      ? product.images 
      : product.image 
      ? [product.image] 
      : undefined
  );

  const reviews = product.reviews?.edges?.map((edge: any) => edge.node) || [];

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
                src={images[selectedImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x800/4A90E2/FFFFFF?text=" + encodeURIComponent(product.name.substring(0, 15));
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`aspect-square cursor-pointer overflow-hidden rounded-lg border transition-all ${
                      selectedImageIndex === idx
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-110"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=" + encodeURIComponent(product.name.substring(0, 10));
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category?.name || "Uncategorized"}</Badge>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-semibold">{product.rating?.toFixed(1) || "0.0"}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviewCount || 0} reviews
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-4xl font-bold">₹{parseFloat(product.price).toFixed(2)}</p>
              {product.inStock ? (
                <Badge variant="outline" className="border-primary text-primary">
                  In Stock ({product.stockQuantity || 0} available)
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.description || "No description available."}</p>

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
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 999, quantity + 1))}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2 relative"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                  variant={isInCart ? "default" : "default"}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart 
                    ? "Adding..." 
                    : isInCart 
                      ? `In Cart (${cartQuantity})` 
                      : "Add to Cart"}
                  {isInCart && !addingToCart && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs font-bold text-primary shadow-md">
                      ✓
                    </span>
                  )}
                </Button>
                <Button variant="outline" size="lg" onClick={() => toast.info("Wishlist feature coming soon")}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Shipping</span>
                <span className="font-medium">On orders over ₹500</span>
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
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-muted-foreground">
                {product.description || "No additional details available."}
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-border pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.user?.name || "Anonymous"}</span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over ₹500. Standard delivery takes 2-3 business days.
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
