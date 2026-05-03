import type { UserEvaluation, UserProfile } from "@/app/user/_types/user.types";
import { departments, teams } from "@/app/_common/service/mock-db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationList } from "@/app/user/_components/EvaluationList";
import { SkillEditor } from "@/app/user/_components/SkillEditor";
import {
  formatDate,
  getEmploymentStatusLabel,
  getRoleLabel,
} from "@/lib/utils";

export function UserDetail({
  user,
  evaluations,
  showEvaluations,
}: {
  user: UserProfile;
  evaluations: UserEvaluation[];
  showEvaluations: boolean;
}) {
  const primaryTeamName =
    teams.find((team) => team.id === user.primaryTeamId)?.name ?? "-";
  const otherTeamNames = user.teamIds
    .filter((teamId) => teamId !== user.primaryTeamId)
    .map((teamId) => teams.find((team) => team.id === teamId)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
                <Badge
                  variant={
                    user.employmentStatus === "ACTIVE"
                      ? "success"
                      : user.employmentStatus === "LEAVE"
                        ? "warning"
                        : "outline"
                  }
                >
                  {getEmploymentStatusLabel(user.employmentStatus)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="권한" value={getRoleLabel(user.role)} />
            <InfoItem label="직책" value={user.title} />
            <InfoItem
              label="부서"
              value={departments.find((department) => department.id === user.departmentId)?.name ?? "-"}
            />
            <InfoItem
              label="주소속팀"
              value={primaryTeamName}
            />
            <InfoItem label="다른 소속 팀" value={otherTeamNames || "-"} />
            <InfoItem label="직급" value={user.position} />
            <InfoItem label="연락처" value={user.phone} />
            <InfoItem label="입사일" value={formatDate(user.joinDate)} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>스킬 수준</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillEditor skills={user.skills} />
          </CardContent>
        </Card>
        {showEvaluations ? (
          <EvaluationList evaluations={evaluations} />
        ) : (
          <Card>
            <CardContent className="pt-5 text-sm text-muted-foreground">
              현재 역할에서는 관리자 평가를 볼 수 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-4 text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
