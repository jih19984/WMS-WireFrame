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
    <div className="grid gap-3">
      {worklogs.map((worklog) => {
        const author = users.find((user) => user.id === worklog.authorId);
        const team = teams.find((item) => item.id === worklog.teamId);

        return (
          <Card key={worklog.id} className="group relative overflow-hidden border border-[#dad4c8] bg-white transition-all hover:-translate-y-0.5 hover:border-[#bba7f6] hover:shadow-[var(--shadow-clay)]">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={worklog.status} />
                  <ImportanceBadge importance={worklog.importance} />
                </div>
                <div>
                  <p className="text-[17px] font-[600] tracking-[-0.03em] text-[#101010] transition-colors group-hover:text-[#43089f]">{worklog.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.6] text-[#55534e] md:line-clamp-1">{worklog.aiSummary}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    AI 상태 {getAiStatusLabel(worklog.aiStatus)} · 선행 업무 {worklog.dependencyIds.length}건
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden text-right md:block">
                  <p className="text-[14px] font-[500] text-[#101010]">{team?.name}</p>
                  <p className="mt-0.5 text-[12px] text-[#9f9b93]">마감 {worklog.dueDate}</p>
                </div>
                {author ? (
                  <div className="hidden items-center gap-2.5 md:flex rounded-full border border-[#dad4c8]/50 bg-[#faf9f7] pl-1 pr-3 py-1">
                    <Avatar className="size-6 border border-white shadow-sm">
                      <AvatarImage src={author.profileImage} alt={author.name} />
                      <AvatarFallback className="bg-[#8adbf3]/20 text-[10px] font-bold text-[#01418d]">{author.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-[500] text-[#101010]">{author.name}</span>
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
