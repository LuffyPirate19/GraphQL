import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add some products to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg border border-border p-3">
                    <img 
                      src={item.image || "/placeholder.svg"} 
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
