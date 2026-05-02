import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageTeams } from "@/app/_common/service/access-control";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { TeamList } from "@/app/team/_components/TeamList";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";

type TeamStatusFilter = "all" | "ACTIVE" | "INACTIVE";

const statusFilterCards: Array<{
  key: TeamStatusFilter;
  label: string;
  getCount: (counts: { total: number; active: number; inactive: number }) => number;
}> = [
  {
    key: "all",
    label: "전체 팀",
    getCount: (counts) => counts.total,
  },
  {
    key: "ACTIVE",
    label: "활성화된 팀",
    getCount: (counts) => counts.active,
  },
  {
    key: "INACTIVE",
    label: "비활성화된 팀",
    getCount: (counts) => counts.inactive,
  },
];

const registrationButtonClassName =
  "h-10 min-w-32 px-6 text-sm font-semibold";

export default function TeamPage() {
  const { user } = useAuth();
  const { teams } = useTeam();
  const [statusFilter, setStatusFilter] = useState<TeamStatusFilter>("all");

  if (!user) return null;

  const canManage = canManageTeams(user);
  const visibleTeams = canManage
    ? teams
    : teams.filter((team) => user.teamIds.includes(team.id));
  const readOnly = !canManage;
  const activeTeams = visibleTeams.filter((team) => team.status === "ACTIVE").length;
  const inactiveTeams = visibleTeams.filter((team) => team.status === "INACTIVE").length;
  const filteredTeams =
    statusFilter === "all"
      ? visibleTeams
      : visibleTeams.filter((team) => team.status === statusFilter);
  const teamPagination = usePagination(filteredTeams, 3);
  const statusCounts = {
    total: visibleTeams.length,
    active: activeTeams,
    inactive: inactiveTeams,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="팀 관리"
        description="역할에 따라 팀 목록과 소속 구성원을 올바른 범위로 확인합니다."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {statusFilterCards.map((card) => {
          const isSelected = statusFilter === card.key;

          return (
            <button
              key={card.key}
              type="button"
              className="text-left"
              onClick={() => setStatusFilter(card.key)}
              aria-pressed={isSelected}
            >
              <CardSpotlight
                className={cn(
                  "rounded-[24px] p-5 transition-all duration-200 hover:-translate-y-0.5",
                  isSelected &&
                    "border-primary/50 bg-primary/10 shadow-[0_18px_42px_-28px_rgba(59,130,246,0.9)]",
                )}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {card.getCount(statusCounts)}개
                </p>
              </CardSpotlight>
            </button>
          );
        })}
      </div>

      <div className="mt-2 space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
            {canManage ? "팀 목록" : "소속 팀 목록"}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {filteredTeams.length}개
            </span>
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
