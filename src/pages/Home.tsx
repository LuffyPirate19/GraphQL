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
                onClick={() => navigate("/products")}
              >
                Browse Products
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
                    Free delivery on orders over ₹500
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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
