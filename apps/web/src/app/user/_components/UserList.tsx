import { Link } from "react-router-dom";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserProfile } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEmploymentStatusLabel, getRoleLabel } from "@/lib/utils";

export function UserList({ users, readOnly = false }: { users: UserProfile[]; readOnly?: boolean }) {
  return (
    <div className="workspace-list worklog-divider-top gap-0">
      {users.map((user) => (
        <article
          key={user.id}
          className="worklog-divider-item group relative py-4.5 last:border-b-0"
        >
          <div className="grid gap-x-8 gap-y-4 px-1 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0 space-y-3">
              <div className="flex items-start gap-4">
                <Avatar className="size-12 ring-1 ring-white/8">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-primary/18 text-primary font-[600]">
                    {user.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[17px] font-[700] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
                      {user.name}
                    </p>
                    <Badge variant="default" className="px-2.5 tracking-tight">
                      {getRoleLabel(user.role)}
                    </Badge>
                    <Badge
                      variant={
                        user.employmentStatus === "ACTIVE"
                          ? "success"
                          : user.employmentStatus === "LEAVE"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {getEmploymentStatusLabel(user.employmentStatus)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[14px] text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user.position} · {user.title} · 연락처 {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                    부서
                  </span>
                  <span className="truncate font-medium text-foreground/92">
                    {departments.find((department) => department.id === user.departmentId)?.name}
                  </span>
                </div>
                <span className="hidden h-4 w-px bg-border/80 md:block" />
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                    주 소속 팀
                  </span>
                  <span className="truncate font-medium text-foreground/92">
                    {teams.find((team) => team.id === user.primaryTeamId)?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="text-left lg:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                  입사일
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground/90">{user.joinDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="h-11 min-w-28 px-5 text-sm font-semibold" asChild>
                  <Link to={`/user/detail/${user.id}`}>상세</Link>
                </Button>
                {!readOnly && (
                  <Button variant="default" className="h-11 min-w-28 px-5 text-sm font-semibold" asChild>
                    <Link to={`/user/edit/${user.id}`}>수정</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
