import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-[16px] font-medium tracking-[-0.16px] outline-none transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-black bg-primary text-primary-foreground shadow-[var(--shadow-clay)] hover:bg-[#078a52] hover:shadow-[var(--shadow-clay-hard)]",
        outline:
          "glass-input border-border bg-white text-foreground hover:bg-[#f8cc65] hover:text-foreground hover:shadow-[var(--shadow-clay-hard)]",
        secondary:
          "border-[#078a52]/25 bg-[#84e7a5] text-[#02492a] shadow-[var(--shadow-clay)] hover:bg-[#3bd3fd] hover:text-[#01418d] hover:shadow-[var(--shadow-clay-hard)]",
        ghost:
          "border-dashed border-border bg-transparent text-muted-foreground shadow-none hover:border-black hover:bg-[#fff4da] hover:text-foreground hover:shadow-[var(--shadow-clay-hard)]",
        destructive:
          "border-[#b74b55] bg-[#fc7981] text-foreground shadow-[var(--shadow-clay)] hover:bg-[#c1b0ff] hover:text-[#32037d] hover:shadow-[var(--shadow-clay-hard)]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11",
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
      variant === "default" || variant === "secondary" || variant === "destructive"
        ? "hover:-translate-y-1 hover:shadow-[var(--shadow-clay-hard)]"
        : "hover:-translate-y-0.5",
      variant === "default" || variant === "destructive" ? "hover:-rotate-2" : "",
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
