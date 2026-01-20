import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "in-stock" | "low-stock" | "expired" | "out-of-stock";
  className?: string;
}

const statusConfig = {
  "in-stock": {
    label: "In Stock",
    className: "bg-success/15 text-success border-success/30",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-warning/15 text-warning border-warning/30",
  },
  expired: {
    label: "Expired",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-muted text-muted-foreground border-muted-foreground/30",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};

export const getStockStatus = (
  quantity: number,
  expiryDate: string,
): StatusBadgeProps["status"] => {
  const expiry = new Date(expiryDate);
  const now = new Date();

  if (expiry < now) {
    return "expired";
  }
  if (quantity === 0) {
    return "out-of-stock";
  }
  if (quantity <= 20) {
    return "low-stock";
  }
  return "in-stock";
};
