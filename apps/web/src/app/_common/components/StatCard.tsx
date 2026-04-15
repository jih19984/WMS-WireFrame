import type { LucideIcon } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "destructive";
}) {
  const toneMap = {
    default: {
      iconClass:
        "border-primary/20 bg-gradient-to-br from-primary/16 via-primary/8 to-transparent text-primary",
    },
    success: {
      iconClass:
        "border-emerald-500/20 bg-gradient-to-br from-emerald-500/18 via-emerald-500/10 to-transparent text-emerald-300",
    },
    warning: {
      iconClass:
        "border-amber-500/20 bg-gradient-to-br from-amber-500/18 via-amber-500/10 to-transparent text-amber-300",
    },
    destructive: {
      iconClass:
        "border-rose-500/20 bg-gradient-to-br from-rose-500/18 via-rose-500/10 to-transparent text-rose-300",
    },
  } as const;

  return (
    <CardSpotlight className="h-full rounded-[26px] transition-transform duration-300 hover:-translate-y-1">
      <div className="flex min-h-[188px] flex-col gap-6 p-6">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-medium tracking-[-0.02em] text-muted-foreground">{label}</p>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
              toneMap[tone].iconClass,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end space-y-2">
          <p className="text-[36px] font-semibold leading-none tracking-[-0.06em] text-foreground">
            {value}
          </p>
          <p className="max-w-[20rem] text-sm leading-6 text-muted-foreground">{hint}</p>
        </div>
      </div>
    </CardSpotlight>
  );
}
