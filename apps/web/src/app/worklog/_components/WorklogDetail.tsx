import { users } from "@/app/_common/service/mock-db";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WorklogDetail({ worklog }: { worklog: Worklog }) {
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
                <CardDescription>{worklog.requestContent}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <section>
              <p className="text-sm font-medium">업무 내용</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{worklog.workContent}</p>
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
            <DependencyGraph dependencyIds={worklog.dependencies} />
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
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-sm text-muted-foreground">{author.title}</p>
                </div>
              </div>
            ) : null}
            <div className="grid gap-3">
              <InfoRow label="지시일" value={worklog.instructionDate} />
              <InfoRow label="마감일" value={worklog.dueDate} />
              <InfoRow label="실제 업무시간" value={`${worklog.actualHours}h`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상태 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTransition status={worklog.status} />
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
      <span className="font-medium">{value}</span>
    </div>
  );
}
