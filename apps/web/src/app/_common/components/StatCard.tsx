import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    default: "default",
    success: "success",
    warning: "warning",
    destructive: "destructive",
  } as const;

  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-2">
          <Badge variant={toneMap[tone]}>{label}</Badge>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted p-3">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
