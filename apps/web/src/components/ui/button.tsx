import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/30",
  {
    variants: {
      variant: {
        default:
          "border border-white/20 bg-primary/92 text-primary-foreground shadow-[0_14px_30px_rgba(79,70,229,0.3)] hover:bg-primary hover:shadow-[0_18px_34px_rgba(79,70,229,0.34)]",
        outline:
          "glass-input text-foreground hover:bg-white/70",
        secondary:
          "glass-input text-secondary-foreground hover:bg-white/66",
        ghost:
          "text-muted-foreground hover:bg-white/35 hover:text-foreground",
        destructive:
          "border border-red-300/35 bg-red-500/88 text-white shadow-[0_14px_30px_rgba(239,68,68,0.24)] hover:bg-red-500",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
