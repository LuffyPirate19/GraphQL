import { useQuery } from "@/hooks/use-graphql";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import { Package, Truck, Shield } from "lucide-react";
import { getProductImage } from "@/utils/productImages";

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
      image: getProductImage(
        edge.node.name,
        edge.node.category?.name,
        edge.node.image || edge.node.images?.[0]
      ),
      category: edge.node.category?.name,
      rating: edge.node.rating || 0,
      inStock: edge.node.inStock,
    })) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg-animated text-primary-foreground min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-foreground/20 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-foreground/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container relative py-24 md:py-32 z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Discover Amazing
                <span className="block text-gradient-animated bg-clip-text text-transparent mt-2">
                  Products
                </span>
              </h1>
              <p className="mb-10 text-xl text-primary-foreground/95 md:text-2xl lg:text-3xl animate-slide-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Shop the latest trends with unbeatable prices. Fast shipping, secure checkout, and exceptional customer service.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/products")}
                  className="gap-2 hover-lift text-lg px-10 py-7 h-auto font-bold shadow-2xl hover:shadow-3xl transition-all glow group"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 backdrop-blur-md text-lg px-10 py-7 h-auto font-bold transition-all shadow-lg hover:shadow-xl"
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
      <section className="border-b border-border/50 bg-gradient-to-b from-background via-muted/30 to-background py-24">
        <div className="container">
          <div className="mb-16 text-center animate-fade-in">
            <h2 className="text-4xl font-extrabold text-gradient-animated mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg">Experience the difference</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group border-border/50 shadow-xl bg-card/80 backdrop-blur-sm card-hover overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="flex flex-col items-center gap-6 p-10 text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg glow">
                  <Package className="h-12 w-12 text-primary transition-transform group-hover:rotate-12" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gradient-animated">Quality Products</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Carefully curated selection of premium items
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-xl bg-card/80 backdrop-blur-sm card-hover overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="flex flex-col items-center gap-6 p-10 text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg glow">
                  <Truck className="h-12 w-12 text-primary transition-transform group-hover:translate-x-2" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gradient-animated">Fast Shipping</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Free delivery on orders over ₹500
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-border/50 shadow-xl bg-card/80 backdrop-blur-sm card-hover overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="flex flex-col items-center gap-6 p-10 text-center relative z-10">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg glow">
                  <Shield className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-gradient-animated">Secure Checkout</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your payment information is always protected
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container">
          <div className="mb-16 text-center animate-fade-in">
            <h2 className="mb-4 text-5xl font-extrabold text-gradient-animated">Featured Products</h2>
            <p className="text-muted-foreground text-xl">Check out our most popular items</p>
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

              <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/products")}
                  className="hover-lift px-10 py-7 h-auto text-lg font-bold shadow-lg hover:shadow-xl glow group"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
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
