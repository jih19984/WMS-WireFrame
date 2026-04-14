import { Link } from "react-router-dom";
import { canEditWorklog } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { teams, users } from "@/app/_common/service/mock-db";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAiStatusLabel } from "@/lib/utils";

export function WorklogList({ worklogs }: { worklogs: Worklog[] }) {
  const { user } = useAuth();

  return (
    <div className="workspace-list">
      {worklogs.map((worklog) => {
        const author = users.find((user) => user.id === worklog.authorId);
        const team = teams.find((item) => item.id === worklog.teamId);

        return (
          <Card
            key={worklog.id}
            className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-border"
          >
            <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={worklog.status} />
                  <ImportanceBadge importance={worklog.importance} />
                </div>
                <div>
                  <p className="text-[18px] font-[700] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
                    {worklog.title}
                  </p>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-[14px] leading-7 text-muted-foreground">
                    {worklog.aiSummary}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    AI 상태 {getAiStatusLabel(worklog.aiStatus)} · 선행 업무 {worklog.dependencyIds.length}건
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-left lg:text-right">
                  <p className="text-[13px] font-semibold text-foreground">{team?.name}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">마감 {worklog.dueDate}</p>
                </div>
                {author ? (
                  <div className="hidden items-center gap-2.5 rounded-full border border-border/70 bg-muted/35 px-2 py-1.5 md:flex">
                    <Avatar className="size-7">
                      <AvatarImage src={author.profileImage} alt={author.name} />
                      <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">
                        {author.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-[500] text-foreground">{author.name}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/worklog/detail/${worklog.id}`}>상세</Link>
                  </Button>
                  {canEditWorklog(user, worklog) ? (
                    <Button variant="outline" asChild>
                      <Link to={`/worklog/edit/${worklog.id}`}>수정</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
