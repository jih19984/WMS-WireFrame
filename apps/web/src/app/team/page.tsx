import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageTeams, isTeamLead } from "@/app/_common/service/access-control";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { TeamList } from "@/app/team/_components/TeamList";
import { useUser } from "@/app/user/_hooks/useUser";
import { UserList } from "@/app/user/_components/UserList";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Select } from "@/components/ui/select";

const registrationButtonClassName =
  "h-10 min-w-32 px-6 text-sm font-semibold";

export default function TeamPage() {
  const { user } = useAuth();
  const { departments } = useDepartment();
  const { teams } = useTeam();
  const { users } = useUser();
  const [departmentFilter, setDepartmentFilter] = useState("all");

  if (!user) return null;

  const canManage = canManageTeams(user);
  const visibleTeams = canManage
    ? teams
    : teams.filter((team) => user.teamIds.includes(team.id));
  const filteredTeams = visibleTeams.filter(
    (team) =>
      departmentFilter === "all" ||
      String(team.departmentId) === departmentFilter,
  );
  const departmentOptions = departments.filter((department) =>
    visibleTeams.some((team) => team.departmentId === department.id),
  );
  const myTeams = teams.filter((team) => user.teamIds.includes(team.id));
  const myTeamIds = myTeams.map((team) => team.id);
  const myMembers = users.filter((member) =>
    member.teamIds.some((teamId) => myTeamIds.includes(teamId)),
  );
  const readOnly = !canManage;
  const visibleMembers = canManage ? users : myMembers;
  const teamPagination = usePagination(filteredTeams, 3);
  const memberPagination = usePagination(myMembers, 6);
  const activeTeams = filteredTeams.filter((team) => team.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="팀 관리"
        description="역할에 따라 팀 목록과 소속 구성원을 올바른 범위로 확인합니다."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CardSpotlight className="rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Teams</p>
          <p className="mt-2 text-lg font-semibold">{filteredTeams.length}개</p>
        </CardSpotlight>
        <CardSpotlight className="rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Active Teams</p>
          <p className="mt-2 text-lg font-semibold">{activeTeams}개</p>
        </CardSpotlight>
        <CardSpotlight className="rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Members</p>
          <p className="mt-2 text-lg font-semibold">{visibleMembers.length}명</p>
        </CardSpotlight>
      </div>

      <div className="mt-2 space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
            {canManage ? "팀 목록" : "소속 팀 목록"}
          </h2>
          {canManage ? (
            <Button asChild variant="default" className={registrationButtonClassName}>
              <Link to="/team/create">팀 등록</Link>
            </Button>
          ) : null}
        </div>

        <div className="flex justify-end">
          <div className="w-full sm:w-[260px]">
            <Select
              className="h-11 rounded-2xl px-4"
              value={departmentFilter}
              options={[
                { label: "전체 부서", value: "all" },
                ...departmentOptions.map((department) => ({
                  label: department.name,
                  value: String(department.id),
                })),
              ]}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              aria-label="팀 목록 부서 필터"
            />
          </div>
        </div>

        <TeamList teams={teamPagination.items} readOnly={readOnly} />
        {teamPagination.totalPages > 1 ? (
          <Pagination
            page={teamPagination.page}
            totalPages={teamPagination.totalPages}
            onPageChange={teamPagination.setPage}
          />
        ) : null}
      </div>

      {isTeamLead(user) ? (
        <div className="space-y-4 py-4">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
            팀 구성원 명단
          </h2>
          <UserList users={memberPagination.items} readOnly />
          <Pagination
            page={memberPagination.page}
            totalPages={memberPagination.totalPages}
            onPageChange={memberPagination.setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
