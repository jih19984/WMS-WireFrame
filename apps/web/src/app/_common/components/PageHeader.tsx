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
    <div className="flex flex-col gap-4 mb-2 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1.5">
        {eyebrow ? <span className="clay-eyebrow">{eyebrow}</span> : null}
        <h1 className="max-w-3xl text-[28px] font-[600] tracking-[-0.03em] text-[#101010] md:text-[32px]">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-[15px] leading-relaxed text-[#55534e] pt-1">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div> : null}
    </div>
  );
}
