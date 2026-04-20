import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <span className="inline-flex shrink-0 items-center gap-2 text-sm text-foreground">
        <span
          className={cn(
            "relative inline-flex size-4 items-center justify-center overflow-hidden rounded-md border bg-card transition-colors",
            checked
              ? "border-blue-600 bg-blue-600 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_8px_18px_-10px_rgba(37,99,235,0.65)] dark:border-sky-300 dark:bg-sky-300 dark:text-slate-950 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22),0_8px_18px_-10px_rgba(56,189,248,0.5)]"
              : "border-border text-transparent",
          )}
        >
          <input
            ref={ref}
            type="checkbox"
            checked={Boolean(checked)}
            className={cn(
              "absolute inset-0 z-10 m-0 size-4 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 opacity-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              className
            )}
            {...props}
          />
          <Check
            strokeWidth={3}
            className={cn(
              "pointer-events-none size-[0.85rem] transition-opacity",
              checked ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
      </span>
    );
  }
);

Checkbox.displayName = "Checkbox";
