import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Flame,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { StatCard } from "@/app/_common/components/StatCard";
import { useAuth } from "@/app/_common/hooks/useAuth";
import type { FileRecord, TagRecord, WorklogRecord } from "@/app/_common/service/mock-db";
import {
  allTeamsScopeValue,
  readStoredTeamScope,
  teamScopeChangedEvent,
  type TeamScopeValue,
} from "@/app/_common/service/team-scope-preference";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useFile } from "@/app/file/_hooks/useFile";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { useTag } from "@/app/tag/_hooks/useTag";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { WorklogPreviewDialog } from "@/app/worklog/_components/WorklogPreviewDialog";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  cn,
  formatDate,
  formatHours,
  getAiStatusLabel,
} from "@/lib/utils";

const DASHBOARD_NOW = new Date("2026-04-13T00:00:00");

type DashboardMode = "DIRECTOR" | "DEPT_HEAD" | "TEAM_LEAD" | "MEMBER";

type DashboardGroup = {
  id: number;
  name: string;
  total: number;
  done: number;
  inProgress: number;
  overdue: number;
  hours: number;
  memberCount: number;
  leaderName?: string;
};

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - DASHBOARD_NOW.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isOpenWorklog(worklog: WorklogRecord) {
  return worklog.status !== "DONE" && worklog.status !== "CANCELLED";
}

function isWithinLastSevenDays(date?: string) {
  if (!date) return false;
  const diff = DASHBOARD_NOW.getTime() - new Date(date).getTime();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}

function getCompletionRate(group: DashboardGroup) {
  if (group.total === 0) return 0;
  return Math.round((group.done / group.total) * 100);
}

function getWorkloadPerMember(group: DashboardGroup) {
  if (group.memberCount === 0) return 0;
  return group.hours / group.memberCount;
}

function getLoadBalanceIndex(groups: DashboardGroup[]) {
  const loads = groups.map((group) => group.inProgress);
  const max = Math.max(...loads, 0);
  const min = Math.min(...loads, 0);
  if (max === 0) return "1.00";
  return (1 - (max - min) / max).toFixed(2);
}

function getAiSuccessRate(worklogs: WorklogRecord[], files: FileRecord[]) {
  const total = worklogs.length + files.length;
  if (total === 0) return "100%";
  const failed = worklogs.filter((worklog) => worklog.aiStatus === "FAILED").length;
  const failedFiles = files.filter((file) => file.aiStatus === "FAILED").length;
  return `${(((total - failed - failedFiles) / total) * 100).toFixed(1)}%`;
}

function getProgressRatioValue(current: number, total: number) {
  if (total === 0) return "0 / 0 (0%)";
  return `${current} / ${total} (${Math.round((current / total) * 100)}%)`;
}

function isBetween(date: string | undefined, start: Date, end: Date) {
  if (!date) return false;
  const time = new Date(date).getTime();
  return time >= start.getTime() && time < end.getTime();
}

function getTrendSuffix(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "▲ 신규" : "변동 없음";
  const diff = Math.round(((current - previous) / previous) * 100);
  if (diff > 0) return `▲ +${diff}%`;
  if (diff < 0) return `▼ ${diff}%`;
  return "변동 없음";
}

