import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      cardClass: "border-border/70",
      iconClass: "border-border/70 bg-primary/10 text-primary",
    },
    success: {
      cardClass: "border-emerald-500/25",
      iconClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    warning: {
      cardClass: "border-amber-500/25",
      iconClass: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },
    destructive: {
      cardClass: "border-rose-500/25",
      iconClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    },
  } as const;

  return (
    <Card className={cn("relative overflow-hidden", toneMap[tone].cardClass)}>
      <CardContent className="flex min-h-[188px] flex-col gap-6 p-6">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm font-medium tracking-[-0.02em] text-muted-foreground">{label}</p>
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border",
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
      </CardContent>
    </Card>
  );
}
