import { Link } from "react-router-dom";
import { departments, users } from "@/app/_common/service/mock-db";
import type { Team } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamList({ teams }: { teams: Team[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {teams.map((team) => {
        const department = departments.find((item) => item.id === team.departmentId);
        const leader = users.find((item) => item.id === team.leaderId);
        return (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </div>
                <Badge variant={team.status === "ACTIVE" ? "success" : "outline"}>{team.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">부서</p>
                  <p className="mt-1 font-medium">{department?.name}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">팀리더</p>
                  <p className="mt-1 font-medium">{leader?.name}</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">구성원</p>
                  <p className="mt-1 font-medium">{team.members.length}명</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline">
                  <Link to={`/team/detail/${team.id}`}>상세</Link>
                </Button>
                <Button variant="outline">
                  <Link to={`/team/edit/${team.id}`}>수정</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
