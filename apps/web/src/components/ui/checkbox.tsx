import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-foreground">
        <span className="relative inline-flex size-4 items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className={cn(
              "peer absolute inset-0 m-0 size-4 cursor-pointer appearance-none rounded border border-input bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring/20 checked:border-primary checked:bg-primary",
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none size-3 text-white opacity-0 peer-checked:opacity-100" />
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
