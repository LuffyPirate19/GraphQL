import { useQuery } from "@/hooks/use-graphql";
import { ShoppingCart, Menu, Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/use-cart";
import AuthDialog from "@/components/AuthDialog";
import { GET_ME } from "@/lib/graphql/queries";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();
  const token = localStorage.getItem("authToken");
  
  const { data: meData } = useQuery(GET_ME, {
    skip: !token,
  });

  const user = meData?.me;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    graphqlClient.clearCache();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 group-hover:scale-110 transition-transform duration-300 shadow-md" />
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">ShopHub</span>
          </NavLink>
          
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/products">
              <Button variant="ghost" size="sm">Products</Button>
            </NavLink>
            <NavLink to="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </NavLink>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const search = formData.get("search") as string;
              if (search?.trim()) {
                navigate(`/products?search=${encodeURIComponent(search.trim())}`);
              }
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="navbarSearch"
              name="search"
              placeholder="Search products..."
              className="pl-10"
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </AuthDialog>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-primary/10 transition-colors"
            onClick={toggleCart}
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5 transition-transform hover:scale-110" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg ring-2 ring-background animate-pulse-glow">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <NavLink to="/products">
                  <Button variant="ghost" className="w-full justify-start">Products</Button>
                </NavLink>
                <NavLink to="/admin">
                  <Button variant="ghost" className="w-full justify-start">Admin</Button>
                </NavLink>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start relative"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-auto flex h-6 w-6 min-w-[24px] items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
