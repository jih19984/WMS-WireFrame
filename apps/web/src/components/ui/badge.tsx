import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.01em] shadow-sm transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-400/45 dark:bg-blue-400/16 dark:text-blue-100",
        secondary:
          "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-300/40 dark:bg-indigo-300/14 dark:text-indigo-100",
        outline:
          "border-slate-300 bg-slate-100/85 text-slate-700 dark:border-slate-400/30 dark:bg-slate-300/10 dark:text-slate-200",
        success:
          "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-400/45 dark:bg-emerald-400/16 dark:text-emerald-100",
        warning:
          "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-400/45 dark:bg-amber-400/16 dark:text-amber-100",
        destructive:
          "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-400/45 dark:bg-rose-400/16 dark:text-rose-100",
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
