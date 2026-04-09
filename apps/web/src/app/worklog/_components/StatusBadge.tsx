import type { WorklogStatus } from "@/app/_common/types/api.types";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: WorklogStatus }) {
  const variant =
    status === "DONE" ? "success" : status === "ON_HOLD" ? "warning" : status === "CANCELLED" ? "destructive" : "default";
  return <Badge variant={variant}>{status}</Badge>;
}
