import { Link } from "react-router-dom";
import { useMemo } from "react";
import { teams, users } from "@/app/_common/service/mock-db";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canEditWorklog } from "@/app/_common/service/access-control";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatHours, getAiStatusLabel } from "@/lib/utils";

export function WorklogPreviewDialog({
  open,
  onOpenChange,
  worklogId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worklogId: number | null;
}) {
  const { user } = useAuth();
  const { worklogs } = useWorklog();

  const worklog = useMemo(() => {
    if (!worklogId) return null;
    return (
      worklogs.find((item) => item.id === worklogId) ??
      worklogService.getById(worklogId)
    );
  }, [worklogId, worklogs]);

  if (!worklog || worklog instanceof Promise) return null;

  const team = teams.find((item) => item.id === worklog.teamId);
  const author = users.find((item) => item.id === worklog.authorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-[28px] p-0">
        <div className="space-y-6 p-7">
          <DialogHeader className="mb-0 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={worklog.status} />
              <ImportanceBadge importance={worklog.importance} />
            </div>
            <DialogTitle className="text-[26px] tracking-[-0.05em]">
              {worklog.title}
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-7">
              {worklog.requestContent || "상위 요청/지시 내용이 아직 입력되지 않았습니다."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-border/70 bg-muted/25 p-5">
                <p className="text-sm font-semibold text-foreground">업무 내용</p>
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {worklog.workContent}
                </p>
              </section>

              <section className="rounded-2xl border border-border/70 bg-muted/25 p-5">
                <p className="text-sm font-semibold text-foreground">AI 요약</p>
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {worklog.aiSummary}
                </p>
              </section>
            </div>

            <div className="space-y-3">
              <InfoRow label="팀" value={team?.name ?? "-"} />
              <InfoRow label="작성자" value={author?.name ?? "-"} />
              <InfoRow label="마감일" value={formatDate(worklog.dueDate)} />
              <InfoRow label="업무시간" value={formatHours(worklog.actualHours)} />
              <InfoRow label="AI 상태" value={getAiStatusLabel(worklog.aiStatus)} />
              <InfoRow label="선행 업무" value={`${worklog.dependencyIds.length}건`} />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border/70 pt-6">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/worklog/detail/${worklog.id}`}>상세 페이지</Link>
            </Button>
            {canEditWorklog(user, worklog) ? (
              <Button asChild>
                <Link to={`/worklog/edit/${worklog.id}`}>업무 수정</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
