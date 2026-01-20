import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "warning" | "destructive" | "success";
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  change,
  className,
}: MetricCardProps) => {
  const variantStyles = {
    default: "bg-card text-card-foreground",
    primary:
      "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
    warning:
      "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground",
    destructive:
      "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground",
    success:
      "bg-gradient-to-br from-success to-success/80 text-success-foreground",
  };

  const iconBgStyles = {
    default: "bg-primary/10 text-primary",
    primary: "bg-white/20 text-white",
    warning: "bg-white/20 text-white",
    destructive: "bg-white/20 text-white",
    success: "bg-white/20 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl p-6 shadow-soft border border-border/50 transition-all duration-300 hover:shadow-card-hover",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-90",
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-display font-bold">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                variant === "default"
                  ? change.type === "increase"
                    ? "text-success"
                    : "text-destructive"
                  : "opacity-80",
              )}
            >
              {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}%
              from last month
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBgStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

interface SimpleCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export const SimpleCard = ({
  children,
  className,
  title,
  action,
}: SimpleCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border/50 shadow-soft",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
