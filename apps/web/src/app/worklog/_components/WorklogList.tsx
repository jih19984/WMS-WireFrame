import { Link } from "react-router-dom";
import { teams, users } from "@/app/_common/service/mock-db";
import type { Worklog } from "@/app/worklog/_types/worklog.types";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WorklogList({ worklogs }: { worklogs: Worklog[] }) {
  return (
    <div className="grid gap-3">
      {worklogs.map((worklog) => {
        const author = users.find((user) => user.id === worklog.authorId);
        const team = teams.find((item) => item.id === worklog.teamId);

        return (
          <Card key={worklog.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={worklog.status} />
                  <ImportanceBadge importance={worklog.importance} />
                </div>
                <div>
                  <p className="font-medium">{worklog.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{worklog.aiSummary}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden text-right text-sm md:block">
                  <p className="font-medium">{team?.name}</p>
                  <p className="text-muted-foreground">{worklog.dueDate}</p>
                </div>
                {author ? (
                  <div className="hidden items-center gap-2 md:flex">
                    <Avatar className="size-8">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>{author.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{author.name}</span>
                  </div>
                ) : null}
                <Button variant="outline">
                  <Link to={`/worklog/detail/${worklog.id}`}>상세</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
