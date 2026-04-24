import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { RoleGate } from "@/app/_common/components/RoleGate";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageDepartments } from "@/app/_common/service/access-control";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { DepartmentList } from "@/app/department/_components/DepartmentList";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const registrationButtonClassName =
  "h-10 min-w-32 px-6 text-sm font-semibold";

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
  const departmentPagination = usePagination(departments, 3);

  return (
    <RoleGate allow={["DIRECTOR", "DEPT_HEAD"]}>
      <div className="flex flex-col gap-5">
        <PageHeader
          title="부서 관리"
          description="권한 범위 안의 부서 목록과 현재 부서 운영 규모를 한 화면에서 확인합니다."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Departments</p>
            <p className="mt-2 text-lg font-semibold">{departments.length}개</p>
          </CardSpotlight>
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Teams</p>
            <p className="mt-2 text-lg font-semibold">{visibleTeams.length}개</p>
          </CardSpotlight>
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Members</p>
            <p className="mt-2 text-lg font-semibold">{visibleUsers.length}명</p>
          </CardSpotlight>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
              부서 목록
            </h2>
            {canManageDepartment ? (
              <Button asChild variant="default" className={registrationButtonClassName}>
                <Link to="/department/create">부서 등록</Link>
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            부서 생성과 삭제 정책은 본부장 전용입니다. 삭제 제약은 현재 화면에서 정책 안내 문구로 표현합니다.
          </p>
          <DepartmentList
            departments={departmentPagination.items}
            readOnly={!canManageDepartment}
          />
          {departmentPagination.totalPages > 1 ? (
            <Pagination
              page={departmentPagination.page}
              totalPages={departmentPagination.totalPages}
              onPageChange={departmentPagination.setPage}
            />
          ) : null}
        </div>
      </div>
    </RoleGate>
  );
}
