import { useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock products data
  const products = [
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
    },
    {
      id: "5",
      name: "Ergonomic Office Chair",
      description: "Comfortable seating for long work hours",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop",
      category: "Furniture",
      rating: 4.7
    },
    {
      id: "6",
      name: "Portable Bluetooth Speaker",
      description: "Powerful sound in a compact design",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
      category: "Electronics",
      rating: 4.6
    }
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {["Electronics", "Fashion", "Home", "Furniture", "Wearables"].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <Label htmlFor={category} className="cursor-pointer text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Price Range</h3>
        <div className="pt-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer text-sm">
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-muted/50">
        <div className="container py-8">
          <h1 className="mb-2 text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-2">
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 flex-shrink-0 md:block">
            <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <Button variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {products.length} products
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
