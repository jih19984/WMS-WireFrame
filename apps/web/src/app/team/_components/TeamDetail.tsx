import { departments, users } from "@/app/_common/service/mock-db";
import { TeamMemberList } from "@/app/team/_components/TeamMemberList";
import type { Team } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamStatusLabel } from "@/lib/utils";

export function TeamDetail({ team }: { team: Team }) {
  const leader = users.find((user) => user.id === team.leaderId);
  const fallbackAdminId = departments.find(
    (department) => department.id === team.departmentId,
  )?.leaderId;
  const admin = users.find((user) => user.id === (team.adminId ?? fallbackAdminId));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.description}</CardDescription>
          </div>
          <Badge variant={team.status === "ACTIVE" ? "success" : "outline"}>
            {getTeamStatusLabel(team.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">시작일</p>
            <p className="mt-1 font-medium">{team.startDate}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">종료 예정일</p>
            <p className="mt-1 font-medium">{team.endDate}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">팀장</p>
            <p className="mt-1 font-medium">{leader?.name ?? "미지정"}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">관리자</p>
            <p className="mt-1 font-medium">{admin?.name ?? "미지정"}</p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm">
          <p className="font-medium">운영 메모</p>
          <p className="mt-2 leading-6 text-muted-foreground">{team.operationNote}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.04em] text-foreground">
              팀원 목록
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              팀 내 역할과 책임자를 확인합니다.
            </p>
          </div>
          <TeamMemberList
            memberIds={team.members}
            memberRoles={team.memberRoles}
            leaderId={team.leaderId}
            adminId={team.adminId ?? fallbackAdminId}
          />
        </div>
      </CardContent>
    </Card>
  );
}
