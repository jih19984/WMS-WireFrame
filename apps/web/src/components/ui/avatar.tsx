import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-muted/40 text-xs font-semibold text-secondary-foreground",
        className
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("size-full object-cover", className)} {...props} />;
}

export function AvatarFallback({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center justify-center", className)} {...props} />;
}
