import { Link } from "react-router-dom";
import { useState } from "react";
import { teams, users } from "@/app/_common/service/mock-db";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { WorklogPreviewDialog } from "@/app/worklog/_components/WorklogPreviewDialog";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { getAiStatusLabel } from "@/lib/utils";

export function WorklogList({ worklogs }: { worklogs: Worklog[] }) {
  const [previewWorklogId, setPreviewWorklogId] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-3">
        {worklogs.length === 0 ? (
          <div className="workspace-empty rounded-xl px-6 py-10 text-center text-sm">
            조건에 맞는 업무가 없습니다.
          </div>
        ) : (
          worklogs.map((worklog) => {
            const author = users.find((user) => user.id === worklog.authorId);
            const team = teams.find((item) => item.id === worklog.teamId);

            return (
              <CardSpotlight
                key={worklog.id}
                role="button"
                tabIndex={0}
                onClick={() => setPreviewWorklogId(worklog.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setPreviewWorklogId(worklog.id);
                  }
                }}
                className="group cursor-pointer rounded-[24px] transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-stretch lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[18px] font-semibold tracking-[-0.03em] text-foreground transition-colors group-hover/card-spotlight:text-primary">
                          {worklog.title}
                        </p>
                        <StatusBadge status={worklog.status} />
                        <ImportanceBadge importance={worklog.importance} />
                      </div>
                      <p className="line-clamp-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                        {worklog.aiSummary}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        AI 상태 {getAiStatusLabel(worklog.aiStatus)} · 선행 업무{" "}
                        {worklog.dependencyIds.length}건
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          팀
                        </span>
                        <span className="truncate font-medium text-foreground">
                          {team?.name}
                        </span>
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
                            <span className="text-[13px] font-medium text-foreground">
                              {author.name}
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start justify-between gap-4 text-sm lg:w-[250px] lg:border-l lg:border-border/70 lg:pl-5">
                    <div className="grid w-full grid-cols-2 gap-5 text-left lg:text-right">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          시작일
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                          {worklog.instructionDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          마감일
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                          {worklog.dueDate}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="h-11 w-full text-sm font-semibold lg:mt-auto"
                      asChild
                    >
                      <Link
                        to={`/worklog/detail/${worklog.id}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        상세
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </CardSpotlight>
            );
          })
        )}
      </div>
      <WorklogPreviewDialog
        open={previewWorklogId !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewWorklogId(null);
        }}
        worklogId={previewWorklogId}
      />
    </>
  );
}
