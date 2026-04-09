import type { WorklogStatus } from "@/app/_common/types/api.types";
import { Button } from "@/components/ui/button";

const nextMap: Record<WorklogStatus, WorklogStatus[]> = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["DONE", "ON_HOLD", "CANCELLED"],
  ON_HOLD: ["IN_PROGRESS"],
  DONE: [],
  CANCELLED: [],
};

export function StatusTransition({
  status,
}: {
  status: WorklogStatus;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {nextMap[status].length === 0 ? (
        <p className="text-sm text-muted-foreground">최종 상태입니다.</p>
      ) : (
        nextMap[status].map((nextStatus) => (
          <Button key={nextStatus} size="sm" variant="outline" type="button">
            {nextStatus}로 변경
          </Button>
        ))
      )}
    </div>
  );
}
