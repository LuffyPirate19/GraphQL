import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 p-5 pt-0 border-t border-border/50">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;

