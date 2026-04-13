import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-[#c9d8ff] bg-[#f0f8ff] text-[#3859f9]",
        secondary: "border-border bg-[#f3eee5] text-secondary-foreground",
        outline: "border-dashed border-border bg-white text-muted-foreground",
        success: "border-[#54bf7b] bg-[#dff8e8] text-[#02492a]",
        warning: "border-[#e5b13c] bg-[#fff1cb] text-[#7a4d00]",
        destructive: "border-[#ec8f96] bg-[#ffe1e4] text-[#8b2430]",
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
