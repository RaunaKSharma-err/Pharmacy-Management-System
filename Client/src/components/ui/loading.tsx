import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-10 bg-muted rounded flex-1" />
          <div className="h-10 bg-muted rounded w-24" />
          <div className="h-10 bg-muted rounded w-20" />
        </div>
      ))}
    </div>
  );
};
