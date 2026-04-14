import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/90 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-65",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
