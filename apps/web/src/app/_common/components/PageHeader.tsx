import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <span
            className={cn(
              "inline-flex h-8 items-center rounded-full border border-border bg-muted px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground",
            )}
          >
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-2">
          <h1 className="max-w-4xl text-[28px] font-semibold tracking-[-0.05em] text-foreground md:text-[34px]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 md:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
