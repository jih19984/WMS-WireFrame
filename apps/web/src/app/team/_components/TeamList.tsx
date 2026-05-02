import { Link } from "react-router-dom";
import { users } from "@/app/_common/service/mock-db";
import type { Team } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { getTeamStatusLabel } from "@/lib/utils";

export function TeamList({ teams, readOnly = false }: { teams: Team[]; readOnly?: boolean }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {teams.map((team) => {
        const leader = users.find((item) => item.id === team.leaderId);
        return (
          <CardSpotlight
            key={team.id}
            className="relative overflow-hidden rounded-[26px] transition-transform duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-[18px] font-[600] tracking-[-0.04em]">{team.name}</CardTitle>
                  <CardDescription className="text-[14px] leading-relaxed truncate w-[200px] sm:w-[260px]">{team.description}</CardDescription>
                </div>
                <Badge variant={team.status === "ACTIVE" ? "default" : "secondary"} className="px-2.5 py-0.5 font-[500]">
                  {getTeamStatusLabel(team.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">팀리더</p>
                  <p className="truncate text-[15px] font-[500]">{leader?.name}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">구성원</p>
                  <p className="truncate text-[15px] font-[500]">{team.members.length}명</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm text-muted-foreground">
                {team.operationNote}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" asChild>
                  <Link to={`/team/detail/${team.id}`}>상세</Link>
                </Button>
                {!readOnly && (
                  <Button variant="default" asChild>
                    <Link to={`/team/edit/${team.id}`}>수정</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </CardSpotlight>
        );
      })}
    </div>
  );
}