function sortByDueDate(a: WorklogRecord, b: WorklogRecord) {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { worklogs } = useWorklog();
  const { files } = useFile();
  const { notifications } = useNotification();
  const { users } = useUser();
  const { teams } = useTeam();
  const { departments } = useDepartment();
  const { tags } = useTag();
  const [previewWorklogId, setPreviewWorklogId] = useState<number | null>(null);
  const [selectedTeamScope, setSelectedTeamScope] = useState<TeamScopeValue>(
    () => readStoredTeamScope(),
  );

  useEffect(() => {
    const handleTeamScopeChange = (event: Event) => {
      setSelectedTeamScope((event as CustomEvent<TeamScopeValue>).detail);
    };

    window.addEventListener(teamScopeChangedEvent, handleTeamScopeChange);
    return () => window.removeEventListener(teamScopeChangedEvent, handleTeamScopeChange);
  }, []);

  if (!user) return null;

  const mode: DashboardMode = user.role;
  const ledTeamIds = teams.filter((team) => team.leaderId === user.id).map((team) => team.id);
  const teamLeadScopeIds = ledTeamIds.length > 0 ? ledTeamIds : user.teamIds;

  const requestedTeamId =
    selectedTeamScope !== allTeamsScopeValue && Number.isFinite(Number(selectedTeamScope))
      ? Number(selectedTeamScope)
      : allTeamsScopeValue;

  const availableTeams =
    mode === "DIRECTOR"
      ? teams
      : mode === "DEPT_HEAD"
        ? teams.filter((team) => team.departmentId === user.departmentId)
        : mode === "TEAM_LEAD"
          ? teams.filter((team) => teamLeadScopeIds.includes(team.id))
          : teams.filter((team) => user.teamIds.includes(team.id));

  const effectiveSelectedTeamId =
    requestedTeamId !== allTeamsScopeValue &&
    availableTeams.some((team) => team.id === requestedTeamId)
      ? requestedTeamId
      : allTeamsScopeValue;
  const activeTeamIds =
    effectiveSelectedTeamId === allTeamsScopeValue
      ? availableTeams.map((team) => team.id)
      : [effectiveSelectedTeamId];
  const isTeamFilterActive = effectiveSelectedTeamId !== allTeamsScopeValue;
  const scopedTeams = availableTeams.filter((team) => activeTeamIds.includes(team.id));
  const scopedTeamIds = scopedTeams.map((team) => team.id);

  const scopedUsers =
    mode === "MEMBER"
      ? users.filter((member) => member.id === user.id)
      : users.filter((member) => {
          if (isTeamFilterActive) {
            return member.teamIds.some((teamId) => activeTeamIds.includes(teamId));
          }
          if (mode === "DIRECTOR") return true;
          if (mode === "DEPT_HEAD") return member.departmentId === user.departmentId;
          return member.teamIds.some((teamId) => activeTeamIds.includes(teamId));
        });

  const scopedWorklogs = worklogs.filter((worklog) => {
    if (mode === "MEMBER") {
      return worklog.authorId === user.id && activeTeamIds.includes(worklog.teamId);
    }
    return scopedTeamIds.includes(worklog.teamId);
  });
  const scopedNotifications = notifications.filter(
    (notification) => notification.userId === user.id,
  );
  const scopedFiles = files.filter((file) => {
    const worklog = worklogs.find((item) => item.id === file.worklogId);
    if (!worklog) return false;
    if (mode === "MEMBER") return file.uploadedBy === user.id;
    return scopedWorklogs.some((item) => item.id === worklog.id);
  });

  const inProgressWorklogs = scopedWorklogs.filter(
    (worklog) => worklog.status === "IN_PROGRESS",
  );
  const completedWorklogs = scopedWorklogs.filter((worklog) => worklog.status === "DONE");
  const weeklyCompletedWorklogs = completedWorklogs.filter((worklog) =>
    isWithinLastSevenDays(worklog.completionDate),
  );
  const previousWeekStart = new Date(DASHBOARD_NOW);
  previousWeekStart.setDate(previousWeekStart.getDate() - 14);
  const currentWeekStart = new Date(DASHBOARD_NOW);
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  const previousWeeklyCompletedCount = completedWorklogs.filter((worklog) =>
    isBetween(worklog.completionDate, previousWeekStart, currentWeekStart),
  ).length;
  const overdueWorklogs = scopedWorklogs
    .filter((worklog) => isOpenWorklog(worklog) && new Date(worklog.dueDate) < DASHBOARD_NOW)
    .sort(sortByDueDate);
  const dueSoonWorklogs = scopedWorklogs
    .filter((worklog) => {
      const dueDays = daysUntil(worklog.dueDate);
      return isOpenWorklog(worklog) && dueDays >= 0 && dueDays <= 3;
    })
    .sort(sortByDueDate);
  const urgentWorklogs = scopedWorklogs
    .filter((worklog) => isOpenWorklog(worklog) && worklog.importance === "URGENT")
    .sort(sortByDueDate);
  const aiFailedWorklogs = scopedWorklogs.filter((worklog) => worklog.aiStatus === "FAILED");
  const aiFailedFiles = scopedFiles.filter((file) => file.aiStatus === "FAILED");
  const dueRiskWorklogs = [...overdueWorklogs, ...dueSoonWorklogs].filter(
    (worklog, index, source) => source.findIndex((item) => item.id === worklog.id) === index,
  );
  const dueThisWeekWorklogs = scopedWorklogs
    .filter((worklog) => {
      const dueDays = daysUntil(worklog.dueDate);
      return isOpenWorklog(worklog) && dueDays >= 0 && dueDays <= 7;
    })
    .sort(sortByDueDate);
  const totalHours = scopedWorklogs.reduce((sum, worklog) => sum + worklog.actualHours, 0);

  const comparisonMode: DashboardMode =
    mode === "DIRECTOR" && !isTeamFilterActive ? "DIRECTOR" : "DEPT_HEAD";
  const comparisonGroups =
    mode === "DIRECTOR" && !isTeamFilterActive
      ? departments.map((department) => {
          const groupTeams = teams.filter((team) => team.departmentId === department.id);
          return createDashboardGroup(
            department.id,
            department.name,
            groupTeams.map((team) => team.id),
            worklogs,
            users.filter((member) => member.departmentId === department.id),
          );
        })
      : scopedTeams.map((team) =>
          createDashboardGroup(
            team.id,
            team.name,
            [team.id],
            worklogs,
            users.filter((member) => member.teamIds.includes(team.id)),
            users.find((member) => member.id === team.leaderId)?.name,
          ),
        );

  const waitingDependencyWorklogs = scopedWorklogs.filter((worklog) =>
    worklog.dependencyIds.some((dependencyId) => {
      const dependency = worklogs.find((item) => item.id === dependencyId);
      return dependency ? isOpenWorklog(dependency) : false;
    }),
  );
  const teamMemberSummary = scopedUsers.map((member) => {
    const memberWorklogs = scopedWorklogs.filter((worklog) => worklog.authorId === member.id);
    const memberHours = memberWorklogs.reduce((sum, worklog) => sum + worklog.actualHours, 0);
    return {
      id: member.id,
      name: member.name,
      title: member.title,
      inProgress: memberWorklogs.filter((worklog) => worklog.status === "IN_PROGRESS").length,
      overdue: memberWorklogs.filter(
        (worklog) => isOpenWorklog(worklog) && new Date(worklog.dueDate) < DASHBOARD_NOW,
      ).length,
      urgent: memberWorklogs.filter((worklog) => worklog.importance === "URGENT").length,
      hours: memberHours,
      overloaded: memberWorklogs.length >= 10 || memberHours >= 50,
    };
  });

  const roleCopy = getRoleDashboardCopy(mode);
  const adminScopeLabel = isTeamFilterActive
    ? "선택 팀"
    : mode === "DIRECTOR"
      ? "전사"
      : "내 부서";
  const adminGroupUnitLabel = comparisonMode === "DIRECTOR" ? "부서" : "팀";
  return (
    <div className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="대시보드"
        description={roleCopy.description}
      />

      {mode === "DIRECTOR" || mode === "DEPT_HEAD" ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="진행 중인 업무 수"
              value={getProgressRatioValue(inProgressWorklogs.length, scopedWorklogs.length)}
              hint={`${adminScopeLabel} 기간 내 생성 업무 중 진행중 비율`}
              icon={BarChart3}
              tone="default"
            />
            <StatCard
              label={mode === "DIRECTOR" ? "부하 편중 지수" : "팀 부하 편중 지수"}
              value={getLoadBalanceIndex(comparisonGroups)}
              hint={`${adminGroupUnitLabel} 간 업무량 분산도, 1에 가까울수록 균형`}
              icon={Users}
              tone="warning"
            />
            <StatCard
              label="주간 처리 업무 수"
              value={`${weeklyCompletedWorklogs.length}건 (${getTrendSuffix(weeklyCompletedWorklogs.length, previousWeeklyCompletedCount)})`}
              hint={`${adminScopeLabel} 최근 7일 완료 산출`}
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="AI 파이프라인 성공률"
              value={getAiSuccessRate(scopedWorklogs, scopedFiles)}
              hint={`${adminScopeLabel} 업무·파일 통합, 실패 ${aiFailedWorklogs.length + aiFailedFiles.length}건`}
              icon={ShieldAlert}
              tone={aiFailedWorklogs.length + aiFailedFiles.length > 0 ? "warning" : "default"}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <CompletionComparison groups={comparisonGroups} mode={comparisonMode} />
            <RecentNotifications notifications={scopedNotifications} />
            <WorkloadPanel groups={comparisonGroups} mode={comparisonMode} />
            <DueRiskPanel worklogs={dueRiskWorklogs} teams={teams} onOpenWorklog={setPreviewWorklogId} />
          </section>
        </>
      ) : mode === "TEAM_LEAD" ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="진행 중인 업무 수"
              value={getProgressRatioValue(inProgressWorklogs.length, scopedWorklogs.length)}
              hint={
                effectiveSelectedTeamId === allTeamsScopeValue
                  ? "내 모든 리드 팀 통합"
                  : "선택 팀 진행률"
              }
              icon={BarChart3}
              tone="default"
            />
            <StatCard
              label="AI 파이프라인 성공률"
              value={getAiSuccessRate(scopedWorklogs, scopedFiles)}
              hint={`내 팀 업무·파일 통합, 실패 ${aiFailedWorklogs.length + aiFailedFiles.length}건`}
              icon={ShieldAlert}
              tone={aiFailedWorklogs.length + aiFailedFiles.length > 0 ? "warning" : "default"}
            />
            <StatCard
              label="주간 처리 업무 수"
              value={`${weeklyCompletedWorklogs.length}건 (${getTrendSuffix(weeklyCompletedWorklogs.length, previousWeeklyCompletedCount)})`}
              hint="지난 7일 팀 완료 산출"
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="긴급 업무 수"
              value={`${urgentWorklogs.length}건`}
              hint="팀리더 우선 대응 대상"
              icon={Flame}
              tone={urgentWorklogs.length > 0 ? "destructive" : "default"}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <TeamMemberStatusPanel members={teamMemberSummary} />
            <RecentNotifications notifications={scopedNotifications} />
            <WorklogListPanel
              title="긴급 업무 리스트"
              description="중요도 긴급 업무를 먼저 확인하고 바로 상세를 엽니다."
              worklogs={urgentWorklogs}
              emptyText="긴급 업무가 없습니다."
              teams={teams}
              onOpenWorklog={setPreviewWorklogId}
            />
            <DueRiskPanel worklogs={dueRiskWorklogs} teams={teams} onOpenWorklog={setPreviewWorklogId} />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="진행중"
              value={`${inProgressWorklogs.length}건`}
              hint="지금 실행해야 하는 업무"
              icon={BarChart3}
              tone="default"
            />
            <StatCard
              label="완료"
              value={`${weeklyCompletedWorklogs.length}건`}
              hint="기간 내 본인 완료 업무"
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="AI 실패"
              value={`${aiFailedWorklogs.length + aiFailedFiles.length}건`}
              hint="본인 작성/업로드분 재확인"
              icon={ShieldAlert}
              tone={aiFailedWorklogs.length + aiFailedFiles.length > 0 ? "warning" : "default"}
            />
            <StatCard
              label="이번 주 마감"
              value={`${dueThisWeekWorklogs.length}건`}
              hint="본인 업무 중 D-7 이내 마감"
              icon={AlertTriangle}
              tone={dueThisWeekWorklogs.length > 0 ? "warning" : "default"}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
            <div className="xl:col-span-2 2xl:col-span-3">
              <WorklogListPanel
                title="오늘의 업무"
                description="진행중 업무와 마감이 가까운 업무를 우선 배치합니다."
                worklogs={[...inProgressWorklogs, ...dueSoonWorklogs]
                  .filter((worklog, index, source) => source.findIndex((item) => item.id === worklog.id) === index)
                  .sort(sortByDueDate)}
                emptyText="오늘 바로 처리할 업무가 없습니다."
                teams={teams}
                onOpenWorklog={setPreviewWorklogId}
                wide
              />
            </div>
            <div className="xl:col-span-2 2xl:col-span-1">
              <DueRiskPanel worklogs={dueRiskWorklogs} teams={teams} onOpenWorklog={setPreviewWorklogId} compact />
            </div>
            <div className="xl:col-span-2 2xl:col-span-3">
              <WorklogListPanel
                title="선행 업무 대기"
                description="내 업무를 막고 있는 선행 업무와 상태를 함께 확인합니다."
                worklogs={waitingDependencyWorklogs}
                emptyText="선행 업무로 막힌 업무가 없습니다."
                teams={teams}
                onOpenWorklog={setPreviewWorklogId}
                wide
              />
            </div>
            <div className="xl:col-span-2 2xl:col-span-1">
              <WeeklyStatsPanel worklogs={scopedWorklogs} totalHours={totalHours} tags={tags} />
            </div>
          </section>
        </>
      )}

      <WorklogPreviewDialog
        open={previewWorklogId !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewWorklogId(null);
        }}
        worklogId={previewWorklogId}
      />
    </div>
  );
}

