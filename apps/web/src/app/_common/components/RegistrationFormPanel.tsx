import type { ReactNode } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";

export function RegistrationFormPanel({
  eyebrow,
  title,
  icon,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <CardSpotlight className={cn("rounded-[28px]", className)}>
      <div className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="text-[22px] font-semibold tracking-[-0.05em] text-foreground">
              {title}
            </h2>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/16 via-primary/8 to-transparent text-primary">
            {icon}
          </div>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </CardSpotlight>
  );
}

export function RegistrationField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="inline-flex items-center gap-2 text-[15px] font-semibold text-foreground">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}
