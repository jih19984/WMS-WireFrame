import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      cardClass: "border-[#3b82f6]/18 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_34%)]",
      iconClass: "border-[#60a5fa]/24 bg-[#3b82f6]/12 text-[#93c5fd]",
    },
    success: {
      cardClass: "border-[#48c9a3]/18 bg-[radial-gradient(circle_at_top_right,rgba(72,201,163,0.16),transparent_34%)]",
      iconClass: "border-[#48c9a3]/24 bg-[#48c9a3]/12 text-[#9ef6dd]",
    },
    warning: {
      cardClass: "border-[#f3af53]/18 bg-[radial-gradient(circle_at_top_right,rgba(243,175,83,0.16),transparent_36%)]",
      iconClass: "border-[#f3af53]/24 bg-[#f3af53]/12 text-[#ffd898]",
    },
    destructive: {
      cardClass: "border-[#ff6b90]/18 bg-[radial-gradient(circle_at_top_right,rgba(255,107,144,0.16),transparent_34%)]",
      iconClass: "border-[#ff6b90]/24 bg-[#ff6b90]/12 text-[#ffc6d5]",
    },
  } as const;

  return (
    <Card className={cn("relative overflow-hidden border", toneMap[tone].cardClass)}>
      <CardContent className="flex min-h-[208px] flex-col gap-6 p-6 md:p-7">
        <div className="flex items-center justify-between w-full">
          <p className="text-[14px] font-semibold tracking-wide text-foreground/85">{label}</p>
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-xl border shadow-[var(--shadow-inset)]",
              toneMap[tone].iconClass,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end space-y-2">
          <p className="text-[40px] font-[800] leading-[1] tracking-[-0.07em] text-foreground">
            {value}
          </p>
          <p className="max-w-[20rem] text-[15px] leading-7 text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
