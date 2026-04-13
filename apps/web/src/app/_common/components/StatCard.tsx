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
      badge: "default",
      cardClass: "clay-swatch-slushie border-[#8adbf3]",
      iconClass: "border-[#0089ad]/20 bg-white/75 text-[#01418d]",
    },
    success: {
      badge: "success",
      cardClass: "clay-swatch-matcha border-[#54bf7b]",
      iconClass: "border-[#078a52]/20 bg-white/75 text-[#02492a]",
    },
    warning: {
      badge: "warning",
      cardClass: "clay-swatch-lemon border-[#f0cb7e]",
      iconClass: "border-[#d08a11]/20 bg-white/75 text-[#7a4d00]",
    },
    destructive: {
      badge: "destructive",
      cardClass: "clay-swatch-pomegranate border-[#ecabb0]",
      iconClass: "border-[#b74b55]/20 bg-white/75 text-[#8b2430]",
    },
  } as const;

  return (
    <Card className={cn("border", toneMap[tone].cardClass)}>
      <CardContent className="flex flex-col gap-4 p-6 md:p-8">
        <div className="flex items-center justify-between w-full">
          <Badge variant={toneMap[tone].badge}>{label}</Badge>
          <div className={cn("rounded-[16px] border p-2.5 shadow-[var(--shadow-clay)]", toneMap[tone].iconClass)}>
            <Icon className="size-5" />
          </div>
        </div>
        <div className="mt-2 space-y-1.5 flex-1">
          <p className="text-[32px] font-[600] leading-[1.1] tracking-[-0.64px]">{value}</p>
          <p className="text-[15px] leading-[1.5] text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
