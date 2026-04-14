import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageDepartments } from "@/app/_common/service/access-control";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { DepartmentList } from "@/app/department/_components/DepartmentList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DepartmentPage() {
  const { user } = useAuth();
  const { departments } = useDepartment();
  const { teams } = useTeam();
  const { users } = useUser();

  const isDirector = user?.role === "DIRECTOR";
  const canManageDepartment = canManageDepartments(user);

  if (!user) return null;

  const visibleTeams = isDirector
    ? teams
    : teams.filter((team) => team.departmentId === user.departmentId);
  const visibleUsers = isDirector
    ? users
    : users.filter((member) => member.departmentId === user.departmentId);

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <div className="flex flex-col gap-5">
        <PageHeader
          title="부서 관리"
          description="가시 범위 안의 부서 목록과 현재 부서 운영 규모를 한 화면에서 확인합니다."
        />

        <Card className="border-white/8">
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <div className="workspace-panel-inset rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Scope</p>
              <p className="mt-2 text-lg font-semibold">
                {isDirector ? "본부 전체" : "소속 부서"}
              </p>
            </div>
            <div className="workspace-panel-inset rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Teams</p>
              <p className="mt-2 text-lg font-semibold">{visibleTeams.length}개</p>
            </div>
            <div className="workspace-panel-inset rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Users</p>
              <p className="mt-2 text-lg font-semibold">{visibleUsers.length}명</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
              부서 목록
            </h2>
            {canManageDepartment ? (
              <Button asChild variant="outline" className="h-9">
                <Link to="/department/create">부서 등록</Link>
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            부서 생성과 삭제 정책은 본부장 전용입니다. 삭제 제약은 현재 화면에서 정책 안내 문구로 표현합니다.
          </p>
          <DepartmentList
            departments={departments}
            readOnly={!canManageDepartment}
          />
        </div>
      </div>
    </RoleGate>
  );
}
