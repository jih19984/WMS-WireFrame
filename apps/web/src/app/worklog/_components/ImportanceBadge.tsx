import type { ImportanceLevel } from "@/app/_common/types/api.types";
import { Badge } from "@/components/ui/badge";
import { getImportanceLabel } from "@/lib/utils";

export function ImportanceBadge({ importance }: { importance: ImportanceLevel }) {
  const variant =
    importance === "URGENT" ? "destructive" : importance === "HIGH" ? "warning" : importance === "LOW" ? "outline" : "secondary";
  return <Badge variant={variant}>{getImportanceLabel(importance)}</Badge>;
}
