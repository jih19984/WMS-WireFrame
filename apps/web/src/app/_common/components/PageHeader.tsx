import type { ReactNode } from "react";

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
    <div className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? <span className="workspace-kicker">{eyebrow}</span> : null}
        <div className="space-y-2">
          <h1 className="max-w-4xl text-[30px] font-[800] tracking-[-0.05em] text-foreground md:text-[36px]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
