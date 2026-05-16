import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Crown,
  Pencil,
  Trash2,
  UserCog,
  UsersRound,
} from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { canManageDepartments } from "@/app/_common/service/access-control";
import { teams, users } from "@/app/_common/service/mock-db";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import type { Team } from "@/app/team/_types/team.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function DepartmentDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { departments } = useDepartment();
  const departmentId = Number(params.id);
  const department = departments.find((item) => item.id === departmentId);
  const departmentTeams = teams.filter((team) => team.departmentId === departmentId);
  const leader = department
    ? users.find((member) => member.id === department.leaderId)
    : undefined;
  const canManageDepartment = canManageDepartments(user);

  return (
    <section className="space-y-6">
      <PageHeader
        title={department?.name ?? "부서 상세"}
        description="부서의 책임자와 소속 팀을 확인합니다."
      />

      {!department ? (
        <div className="workspace-panel rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
          부서를 찾을 수 없습니다.
        </div>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="outline" className="h-10">
              <Link to="/department">
                <ArrowLeft className="size-4" />
                부서 목록
              </Link>
            </Button>

            {canManageDepartment ? (
              <div className="flex flex-wrap justify-end gap-3">
                <Button asChild variant="default" className="h-10 min-w-28">
                  <Link to={`/department/edit/${department.id}`}>
                    <Pencil className="size-4" />
                    수정
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-10 min-w-28"
                  onClick={() => {
                    window.alert("활성 팀이 남아 있는 부서는 삭제할 수 없습니다.");
                  }}
                >
                  <Trash2 className="size-4" />
                  삭제
                </Button>
              </div>
            ) : null}
          </div>

          <Card className="rounded-[28px]">
            <CardContent className="space-y-7 p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-[28px] font-bold tracking-[-0.04em] text-foreground">
                    {department.name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                    이 부서가 직접 소유한 팀과 운영 책임자를 확인합니다.
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                  icon={UserCog}
                  label="사업부장"
                  value={leader?.name ?? "미지정"}
                />
                <InfoCard
                  icon={UsersRound}
                  label="소속 팀"
                  value={`${departmentTeams.length}개`}
                />
                <InfoCard
                  icon={Building2}
                  label="활성 프로젝트"
                  value={`${department.activeProjects}개`}
                />
                <InfoCard
                  icon={Crown}
                  label="최근 수정"
                  value={formatDate(department.updatedAt)}
                />
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="border-t-2 border-foreground/70 pt-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
                    소속 팀
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    부서에 연결된 팀의 리더, 기간, 구성원 수를 확인합니다.
                  </p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  총 {departmentTeams.length}개
                </p>
              </div>
            </div>

            {departmentTeams.length === 0 ? (
              <div className="workspace-panel rounded-2xl px-6 py-10 text-center text-sm text-muted-foreground">
                연결된 팀이 없습니다.
              </div>
            ) : null}

            <div className="grid gap-3 xl:grid-cols-2">
              {departmentTeams.map((team) => (
                <TeamSummaryCard key={team.id} team={team} />
              ))}
            </div>
          </section>
        </section>
      )}
    </section>
  );
}

function TeamSummaryCard({ team }: { team: Team }) {
  const leader = users.find((member) => member.id === team.leaderId);

  return (
    <Link
      to={`/team/detail/${team.id}`}
      className="block rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 outline-none transition-colors hover:border-primary/30 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-primary" />
            <h4 className="truncate text-base font-semibold text-foreground">
              {team.name}
            </h4>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatTeamPeriod(team)}
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 text-sm sm:min-w-56">
          <MiniInfo icon={Crown} label="리더" value={leader?.name ?? "미지정"} />
          <MiniInfo
            icon={UsersRound}
            label="구성원"
            value={`${team.members.length}명`}
          />
        </div>
      </div>
    </Link>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </p>
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <p className="mt-1 truncate text-xs font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function formatTeamPeriod(team: Team) {
  const startDate = team.startDate ? formatDate(team.startDate) : "시작일 미정";
  const endDate = team.endDate ? formatDate(team.endDate) : "종료일 미정";
  return `${startDate} - ${endDate}`;
}
