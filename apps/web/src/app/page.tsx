import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { StatCard } from "@/app/_common/components/StatCard";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, notifications, teams, users, worklogs } from "@/app/_common/service/mock-db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const visibleWorklogs =
    user.role === "DIRECTOR"
      ? worklogs
      : user.role === "DEPT_HEAD"
        ? worklogs.filter(
            (worklog) =>
              teams.find((team) => team.id === worklog.teamId)?.departmentId === user.departmentId
          )
        : user.role === "TEAM_LEAD"
          ? worklogs.filter((worklog) => user.teamIds.includes(worklog.teamId))
          : worklogs.filter((worklog) => worklog.authorId === user.id);

  const statusData = [
    { name: "진행중", value: visibleWorklogs.filter((worklog) => worklog.status === "IN_PROGRESS").length },
    { name: "대기", value: visibleWorklogs.filter((worklog) => worklog.status === "PENDING").length },
    { name: "완료", value: visibleWorklogs.filter((worklog) => worklog.status === "DONE").length },
    { name: "보류", value: visibleWorklogs.filter((worklog) => worklog.status === "ON_HOLD").length },
  ];

  const alerts = notifications.filter((notification) => !notification.isRead);

  return (
    <>
      <PageHeader
        title={`${user.name}님, 오늘도 반갑습니다`}
        description="역할 범위에 맞는 업무 현황과 알림, AI 처리 상태를 한 화면에서 확인할 수 있습니다."
        actions={
          <>
            <Badge variant="outline">{user.role}</Badge>
            <Button>새 업무 등록</Button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard
          label="Open Worklogs"
          value={visibleWorklogs.length}
          hint="현재 접근 가능한 업무 수"
          icon={BarChart3}
        />
        <StatCard
          label="Overdue"
          value={visibleWorklogs.filter((worklog) => new Date(worklog.dueDate) < new Date()).length}
          hint="마감일 경과 업무"
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="AI Failed"
          value={visibleWorklogs.filter((worklog) => worklog.aiStatus === "FAILED").length}
          hint="AI 처리 실패 상태"
          icon={Clock3}
          tone="destructive"
        />
        <StatCard
          label="Members"
          value={users.filter((item) => item.status === "ACTIVE").length}
          hint="현재 재직 인원"
          icon={Users}
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>업무 상태 분포</CardTitle>
            <CardDescription>역할 범위 내 업무 상태를 막대 차트로 요약합니다.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#eef2ff" }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>마감 임박 및 알림</CardTitle>
            <CardDescription>읽지 않은 알림과 최근 업무 흐름을 빠르게 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => {
              const relatedWorklog = alert.referenceId
                ? worklogs.find((worklog) => worklog.id === alert.referenceId)
                : undefined;
              const relatedTeam = relatedWorklog
                ? teams.find((team) => team.id === relatedWorklog.teamId)
                : undefined;
              const relatedDepartment = relatedTeam
                ? departments.find((department) => department.id === relatedTeam.departmentId)
                : undefined;

              return (
                <div key={alert.id} className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{alert.title}</p>
                        {user.role === "DIRECTOR" && relatedDepartment ? (
                          <Badge variant="outline">{relatedDepartment.name}</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.content}</p>
                    </div>
                    <Badge>{alert.type}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>최근 업무</CardTitle>
            <CardDescription>생성일과 AI 상태를 함께 보여주는 카드형 업무 리스트입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleWorklogs.map((worklog) => (
              <div key={worklog.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          worklog.status === "DONE"
                            ? "success"
                            : worklog.status === "ON_HOLD"
                              ? "warning"
                              : "default"
                        }
                      >
                        {worklog.status}
                      </Badge>
                      <Badge
                        variant={
                          worklog.importance === "URGENT"
                            ? "destructive"
                            : worklog.importance === "HIGH"
                              ? "warning"
                              : "outline"
                        }
                      >
                        {worklog.importance}
                      </Badge>
                    </div>
                    <p className="font-medium">{worklog.title}</p>
                    <p className="text-sm text-muted-foreground">{worklog.aiSummary}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDate(worklog.updatedAt)}</p>
                    <p className="mt-1 inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" />
                      AI {worklog.aiStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>조직 현황</CardTitle>
            <CardDescription>부서와 팀 수, 활성 프로젝트를 간단히 요약합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((department) => (
              <div key={department.id} className="rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{department.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{department.description}</p>
                  </div>
                  <Badge variant="secondary">{department.activeProjects} 프로젝트</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
