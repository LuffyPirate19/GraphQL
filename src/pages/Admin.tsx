import { useState } from "react";
import { useQuery, useMutation } from "@/hooks/use-graphql";
import { Plus, Edit, Trash2, Package, CircleDollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_ORDERS,
} from "@/lib/graphql/queries";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/mutations";
import { toast } from "sonner";

const Admin = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
    inStock: true,
    image: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: { limit: 100, offset: 0 },
  });

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(GET_CATEGORIES);

  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ORDERS, {
    variables: { limit: 50, offset: 0 },
  });

  const { mutate: createProduct } = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product created successfully");
      setIsProductDialogOpen(false);
      resetProductForm();
      refetchProducts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const { mutate: updateProduct } = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product updated successfully");
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
      refetchProducts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const { mutate: deleteProduct } = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product deleted successfully");
      refetchProducts();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const { mutate: createCategory } = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category created successfully");
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      refetchCategories();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const { mutate: updateCategory } = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category updated successfully");
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      refetchCategories();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const { mutate: deleteCategory } = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category deleted successfully");
      refetchCategories();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const products = productsData?.products?.edges?.map((edge: any) => edge.node) || [];
  const categories = categoriesData?.categories || [];
  const orders = ordersData?.orders?.edges?.map((edge: any) => edge.node) || [];

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      stockQuantity: "",
      inStock: true,
      image: "",
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      image: "",
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      categoryId: product.categoryId || "",
      stockQuantity: product.stockQuantity?.toString() || "",
      inStock: product.inStock !== false,
      image: product.image || product.images?.[0] || "",
    });
    setIsProductDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });
    setIsCategoryDialogOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      name: productForm.name,
      description: productForm.description || undefined,
      price: parseFloat(productForm.price),
      categoryId: productForm.categoryId,
      stockQuantity: parseInt(productForm.stockQuantity) || 0,
      inStock: productForm.inStock,
      image: productForm.image || undefined,
    };

    if (editingProduct) {
      updateProduct({
        id: editingProduct.id,
        input,
      });
    } else {
      createProduct({
        input,
      });
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      name: categoryForm.name,
      description: categoryForm.description || undefined,
      image: categoryForm.image || undefined,
    };

    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        input,
      });
    } else {
      createCategory({
        input,
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ id });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory({ id });
    }
  };

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      change: "+20.1%",
      icon: CircleDollarSign,
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: "+12",
      icon: Package,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+15%",
      icon: ShoppingBag,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.3%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and orders</p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isCategoryDialogOpen}
              onOpenChange={(open) => {
                setIsCategoryDialogOpen(open);
                if (!open) {
                  setEditingCategory(null);
                  resetCategoryForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      name="categoryName"
                      value={categoryForm.name}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, name: e.target.value })
                      }
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      name="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, description: e.target.value })
                      }
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryImage">Image URL</Label>
                    <Input
                      id="categoryImage"
                      name="categoryImage"
                      value={categoryForm.image}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCategoryDialogOpen(false);
                        setEditingCategory(null);
                        resetCategoryForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? "Update" : "Create"} Category
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isProductDialogOpen}
              onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) {
                  setEditingProduct(null);
                  resetProductForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        name="productName"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm({ ...productForm, name: e.target.value })
                        }
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Category</Label>
                      <Select
                        value={productForm.categoryId}
                        onValueChange={(value) =>
                          setProductForm({ ...productForm, categoryId: value })
                        }
                      >
                        <SelectTrigger id="productCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : (
                            categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      name="productDescription"
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({ ...productForm, description: e.target.value })
                      }
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Price</Label>
                      <Input
                        id="productPrice"
                        name="productPrice"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({ ...productForm, price: e.target.value })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productStock">Stock Quantity</Label>
                      <Input
                        id="productStock"
                        name="productStock"
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) =>
                          setProductForm({ ...productForm, stockQuantity: e.target.value })
                        }
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Image URL</Label>
                    <Input
                      id="productImage"
                      name="productImage"
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({ ...productForm, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsProductDialogOpen(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Update" : "Add"} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                        <TableCell>₹{parseFloat(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.stockQuantity || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product.inStock ? "default" : "destructive"}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
