import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border border-primary/10 bg-primary/14 text-primary",
        secondary: "border border-white/35 bg-white/48 text-secondary-foreground",
        outline: "border border-white/40 bg-white/38 text-muted-foreground",
        success: "border border-emerald-200/40 bg-emerald-400/14 text-emerald-700",
        warning: "border border-amber-200/45 bg-amber-400/18 text-amber-700",
        destructive: "border border-red-200/45 bg-red-400/14 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
