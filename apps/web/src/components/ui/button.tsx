import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-[15px] font-medium tracking-[-0.02em] outline-none transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        outline:
          "border-border bg-background/70 text-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80",
        ghost:
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-11 px-6 text-[15px]",
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
