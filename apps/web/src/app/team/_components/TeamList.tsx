import { Link } from "react-router-dom";
import { departments, users } from "@/app/_common/service/mock-db";
import type { Team } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamStatusLabel } from "@/lib/utils";

export function TeamList({ teams, readOnly = false }: { teams: Team[]; readOnly?: boolean }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {teams.map((team) => {
        const department = departments.find((item) => item.id === team.departmentId);
        const leader = users.find((item) => item.id === team.leaderId);
        return (
          <Card
            key={team.id}
            className="relative overflow-hidden border-white/8 transition-all hover:-translate-y-0.5 hover:border-white/14"
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
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="workspace-panel-inset rounded-2xl p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">부서</p>
                  <p className="truncate text-[15px] font-[500]">{department?.name}</p>
                </div>
                <div className="workspace-panel-inset rounded-2xl p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">팀리더</p>
                  <p className="truncate text-[15px] font-[500]">{leader?.name}</p>
                </div>
                <div className="workspace-panel-inset rounded-2xl p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">구성원</p>
                  <p className="truncate text-[15px] font-[500]">{team.members.length}명</p>
                </div>
              </div>
              <div className="workspace-panel-inset rounded-2xl p-4 text-sm text-muted-foreground">
                {team.operationNote}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link to={`/team/detail/${team.id}`}>상세</Link>
                </Button>
                {!readOnly && (
                  <Button variant="outline" asChild>
                    <Link to={`/team/edit/${team.id}`}>수정</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
