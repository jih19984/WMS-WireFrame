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

export default function TeamPage() {
  const { user } = useAuth();
  const { teams } = useTeam();
  const { users } = useUser();

  if (!user) return null;

  const myTeams = teams.filter((team) => user.teamIds.includes(team.id));
  const myTeamIds = myTeams.map((team) => team.id);
  const myMembers = users.filter((member) =>
    member.teamIds.some((teamId) => myTeamIds.includes(teamId)),
  );
  const canManage = canManageTeams(user);
  const readOnly = !canManage;
  const teamPagination = usePagination(teams, 4);
  const memberPagination = usePagination(myMembers, 6);

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

      <div className="space-y-4 py-4 mt-2">
        <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
          {canManage ? "가시 범위 내 팀 목록" : "소속 팀 정보"}
        </h2>
        <TeamList teams={teamPagination.items} readOnly={readOnly} />
        <Pagination
          page={teamPagination.page}
          totalPages={teamPagination.totalPages}
          onPageChange={teamPagination.setPage}
        />
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
