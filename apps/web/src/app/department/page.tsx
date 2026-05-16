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
          description="관리 가능한 부서와 운영 현황을 확인합니다."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">부서</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{departments.length}개</p>
          </CardSpotlight>
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">팀</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{visibleTeams.length}개</p>
          </CardSpotlight>
          <CardSpotlight className="rounded-[24px] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">구성원</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{visibleUsers.length}명</p>
          </CardSpotlight>
        </div>

        <div className="space-y-4">
          <div className="border-t-2 border-foreground/70 pt-5">
            <div className="space-y-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
                  부서 목록
                </h2>
                {canManageDepartment ? (
                  <Button asChild variant="default" className={registrationButtonClassName}>
                    <Link to="/department/create">부서 등록</Link>
                  </Button>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  활성 팀이 남아 있는 부서는 삭제할 수 없습니다.
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  표시 중인 부서 {departmentPagination.items.length}개
                </p>
              </div>
            </div>
          </div>
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
