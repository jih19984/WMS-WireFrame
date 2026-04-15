import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { canManageTeams, isTeamLead } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { TeamList } from "@/app/team/_components/TeamList";
import { UserList } from "@/app/user/_components/UserList";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export default function TeamPage() {
  const { user } = useAuth();
  const { teams } = useTeam();
  const { users } = useUser();

  if (!user) return null;

  const visibleTeams = canManageTeams(user)
    ? teams
    : teams.filter((team) => user.teamIds.includes(team.id));
  const myTeams = teams.filter((team) => user.teamIds.includes(team.id));
  const myTeamIds = myTeams.map((team) => team.id);
  const myMembers = users.filter((member) =>
    member.teamIds.some((teamId) => myTeamIds.includes(teamId)),
  );
  const canManage = canManageTeams(user);
  const readOnly = !canManage;
  const visibleMembers = canManage ? users : myMembers;
  const teamPagination = usePagination(visibleTeams, 3);
  const memberPagination = usePagination(myMembers, 6);
  const activeTeams = visibleTeams.filter((team) => team.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="팀 관리"
        description="역할에 따라 팀 목록과 소속 구성원을 다른 범위로 확인합니다."
        actions={
          canManage ? (
            <Button asChild variant="outline">
              <Link to="/team/create">팀 등록</Link>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CardSpotlight className="rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Teams</p>
          <p className="mt-2 text-lg font-semibold">{visibleTeams.length}개</p>
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

      <div className="space-y-4 py-4 mt-2">
        <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
          {canManage ? "팀 목록" : "소속 팀 목록"}
        </h2>
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
