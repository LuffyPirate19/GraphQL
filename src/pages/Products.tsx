import { useState, useEffect } from "react";
import { useQuery } from "@/hooks/use-graphql";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/lib/graphql/queries";
import { toast } from "sonner";

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setOffset(0); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset offset when filters change
  useEffect(() => {
    setOffset(0);
  }, [selectedCategories, priceRange, sortBy, debouncedSearchQuery]);

  // Build filter object
  const filter: any = {};
  if (selectedCategories.length > 0) {
    filter.categoryIds = selectedCategories;
  }
  if (priceRange[0] > 0 || priceRange[1] < 10000) {
    filter.priceRange = {
      min: priceRange[0],
      max: priceRange[1],
    };
  }
  if (debouncedSearchQuery.trim()) {
    filter.search = debouncedSearchQuery.trim();
  }

  const { data: productsData, loading: productsLoading, error: productsError, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      limit,
      offset,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      sort: { sortBy },
    },
  });

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);

  const products = productsData?.products?.edges?.map((edge: any) => edge.node) || [];
  const categories = categoriesData?.categories || [];
  const totalCount = productsData?.products?.pageInfo?.totalCount || 0;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setOffset(0);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
    setOffset(0);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setOffset(0);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {categoriesLoading ? (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories available</p>
          ) : (
            categories.map((category: any) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <Label htmlFor={category.id} className="cursor-pointer text-sm">
                  {category.name}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Price Range</h3>
        <div className="pt-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            step={100}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (productsError) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-destructive">Error loading products: {productsError.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
              id="productSearch"
              name="productSearch"
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
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sortBy" className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
                <SelectItem value="popularity_desc">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 flex-shrink-0 md:block">
            <div className="sticky top-20 space-y-6 rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {products.length} of {totalCount} products
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found</p>
                    {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000 || debouncedSearchQuery) && (
                      <Button onClick={handleClearFilters} className="mt-4">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {products.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          description={product.description}
                          price={parseFloat(product.price)}
                          image={product.image || product.images?.[0] || "/placeholder.svg"}
                          category={product.category?.name}
                          inStock={product.inStock}
                          rating={product.rating || 0}
                        />
                      ))}
                    </div>
                    {products.length >= limit && (
                      <div className="mt-8 flex justify-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setOffset(Math.max(0, offset - limit))}
                          disabled={offset === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setOffset(offset + limit)}
                          disabled={products.length < limit}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
