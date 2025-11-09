import { ArrowRight, Package, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Mock featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "High-quality sound with active noise cancellation",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      category: "Electronics",
      rating: 4.8
    },
    {
      id: "2",
      name: "Smart Watch Pro",
      description: "Track your fitness and stay connected",
      price: 399.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      category: "Wearables",
      rating: 4.6
    },
    {
      id: "3",
      name: "Designer Backpack",
      description: "Stylish and functional for everyday use",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      category: "Fashion",
      rating: 4.7
    },
    {
      id: "4",
      name: "Minimalist Desk Lamp",
      description: "Modern lighting for your workspace",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
      category: "Home",
      rating: 4.5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover Amazing Products
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Shop the latest trends with unbeatable prices. Fast shipping, secure checkout, and exceptional customer service.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/products")}
                className="gap-2"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border bg-muted/50 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Quality Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Carefully curated selection of premium items
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Free delivery on orders over $50
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Secure Checkout</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is always protected
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">Check out our most popular items</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/products")}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
