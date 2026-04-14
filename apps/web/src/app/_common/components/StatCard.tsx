import type { LucideIcon } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";
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
      glowColor: "222 82 72",
      glowColors: ["#7898ff", "#5876e8", "#9db3ff"],
      iconClass: "border-border/70 bg-primary/10 text-primary",
    },
    success: {
      glowColor: "153 64 55",
      glowColors: ["#5ed7a0", "#2fbf84", "#9cf2c8"],
      iconClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    warning: {
      glowColor: "38 92 64",
      glowColors: ["#ffd36b", "#ffb938", "#ffe4a5"],
      iconClass: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },
    destructive: {
      glowColor: "350 92 72",
      glowColors: ["#ff9fb2", "#ff7891", "#ffd3dc"],
      iconClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    },
  } as const;

  return (
    <BorderGlow
      className="h-full"
      backgroundColor="color-mix(in srgb, var(--card) 96%, transparent)"
      borderRadius={24}
      glowRadius={24}
      edgeSensitivity={22}
      glowIntensity={0.58}
      coneSpread={18}
      fillOpacity={0.12}
      alwaysOn
      colors={toneMap[tone].glowColors}
      glowColor={toneMap[tone].glowColor}
    >
      <Card className="relative h-full overflow-hidden rounded-[24px] border-0 bg-card/95 shadow-none backdrop-blur supports-[backdrop-filter]:bg-card/90">
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
    </BorderGlow>
  );
}
