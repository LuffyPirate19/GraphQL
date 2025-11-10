import { useQuery } from "@/hooks/use-graphql";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import { Package, Truck, Shield } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Fetch featured products (first 4 products sorted by rating)
  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      limit: 4,
      offset: 0,
      sort: { sortBy: "rating_desc" },
    },
  });

  const featuredProducts =
    data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description,
      price: parseFloat(edge.node.price),
      image: edge.node.image || edge.node.images?.[0] || "/placeholder.svg",
      category: edge.node.category?.name,
      rating: edge.node.rating || 0,
      inStock: edge.node.inStock,
    })) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Discover Amazing
                <span className="block bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
              <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl lg:text-2xl animate-slide-in" style={{ animationDelay: '0.2s' }}>
                Shop the latest trends with unbeatable prices. Fast shipping, secure checkout, and exceptional customer service.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/products")}
                  className="gap-2 hover-lift text-base px-8 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm text-base px-8 py-6 h-auto font-semibold transition-all"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group border-none shadow-lg bg-card hover-lift transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 w-10 text-primary transition-transform group-hover:rotate-12" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">Quality Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Carefully curated selection of premium items
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-lg bg-card hover-lift transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="h-10 w-10 text-primary transition-transform group-hover:translate-x-1" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">Fast Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Free delivery on orders over ₹500
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-none shadow-lg bg-card hover-lift transition-all duration-300 hover:shadow-xl">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">Secure Checkout</h3>
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-4 text-4xl font-bold gradient-text">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Check out our most popular items</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/products")}
                  className="hover-lift px-8 py-6 h-auto text-base font-semibold"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
