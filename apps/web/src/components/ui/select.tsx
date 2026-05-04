import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, style, ...props }, ref) => {
    return (
      <div className="relative w-full p-px">
        <select
          ref={ref}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-input bg-background/70 px-3 pr-12 text-sm text-foreground shadow-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          style={style}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-foreground" />
      </div>
    );
  }
);

Select.displayName = "Select";
