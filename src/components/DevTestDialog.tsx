import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@/hooks/use-graphql";
import { useNavigate } from "react-router-dom";
import { TestTube, RotateCcw, CheckCircle, XCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/hooks/use-cart";
import {
  LOGIN,
  REGISTER,
  CREATE_PRODUCT,
  ADD_TO_CART,
  CREATE_ORDER,
} from "@/lib/graphql/mutations";
import { GET_PRODUCTS, GET_CATEGORIES } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  message?: string;
  duration?: number;
}

const DevTestDialog = () => {
  const navigate = useNavigate();
  const { items: cartItems, addItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [savedState, setSavedState] = useState<any>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem("devTestSavedState");
    if (saved) {
      setSavedState(JSON.parse(saved));
    }
  }, []);

  // Mutations
  const { mutate: loginMutation } = useMutation(LOGIN);
  const { mutate: registerMutation } = useMutation(REGISTER);
  const { mutate: createProductMutation } = useMutation(CREATE_PRODUCT);
  const { mutate: addToCartMutation } = useMutation(ADD_TO_CART);
  const { mutate: createOrderMutation } = useMutation(CREATE_ORDER);

  // Queries
  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: { limit: 10, offset: 0 },
    skip: true,
  });
  const { refetch: refetchCategories } = useQuery(GET_CATEGORIES, { skip: true });

  // Save current state
  const saveState = () => {
    const state = {
      cart: JSON.parse(JSON.stringify(cartItems)),
      authToken: localStorage.getItem("authToken"),
      timestamp: new Date().toISOString(),
    };
    setSavedState(state);
    localStorage.setItem("devTestSavedState", JSON.stringify(state));
    toast.success("State saved successfully");
  };

  // Restore saved state
  const restoreState = () => {
    const state = savedState || JSON.parse(localStorage.getItem("devTestSavedState") || "{}");

    if (state && state.timestamp) {
      // Restore cart
      clearCart();
      if (state.cart && state.cart.length > 0) {
        state.cart.forEach((item: any) => {
          addItem(item);
        });
      }

      // Restore auth token
      if (state.authToken) {
        localStorage.setItem("authToken", state.authToken);
      } else {
        localStorage.removeItem("authToken");
      }

      // Clear GraphQL cache
      graphqlClient.clearCache();

      toast.success(`State restored from ${new Date(state.timestamp).toLocaleString()}`);
    } else {
      toast.error("No saved state found");
    }
  };

  // Test functions
  const testRegister = async () => {
    const email = `testuser_${Date.now()}@test.com`;
    try {
      const result: any = await registerMutation({
        input: {
          email,
          password: "test123",
          name: "Test User",
        },
      });
      if (result?.register?.token) {
        localStorage.setItem("authToken", result.register.token);
      }
      return {
        success: !!result?.register?.token,
        message: `Registered: ${email}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  };

  const testLogin = async () => {
    try {
      const result: any = await loginMutation({
        input: {
          email: "admin@example.com",
          password: "admin123",
        },
      });
      if (result?.login?.token) {
        localStorage.setItem("authToken", result.login.token);
      }
      return {
        success: !!result?.login?.token,
        message: "Logged in as admin",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  const testFetchProducts = async () => {
    const result = await refetchProducts();
    return {
      success: !!result.data?.products,
      message: `Fetched ${result.data?.products?.edges?.length || 0} products`,
    };
  };

  const testFetchCategories = async () => {
    const result = await refetchCategories();
    return {
      success: !!result.data?.categories,
      message: `Fetched ${result.data?.categories?.length || 0} categories`,
    };
  };

  const testAddToCartLocal = async () => {
    const result = await refetchProducts();
    const product = result.data?.products?.edges?.[0]?.node;
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || product.images?.[0] || "/placeholder.svg",
        quantity: 1,
      });
      return { success: true, message: `Added ${product.name} to cart` };
    }
    return { success: false, message: "No products available" };
  };

  const testAddToCartServer = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
    const result = await refetchProducts();
    const product = result.data?.products?.edges?.[0]?.node;
    if (product) {
      try {
        const cartResult: any = await addToCartMutation({
          productId: product.id,
          quantity: 1,
        });
        return {
          success: !!cartResult?.addToCart,
          message: `Added ${product.name} to server cart`,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to add to cart",
        };
      }
    }
    return { success: false, message: "No products available" };
  };

  const testCreateOrder = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty" };
    }
    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));
    try {
      const result: any = await createOrderMutation({
        input: {
          items: orderItems,
          shippingAddress: {
            street: "123 Test St",
            city: "Test City",
            state: "TS",
            zipCode: "12345",
            country: "India",
          },
        },
      });
      return {
        success: !!result?.createOrder,
        message: `Order created: ${result?.createOrder?.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create order",
      };
    }
  };

  const testCreateProduct = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
    const categoriesResult = await refetchCategories();
    const category = categoriesResult.data?.categories?.[0];
    if (!category) {
      return { success: false, message: "No categories available" };
    }
    try {
      const result: any = await createProductMutation({
        input: {
          name: `Test Product ${Date.now()}`,
          description: "Test product description",
          price: 99.99,
          categoryId: category.id,
          stockQuantity: 10,
          inStock: true,
        },
      });
      return {
        success: !!result?.createProduct,
        message: `Product created: ${result?.createProduct?.name}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to create product",
      };
    }
  };

  const testNavigateToProducts = async () => {
    navigate("/products");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: window.location.pathname === "/products",
      message: "Navigated to products page",
    };
  };

  const testNavigateToHome = async () => {
    navigate("/");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: window.location.pathname === "/",
      message: "Navigated to home page",
    };
  };

  const testNavigateToAdmin = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }
    navigate("/admin");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: window.location.pathname === "/admin",
      message: "Navigated to admin page",
    };
  };

  const testClearCart = async () => {
    clearCart();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      success: true,
      message: "Cart cleared",
    };
  };

  const testScenarios = [
    { name: "Navigation - Home Page", run: testNavigateToHome },
    { name: "Navigation - Products Page", run: testNavigateToProducts },
    { name: "Authentication - Register New User", run: testRegister },
    { name: "Authentication - Login", run: testLogin },
    { name: "Navigation - Admin Page", run: testNavigateToAdmin },
    { name: "Fetch Products", run: testFetchProducts },
    { name: "Fetch Categories", run: testFetchCategories },
    { name: "Add Product to Cart (Local)", run: testAddToCartLocal },
    { name: "Add Product to Cart (Server)", run: testAddToCartServer },
    { name: "Clear Cart", run: testClearCart },
    { name: "Create Order", run: testCreateOrder },
    { name: "Admin - Create Product", run: testCreateProduct },
  ];

  const runTest = async (test: typeof testScenarios[0], index: number) => {
    setTestResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: "running" };
      return updated;
    });

    const startTime = Date.now();

    try {
      const result = await test.run();
      const duration = Date.now() - startTime;

      setTestResults((prev) => {
        const updated = [...prev];
        updated[index] = {
          name: test.name,
          status: result.success ? "success" : "error",
          message: result.message,
          duration,
        };
        return updated;
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setTestResults((prev) => {
        const updated = [...prev];
        updated[index] = {
          name: test.name,
          status: "error",
          message: error.message || "Test failed",
          duration,
        };
        return updated;
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults(
      testScenarios.map((test) => ({ name: test.name, status: "pending" as const }))
    );

    for (let i = 0; i < testScenarios.length; i++) {
      await runTest(testScenarios[i], i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    toast.success("All tests completed");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearAllState = () => {
    clearCart();
    localStorage.removeItem("authToken");
    localStorage.removeItem("devTestSavedState");
    graphqlClient.clearCache();
    setSavedState(null);
    toast.success("All state cleared");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-background hover:bg-muted"
          title="Dev Test Panel"
        >
          <TestTube className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Development Test Panel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={saveState} variant="outline" size="sm">
              Save Current State
            </Button>
            <Button onClick={restoreState} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore Saved State
            </Button>
            <Button onClick={runAllTests} disabled={isRunning} size="sm">
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run All Tests"}
            </Button>
            <Button onClick={clearResults} variant="outline" size="sm">
              Clear Results
            </Button>
            <Button onClick={clearAllState} variant="destructive" size="sm">
              Clear All State
            </Button>
          </div>

          {savedState && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              State saved: {new Date(savedState.timestamp).toLocaleString()}
            </div>
          )}

          <Separator />

          {/* Test Results */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {testScenarios.map((test, index) => {
                const result = testResults[index];
                const status = result?.status || "pending";

                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{test.name}</h4>
                            {status === "running" && (
                              <Badge variant="outline" className="animate-pulse">
                                Running...
                              </Badge>
                            )}
                            {status === "success" && (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            )}
                            {status === "error" && (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Error
                              </Badge>
                            )}
                            {status === "pending" && (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                          {result?.message && (
                            <p className="text-sm text-muted-foreground">{result.message}</p>
                          )}
                          {result?.duration !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Duration: {result.duration}ms
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => runTest(test, index)}
                          disabled={isRunning}
                          size="sm"
                          variant="outline"
                        >
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          {/* Summary */}
          {testResults.length > 0 && (
            <>
              <Separator />
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-medium">Total: </span>
                  {testResults.length}
                </div>
                <div>
                  <span className="font-medium">Success: </span>
                  <span className="text-green-500">
                    {testResults.filter((r) => r.status === "success").length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Failed: </span>
                  <span className="text-red-500">
                    {testResults.filter((r) => r.status === "error").length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Pending: </span>
                  {testResults.filter((r) => r.status === "pending").length}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DevTestDialog;
