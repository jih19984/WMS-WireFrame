import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]",
  {
    variants: {
      variant: {
        default: "border-[#6c8cff]/30 bg-[#6c8cff]/14 text-[#c9d6ff]",
        secondary: "border-white/8 bg-white/6 text-secondary-foreground",
        outline: "border-dashed border-white/10 bg-transparent text-muted-foreground",
        success: "border-[#48c9a3]/28 bg-[#48c9a3]/14 text-[#8ef2d4]",
        warning: "border-[#f3af53]/30 bg-[#f3af53]/14 text-[#ffd38e]",
        destructive: "border-[#ff6b90]/30 bg-[#ff6b90]/14 text-[#ffc0d0]",
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
