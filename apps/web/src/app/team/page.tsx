import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageTeams } from "@/app/_common/service/access-control";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { TeamList } from "@/app/team/_components/TeamList";
import { useUser } from "@/app/user/_hooks/useUser";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const registrationButtonClassName =
  "h-10 min-w-32 px-6 text-sm font-semibold";

export default function TeamPage() {
  const { user } = useAuth();
  const { teams } = useTeam();
  const { users } = useUser();

  if (!user) return null;

  const canManage = canManageTeams(user);
  const visibleTeams = canManage
    ? teams
    : teams.filter((team) => user.teamIds.includes(team.id));
  const myTeams = teams.filter((team) => user.teamIds.includes(team.id));
  const myTeamIds = myTeams.map((team) => team.id);
  const myMembers = users.filter((member) =>
    member.teamIds.some((teamId) => myTeamIds.includes(teamId)),
  );
  const readOnly = !canManage;
  const visibleMembers = canManage ? users : myMembers;
  const teamPagination = usePagination(visibleTeams, 3);
  const activeTeams = visibleTeams.filter((team) => team.status === "ACTIVE").length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="팀 관리"
        description="역할에 따라 팀 목록과 소속 구성원을 올바른 범위로 확인합니다."
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

        <TeamList teams={teamPagination.items} readOnly={readOnly} />
        {teamPagination.totalPages > 1 ? (
          <Pagination
            page={teamPagination.page}
            totalPages={teamPagination.totalPages}
            onPageChange={teamPagination.setPage}
          />
        ) : null}
      </div>

    </div>
  );
}
