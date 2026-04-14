import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border text-[14px] font-semibold tracking-[-0.02em] outline-none transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-panel)] hover:brightness-110",
        outline:
          "border-border bg-white/4 text-foreground shadow-none hover:border-white/14 hover:bg-white/8",
        secondary:
          "border-white/6 bg-white/7 text-foreground shadow-none hover:bg-white/12",
        ghost:
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-white/6 hover:text-foreground",
        destructive:
          "border-transparent bg-destructive text-white shadow-[var(--shadow-panel)] hover:brightness-110",
      },
      size: {
        default: "h-10 px-[18px]",
        sm: "h-8 px-3 text-[12px]",
        lg: "h-11 px-5 text-[15px]",
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
  ({ className, variant, size, asChild = false, children, type, ...props }, ref) => {
    const resolvedClassName = cn(
      buttonVariants({ variant, size }),
      variant === "default" || variant === "destructive"
        ? "hover:-translate-y-0.5"
        : "hover:-translate-y-px",
      className
    );

    if (asChild && React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        className: cn(resolvedClassName, children.props.className),
      });
    }

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={resolvedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
