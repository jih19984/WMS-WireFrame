import { Link } from "react-router-dom";
import { canEditWorklog } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { teams, users } from "@/app/_common/service/mock-db";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAiStatusLabel } from "@/lib/utils";

export function WorklogList({ worklogs }: { worklogs: Worklog[] }) {
  const { user } = useAuth();

  return (
    <div className="workspace-list worklog-divider-top gap-0">
      {worklogs.map((worklog) => {
        const author = users.find((user) => user.id === worklog.authorId);
        const team = teams.find((item) => item.id === worklog.teamId);

        return (
          <article
            key={worklog.id}
            className="worklog-divider-item group relative py-3.5 last:border-b-0"
          >
            <div className="grid gap-x-8 gap-y-4 px-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0 space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[17px] font-[700] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
                      {worklog.title}
                    </p>
                    <StatusBadge status={worklog.status} />
                    <ImportanceBadge importance={worklog.importance} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 max-w-3xl text-[14px] leading-6 text-muted-foreground">
                    {worklog.aiSummary}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    AI 상태 {getAiStatusLabel(worklog.aiStatus)} · 선행 업무 {worklog.dependencyIds.length}건
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                      팀
                    </span>
                    <span className="truncate font-medium text-foreground/92">{team?.name}</span>
                  </div>
                  {author ? (
                    <>
                      <span className="hidden h-4 w-px bg-border/80 md:block" />
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage src={author.profileImage} alt={author.name} />
                          <AvatarFallback className="bg-primary/20 text-[10px] font-bold text-primary">
                            {author.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] font-[500] text-foreground">{author.name}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <div className="text-left lg:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                    마감일
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground/90">{worklog.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" className="h-11 min-w-28 px-5 text-sm font-semibold" asChild>
                    <Link to={`/worklog/detail/${worklog.id}`}>상세</Link>
                  </Button>
                  {canEditWorklog(user, worklog) ? (
                    <Button variant="default" className="h-11 min-w-28 px-5 text-sm font-semibold" asChild>
                      <Link to={`/worklog/edit/${worklog.id}`}>수정</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
