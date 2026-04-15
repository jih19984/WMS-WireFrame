import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { StatCard } from "@/app/_common/components/StatCard";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { useDepartment } from "@/app/department/_hooks/useDepartment";
import { useNotification } from "@/app/notification/_hooks/useNotification";
import { useTeam } from "@/app/team/_hooks/useTeam";
import { useUser } from "@/app/user/_hooks/useUser";
import { useWorklog } from "@/app/worklog/_hooks/useWorklog";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  cn,
  formatDate,
  formatHours,
  getAiStatusLabel,
  getImportanceLabel,
  getWorklogStatusLabel,
} from "@/lib/utils";

const statusVariantMap = {
  DONE: "success",
  ON_HOLD: "warning",
  IN_PROGRESS: "default",
  PENDING: "outline",
  CANCELLED: "destructive",
} as const;

const importanceVariantMap = {
  URGENT: "destructive",
  HIGH: "warning",
  NORMAL: "secondary",
  LOW: "outline",
} as const;

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - new Date("2026-04-13T00:00:00").getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { worklogs } = useWorklog();
  const { notifications, unreadCount } = useNotification();
  const { users } = useUser();
  const { teams } = useTeam();
  const { departments } = useDepartment();

  if (!user) return null;

  const isAdmin = user.role === "DIRECTOR" || user.role === "DEPT_HEAD";
  const isTeamLead = user.role === "TEAM_LEAD";
  const now = new Date("2026-04-13T00:00:00");

  const overdueWorklogs = worklogs.filter(
    (worklog) =>
      worklog.status !== "DONE" &&
      worklog.status !== "CANCELLED" &&
      new Date(worklog.dueDate) < now,
  );
  const dueSoonWorklogs = worklogs.filter((worklog) => {
    const dueDays = daysUntil(worklog.dueDate);
    return (
      worklog.status !== "DONE" &&
      worklog.status !== "CANCELLED" &&
      dueDays >= 0 &&
      dueDays <= (isAdmin ? 3 : 7)
    );
  });
  const inProgressWorklogs = worklogs.filter(
    (worklog) => worklog.status === "IN_PROGRESS",
  );
  const recentCompletedWorklogs = worklogs
    .filter((worklog) => worklog.status === "DONE")
    .slice(0, 4);
  const totalHours = worklogs.reduce((sum, worklog) => sum + worklog.actualHours, 0);
  const aiFailedCount = worklogs.filter((worklog) => worklog.aiStatus === "FAILED").length;

  const statusData = [
    {
      name: "진행중",
      value: inProgressWorklogs.length,
      fill: "#3bd3fd",
    },
    {
      name: "대기",
      value: worklogs.filter((worklog) => worklog.status === "PENDING").length,
      fill: "#fbbd41",
    },
    {
      name: "완료",
      value: recentCompletedWorklogs.length,
      fill: "#84e7a5",
    },
    {
      name: "보류",
      value: worklogs.filter((worklog) => worklog.status === "ON_HOLD").length,
      fill: "#c1b0ff",
    },
  ];

  const departmentWorkload = departments.map((department) => {
    const departmentTeams = teams.filter(
      (team) => team.departmentId === department.id,
    );
    const departmentUsers = users.filter(
      (member) => member.departmentId === department.id,
    );
    const departmentWorklogs = worklogs.filter((worklog) =>
      departmentTeams.some((team) => team.id === worklog.teamId),
    );

    return {
      id: department.id,
      name: department.name,
      inProgress: departmentWorklogs.filter(
        (worklog) => worklog.status === "IN_PROGRESS",
      ).length,
      totalHours: departmentWorklogs.reduce(
        (sum, worklog) => sum + worklog.actualHours,
        0,
      ),
      members: departmentUsers.length,
    };
  });

  const teamMemberSummary = isTeamLead
    ? users
        .filter((member) =>
          member.teamIds.some((teamId) => user.teamIds.includes(teamId)),
        )
        .map((member) => {
          const memberWorklogs = worklogs.filter((worklog) => worklog.authorId === member.id);
          return {
            id: member.id,
            name: member.name,
            title: member.title,
            inProgress: memberWorklogs.filter(
              (worklog) => worklog.status === "IN_PROGRESS",
            ).length,
            overdue: memberWorklogs.filter(
              (worklog) =>
                worklog.status !== "DONE" &&
                worklog.status !== "CANCELLED" &&
                new Date(worklog.dueDate) < now,
            ).length,
          };
        })
    : [];

  return (
    <div className="flex flex-col gap-5 pb-12">
      <PageHeader title="대시보드" />
      {isAdmin ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="가시 범위 업무"
              value={worklogs.length}
              hint="권한 범위 내 전체 업무"
              icon={BarChart3}
              tone="default"
            />
            <StatCard
              label="마감 임박/지연"
              value={dueSoonWorklogs.length + overdueWorklogs.length}
              hint="D-3 이내 또는 지연 업무"
              icon={AlertTriangle}
              tone={overdueWorklogs.length > 0 ? "destructive" : "warning"}
            />
            <StatCard
              label="AI 실패"
              value={aiFailedCount}
              hint="재시도가 필요한 AI 처리"
              icon={Clock3}
              tone={aiFailedCount > 0 ? "warning" : "default"}
            />
            <StatCard
              label="미확인 알림"
              value={unreadCount}
              hint="긴급/부하/의존성 알림"
              icon={Users}
              tone={unreadCount > 0 ? "warning" : "default"}
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <CardSpotlight className="h-[360px] rounded-[26px]">
              <CardHeader>
                <CardTitle>업무 상태 분포</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} barCategoryGap={30}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip cursor={{ fill: "var(--muted)" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </CardSpotlight>

            <CardSpotlight className="h-[360px] rounded-[26px]">
              <CardHeader>
                <CardTitle>마감 임박 및 지연</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...overdueWorklogs, ...dueSoonWorklogs].slice(0, 5).map((worklog) => {
                  const isOverdue = overdueWorklogs.some((item) => item.id === worklog.id);

                  return (
                    <div
                      key={worklog.id}
                      className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{worklog.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {teams.find((team) => team.id === worklog.teamId)?.name} / {formatDate(worklog.dueDate)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-sm font-semibold tracking-[-0.01em]",
                            isOverdue ? "text-rose-500" : "text-amber-500",
                          )}
                        >
                          {isOverdue ? "Delay" : `D-${daysUntil(worklog.dueDate)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </CardSpotlight>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <CardSpotlight className="h-[360px] rounded-[26px]">
              <CardHeader>
                <CardTitle>부서별 업무 부하</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {departmentWorkload.map((department) => (
                  <div
                    key={department.id}
                    className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{department.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          구성원 {department.members}명 / 진행중 업무 {department.inProgress}건
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 text-sm font-semibold tracking-[-0.01em]",
                          department.inProgress >= 3 || department.totalHours >= 12
                            ? "text-amber-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatHours(department.totalHours)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CardSpotlight>

            <CardSpotlight className="h-[360px] rounded-[26px]">
              <CardHeader>
                <CardTitle>최근 알림</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.content}</p>
                      </div>
                      {!notification.isRead ? <Badge variant="warning">읽지 않음</Badge> : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </CardSpotlight>
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="진행중 업무"
              value={inProgressWorklogs.length}
              hint="우선순위 순으로 처리 중인 업무"
              icon={BarChart3}
              tone="default"
            />
            <StatCard
              label="마감 예정"
              value={dueSoonWorklogs.length}
              hint="D-7 이내 미완료 업무"
              icon={AlertTriangle}
              tone={dueSoonWorklogs.length > 0 ? "warning" : "default"}
            />
            <StatCard
              label="최근 완료"
              value={recentCompletedWorklogs.length}
              hint="최근 마감 완료 업무"
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="누적 업무시간"
              value={formatHours(totalHours)}
              hint="현재 가시 범위 내 업무시간 합계"
              icon={Clock3}
              tone="default"
            />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <CardSpotlight className="rounded-[26px]">
              <CardHeader>
                <CardTitle>진행중 업무</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inProgressWorklogs.map((worklog) => (
                  <div
                    key={worklog.id}
                    className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusVariantMap[worklog.status]}>
                            {getWorklogStatusLabel(worklog.status)}
                          </Badge>
                          <Badge variant={importanceVariantMap[worklog.importance]}>
                            {getImportanceLabel(worklog.importance)}
                          </Badge>
                        </div>
                        <p className="mt-3 font-medium">{worklog.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {worklog.aiSummary}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>마감 {formatDate(worklog.dueDate)}</p>
                        <p className="mt-1">AI {getAiStatusLabel(worklog.aiStatus)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CardSpotlight>

            <CardSpotlight className="rounded-[26px]">
              <CardHeader>
                <CardTitle>최근 완료 및 알림</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCompletedWorklogs.map((worklog) => (
                  <div
                    key={worklog.id}
                    className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <p className="font-medium">{worklog.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      완료일 {worklog.completionDate ? formatDate(worklog.completionDate) : "-"}
                    </p>
                  </div>
                ))}
                {notifications.slice(0, 2).map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.content}</p>
                  </div>
                ))}
              </CardContent>
            </CardSpotlight>
          </section>

          {isTeamLead ? (
            <section>
              <CardSpotlight className="rounded-[26px]">
                <CardHeader>
                  <CardTitle>팀원 업무 현황 요약</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {teamMemberSummary.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-border/60 bg-muted/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{member.title}</p>
                        </div>
                        <Badge
                          variant={member.overdue > 0 ? "destructive" : "outline"}
                        >
                          진행중 {member.inProgress}건
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CardSpotlight>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
