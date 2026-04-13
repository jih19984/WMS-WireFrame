import { users } from "@/app/_common/service/mock-db";
import type { WorklogStatus } from "@/app/_common/types/api.types";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import { AiSummaryCard } from "@/app/worklog/_components/AiSummaryCard";
import { DependencyGraph } from "@/app/worklog/_components/DependencyGraph";
import { FileAttachment } from "@/app/worklog/_components/FileAttachment";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { StatusHistory } from "@/app/worklog/_components/StatusHistory";
import { StatusTransition } from "@/app/worklog/_components/StatusTransition";
import { TagList } from "@/app/worklog/_components/TagList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime, formatHours } from "@/lib/utils";

export function WorklogDetail({
  worklog,
  canTransition,
  onTransition,
  transitionNotice,
}: {
  worklog: Worklog;
  canTransition: boolean;
  onTransition: (nextStatus: WorklogStatus, reason: string) => Promise<void>;
  transitionNotice?: string;
}) {
  const author = users.find((user) => user.id === worklog.authorId);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={worklog.status} />
                  <ImportanceBadge importance={worklog.importance} />
                </div>
                <CardTitle>{worklog.title}</CardTitle>
                <p className="text-sm leading-6 text-muted-foreground">
                  {worklog.requestContent || "상위 요청/지시 내용이 아직 입력되지 않았습니다."}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <section>
              <p className="text-sm font-medium">업무 내용</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {worklog.workContent}
              </p>
            </section>
            <section>
              <p className="text-sm font-medium">메타 태그</p>
              <div className="mt-2">
                <TagList tagIds={worklog.tagIds} />
              </div>
            </section>
          </CardContent>
        </Card>

        <AiSummaryCard worklog={worklog} />

        <Card>
          <CardHeader>
            <CardTitle>첨부 파일</CardTitle>
          </CardHeader>
          <CardContent>
            <FileAttachment fileIds={worklog.fileIds} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>선행 업무</CardTitle>
          </CardHeader>
          <CardContent>
            <DependencyGraph dependencyIds={worklog.dependencyIds} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>작성자 및 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {author ? (
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4">
                <Avatar className="size-11">
                  <AvatarImage src={author.profileImage} alt={author.name} />
                  <AvatarFallback>{author.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm text-muted-foreground">{author.title}</p>
                </div>
              </div>
            ) : null}
            <div className="grid gap-3">
              <InfoRow label="지시일" value={formatDate(worklog.instructionDate)} />
              <InfoRow label="마감일" value={formatDate(worklog.dueDate)} />
              <InfoRow label="실제 업무시간" value={formatHours(worklog.actualHours)} />
              <InfoRow
                label="완료일"
                value={worklog.completionDate ? formatDate(worklog.completionDate) : "-"}
              />
              <InfoRow
                label="AI 수동 편집"
                value={worklog.aiSummaryEdited ? "사용자 수정 완료" : "자동 생성 유지"}
              />
              <InfoRow label="생성일" value={formatDateTime(worklog.createdAt)} />
              <InfoRow label="수정일" value={formatDateTime(worklog.updatedAt)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상태 변경</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusTransition
              worklog={worklog}
              canTransition={canTransition}
              onTransition={onTransition}
            />
            {transitionNotice ? (
              <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
                {transitionNotice}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상태 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusHistory worklog={worklog} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