function createDashboardGroup(
  id: number,
  name: string,
  teamIds: number[],
  allWorklogs: WorklogRecord[],
  groupUsers: { id: number }[],
  leaderName?: string,
): DashboardGroup {
  const groupWorklogs = allWorklogs.filter((worklog) => teamIds.includes(worklog.teamId));

  return {
    id,
    name,
    total: groupWorklogs.length,
    done: groupWorklogs.filter((worklog) => worklog.status === "DONE").length,
    inProgress: groupWorklogs.filter((worklog) => worklog.status === "IN_PROGRESS").length,
    overdue: groupWorklogs.filter(
      (worklog) => isOpenWorklog(worklog) && new Date(worklog.dueDate) < DASHBOARD_NOW,
    ).length,
    hours: groupWorklogs.reduce((sum, worklog) => sum + worklog.actualHours, 0),
    memberCount: groupUsers.length,
    leaderName,
  };
}

function getRoleDashboardCopy(mode: DashboardMode) {
  const copy = {
    DIRECTOR: {
      title: "전체 본부 운영 스냅샷",
      description: "전사 범위에서 부서 간 편차, 리스크, AI 파이프라인 건강도를 비교합니다.",
      intent: "본부장 뷰는 평균보다 편차를 먼저 보여주고, 문제가 큰 부서나 실패 파이프라인으로 바로 드릴다운하는 의사결정형 화면입니다.",
      filters: ["부서 전체", "기간 자유", "상태/중요도/태그"],
    },
    DEPT_HEAD: {
      title: "내 부서 팀 운영 스냅샷",
      description: "소속 부서 안에서 팀별 완료율과 부하 편중을 비교합니다.",
      intent: "사업부장 뷰는 부서 범위를 고정하고 팀 간 부하와 마감 리스크를 동시에 확인하는 리소스 배분형 화면입니다.",
      filters: ["내 부서 고정", "팀/작성자 선택", "상태/중요도/태그"],
    },
    TEAM_LEAD: {
      title: "팀원 상태 및 긴급 대응",
      description: "리드 팀 범위에서 구성원별 진행 상태와 긴급 업무를 우선 확인합니다.",
      intent: "팀리더 뷰는 순위보다 상태 파악에 집중하고, 긴급 업무와 마감 리스크를 바로 열어 대응하는 운영형 화면입니다.",
      filters: ["내 리드 팀", "팀원 선택", "긴급/마감 중심"],
    },
    MEMBER: {
      title: "개인 실행 및 마감 관리",
      description: "본인 업무만 기준으로 오늘 처리할 업무, 선행 업무 대기, 마감 리스크를 정리합니다.",
      intent: "팀원 뷰는 비교보다 실행을 우선하며, 오늘 할 일과 막힌 이유가 먼저 보이는 개인 작업대입니다.",
      filters: ["작성자 본인 고정", "상태/중요도", "기간/태그"],
    },
  } as const;

  return copy[mode];
}

function ScopeMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-foreground">{value}</p>
    </div>
  );
}

function CompletionComparison({
  groups,
  mode,
}: {
  groups: DashboardGroup[];
  mode: DashboardMode;
}) {
  const chartData = groups.map((group) => ({
    name: group.name.replace("사업부", ""),
    rate: getCompletionRate(group),
    rateLabel: `${getCompletionRate(group)}%`,
    total: group.total,
  }));

  return (
    <CardSpotlight className="h-[380px] rounded-[26px]">
      <CardHeader>
        <CardTitle>
          {mode === "DIRECTOR" ? "부서별 완료율 비교" : "팀별 완료율 비교"}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[285px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={28}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              formatter={(value, _, item) => [
                `${String(value)}% / ${item.payload.total}건`,
                "완료율",
              ]}
            />
            <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.rate >= 70 ? "#34d399" : entry.rate >= 40 ? "#60a5fa" : "#fb7185"}
                />
              ))}
              <LabelList dataKey="rateLabel" position="top" fill="var(--foreground)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </CardSpotlight>
  );
}

function WorkloadPanel({
  groups,
  mode,
}: {
  groups: DashboardGroup[];
  mode: DashboardMode;
}) {
  return (
    <CardSpotlight className="h-[380px] overflow-hidden rounded-[26px]">
      <CardHeader>
        <CardTitle>{mode === "DIRECTOR" ? "부서별 업무 부하" : "팀별 업무 부하"}</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-scrollbar max-h-[276px] space-y-3 overflow-y-auto [scrollbar-gutter:stable]">
        {groups.map((group) => {
          const workloadPerMember = getWorkloadPerMember(group);

          return (
            <div key={group.id} className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{group.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    총 {formatHours(group.hours)} / 구성원 {group.memberCount}명 / 진행중{" "}
                    {group.inProgress}건 / 지연 {group.overdue}건
                  </p>
                  {group.leaderName ? (
                    <p className="mt-1 text-xs text-muted-foreground">팀리더 {group.leaderName}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {formatHours(workloadPerMember)}/명
                  </span>
                  <Badge variant="outline">1인당 업무 부하</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </CardSpotlight>
  );
}

function RecentNotifications({
  notifications,
}: {
  notifications: { id: number; title: string; content: string; isRead: boolean }[];
}) {
  return (
    <CardSpotlight className="h-[380px] overflow-hidden rounded-[26px]">
      <CardHeader>
        <CardTitle>최근 알림</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-scrollbar max-h-[276px] space-y-3 overflow-y-auto [scrollbar-gutter:stable]">
        {notifications.length === 0 ? (
          <EmptyBlock text="최근 알림이 없습니다." />
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{notification.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.content}</p>
                </div>
                {!notification.isRead ? <Badge variant="warning">읽지 않음</Badge> : null}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </CardSpotlight>
  );
}

function TeamMemberStatusPanel({
  members,
}: {
  members: Array<{
    id: number;
    name: string;
    title: string;
    inProgress: number;
    overdue: number;
    urgent: number;
    hours: number;
    overloaded: boolean;
  }>;
}) {
  return (
    <CardSpotlight className="h-[380px] overflow-hidden rounded-[26px]">
      <CardHeader>
        <CardTitle>팀원별 업무 현황</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-scrollbar max-h-[292px] overflow-auto [scrollbar-gutter:stable]">
        <div className="min-w-[620px] overflow-hidden rounded-2xl border border-border/70">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 border-b border-border/70 bg-muted/35 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>팀원</span>
            <span>진행중</span>
            <span>지연</span>
            <span>긴급</span>
            <span>주간 시간</span>
            <span>기준치</span>
          </div>
          {members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 border-b border-border/50 px-4 py-3 text-sm last:border-b-0"
            >
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{member.title}</p>
              </div>
              <span className="font-semibold text-foreground">{member.inProgress}건</span>
              <span className={member.overdue > 0 ? "font-semibold text-rose-500" : "text-muted-foreground"}>
                {member.overdue}건
              </span>
              <span className={member.urgent > 0 ? "font-semibold text-rose-500" : "text-muted-foreground"}>
                {member.urgent}건
              </span>
              <span className="text-muted-foreground">{formatHours(member.hours)}</span>
              <span>
                {member.overloaded ? (
                  <Badge variant="warning">초과</Badge>
                ) : (
                  <Badge variant="outline">정상</Badge>
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </CardSpotlight>
  );
}

function DueRiskPanel({
  worklogs,
  teams,
  onOpenWorklog,
  compact = false,
}: {
  worklogs: WorklogRecord[];
  teams: { id: number; name: string }[];
  onOpenWorklog: (id: number) => void;
  compact?: boolean;
}) {
  return (
    <WorklogListPanel
      title="마감 임박 및 지연"
      description={compact ? "D-3 이내와 마감 초과 업무입니다." : "관리자 뷰와 동일한 D-3 이내 + 지연 기준입니다."}
      worklogs={worklogs}
      emptyText="마감 리스크가 없습니다."
      teams={teams}
      onOpenWorklog={onOpenWorklog}
    />
  );
}

function WorklogListPanel({
  title,
  description,
  worklogs,
  emptyText,
  teams,
  onOpenWorklog,
  wide = false,
}: {
  title: string;
  description: string;
  worklogs: WorklogRecord[];
  emptyText: string;
  teams: { id: number; name: string }[];
  onOpenWorklog: (id: number) => void;
  wide?: boolean;
}) {
  return (
    <CardSpotlight className={cn("overflow-hidden rounded-[26px]", wide ? "min-h-[380px]" : "h-[380px]")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="dashboard-scrollbar max-h-[276px] space-y-3 overflow-y-auto [scrollbar-gutter:stable]">
        {worklogs.length === 0 ? (
          <EmptyBlock text={emptyText} />
        ) : (
          worklogs.slice(0, wide ? 6 : 5).map((worklog) => {
            const dueDays = daysUntil(worklog.dueDate);
            return (
              <button
                key={worklog.id}
                type="button"
                className="block w-full rounded-2xl border border-border/60 bg-muted/25 p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/8"
                onClick={() => onOpenWorklog(worklog.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={worklog.status} />
                      <ImportanceBadge importance={worklog.importance} />
                    </div>
                    <p className="mt-3 font-medium text-foreground">{worklog.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {worklog.aiSummary}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {teams.find((team) => team.id === worklog.teamId)?.name ?? "팀 미지정"} / AI {getAiStatusLabel(worklog.aiStatus)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold",
                      dueDays < 0 ? "text-rose-500" : dueDays <= 3 ? "text-amber-500" : "text-muted-foreground",
                    )}
                  >
                    {dueDays < 0 ? "Delay" : `D-${dueDays}`}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </CardContent>
    </CardSpotlight>
  );
}

function WeeklyStatsPanel({
  worklogs,
  totalHours,
  tags,
}: {
  worklogs: WorklogRecord[];
  totalHours: number;
  tags: TagRecord[];
}) {
  const [tab, setTab] = useState<"WEEK" | "MONTH" | "DONE">("WEEK");
  const done = worklogs.filter((worklog) => worklog.status === "DONE").length;
  const active = worklogs.filter((worklog) => worklog.status === "IN_PROGRESS").length;
  const urgent = worklogs.filter((worklog) => worklog.importance === "URGENT").length;
  const tagUsage = tags
    .map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: worklogs.filter((worklog) => worklog.tagIds.includes(tag.id)).length,
    }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const recentDone = worklogs
    .filter((worklog) => worklog.status === "DONE")
    .sort((a, b) => new Date(b.completionDate ?? b.updatedAt).getTime() - new Date(a.completionDate ?? a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <CardSpotlight className="min-h-[380px] rounded-[26px]">
      <CardHeader>
        <CardTitle>이번 주 통계</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          업무시간, 태그 분포, 최근 완료 업무를 탭으로 확인합니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex rounded-2xl border border-border/70 bg-muted/20 p-1">
          {[
            ["WEEK", "이번 주"],
            ["MONTH", "이번 달"],
            ["DONE", "최근 완료"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all",
                tab === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTab(value as "WEEK" | "MONTH" | "DONE")}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "DONE" ? (
          <div className="space-y-2">
            {recentDone.length === 0 ? (
              <EmptyBlock text="최근 완료 업무가 없습니다." />
            ) : (
              recentDone.map((worklog) => (
                <div key={worklog.id} className="rounded-xl border border-border/60 bg-muted/25 px-4 py-3">
                  <p className="font-medium text-foreground">{worklog.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    완료일 {worklog.completionDate ? formatDate(worklog.completionDate) : "-"}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            <ScopeMetric label={tab === "WEEK" ? "이번 주 업무시간" : "이번 달 업무시간"} value={formatHours(totalHours)} />
            <ScopeMetric label="진행중" value={`${active}건`} />
            <ScopeMetric label="완료" value={`${done}건`} />
            <ScopeMetric label="긴급" value={`${urgent}건`} />
            <div className="rounded-xl border border-border/60 bg-background/40 px-3 py-3">
              <p className="text-[11px] text-muted-foreground">태그별 분포</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tagUsage.length === 0 ? (
                  <span className="text-sm text-muted-foreground">태그 데이터 없음</span>
                ) : (
                  tagUsage.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      #{tag.name} {tag.count}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </CardSpotlight>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-5 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
