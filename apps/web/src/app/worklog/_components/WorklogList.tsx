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
            <CardContent className="grid gap-x-8 gap-y-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_1fr_auto]">
              <div className="flex items-center gap-2 lg:col-start-1 lg:row-start-1">
                <StatusBadge status={worklog.status} />
                <ImportanceBadge importance={worklog.importance} />
              </div>

              <div className="text-left lg:col-start-2 lg:row-start-1 lg:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                  마감일
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground/90">{worklog.dueDate}</p>
              </div>

              <div className="min-w-0 space-y-4 lg:col-start-1 lg:row-start-2">
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

              <div className="flex items-center gap-2 text-sm lg:col-start-1 lg:row-start-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                  팀
                </span>
                <span className="font-medium text-foreground/92">{team?.name}</span>
              </div>

              <div className="flex flex-col items-start gap-3 lg:col-start-2 lg:row-start-3 lg:items-end">
                {author ? (
                  <div className="flex items-center gap-2.5">
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
