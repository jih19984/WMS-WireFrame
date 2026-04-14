import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.01em]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/14 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
        success: "border-transparent bg-emerald-500/12 text-emerald-300",
        warning: "border-transparent bg-amber-500/12 text-amber-300",
        destructive: "border-transparent bg-rose-500/12 text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
