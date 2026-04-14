import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { Pagination } from "@/app/_common/components/Pagination";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { useAuth } from "@/app/_common/hooks/useAuth";
import {
  canManageUsers,
  getVisibleDepartments,
  getVisibleTeams,
} from "@/app/_common/service/access-control";
import { departments, teams } from "@/app/_common/service/mock-db";
import { useUser } from "@/app/user/_hooks/useUser";
import { UserList } from "@/app/user/_components/UserList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn, getEmploymentStatusLabel, getRoleLabel } from "@/lib/utils";

const DEFAULT_FILTERS = {
  departmentId: "all",
  teamId: "all",
  role: "all",
  employmentStatus: "all",
};

export default function UserPage() {
  const { user } = useAuth();
  const { users } = useUser();
  const canManage = canManageUsers(user);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const visibleDepartments = getVisibleDepartments(user, departments);
  const visibleTeams = getVisibleTeams(user, teams);
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all",
  ).length;

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((member) => {
      const departmentName =
        departments.find((department) => department.id === member.departmentId)?.name ?? "";
      const primaryTeamName =
        teams.find((team) => team.id === member.primaryTeamId)?.name ?? "";
      const teamNames = teams
        .filter((team) => member.teamIds.includes(team.id))
        .map((team) => team.name)
        .join(" ");
      const searchableText = [
        member.name,
        member.email,
        member.position,
        member.title,
        member.phone,
        departmentName,
        primaryTeamName,
        teamNames,
        getRoleLabel(member.role),
        getEmploymentStatusLabel(member.employmentStatus),
      ]
        .join(" ")
        .toLowerCase();

      const queryMatch = !normalizedQuery || searchableText.includes(normalizedQuery);
      const departmentMatch =
        filters.departmentId === "all" ||
        String(member.departmentId) === filters.departmentId;
      const teamMatch =
        filters.teamId === "all" || member.teamIds.includes(Number(filters.teamId));
      const roleMatch = filters.role === "all" || member.role === filters.role;
      const statusMatch =
        filters.employmentStatus === "all" ||
        member.employmentStatus === filters.employmentStatus;

      return queryMatch && departmentMatch && teamMatch && roleMatch && statusMatch;
    });
  }, [filters, query, users]);

  const userPagination = usePagination(filteredUsers, 6);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="사용자 관리" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">
            사용자 탐색
          </h2>
          {canManage ? (
            <Button asChild variant="default" className="h-10 min-w-32 px-6 text-sm font-semibold">
              <Link to="/user/create">사용자 등록</Link>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 pl-11"
                placeholder="이름, 이메일, 부서, 팀, 직급으로 검색하세요"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="size-4" />
                필터
                {activeFilterCount > 0 ? (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "ml-1 size-4 transition-transform duration-300 ease-out",
                    showFilters && "rotate-180",
                  )}
                />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
              showFilters
                ? "mt-0 grid-rows-[1fr] opacity-100"
                : "mt-[-4px] grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    User Filters
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    aria-label="필터 초기화"
                    onClick={() => {
                      setQuery("");
                      setFilters(DEFAULT_FILTERS);
                    }}
                  >
                    <RefreshCw className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      부서
                    </p>
                    <Select
                      value={filters.departmentId}
                      options={[
                        { label: "전체 부서", value: "all" },
                        ...visibleDepartments.map((department) => ({
                          label: department.name,
                          value: String(department.id),
                        })),
                      ]}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          departmentId: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      팀
                    </p>
                    <Select
                      value={filters.teamId}
                      options={[
                        { label: "전체 팀", value: "all" },
                        ...visibleTeams.map((team) => ({
                          label: team.name,
                          value: String(team.id),
                        })),
                      ]}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          teamId: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      권한
                    </p>
                    <Select
                      value={filters.role}
                      options={[
                        { label: "전체 권한", value: "all" },
                        { label: getRoleLabel("DIRECTOR"), value: "DIRECTOR" },
                        { label: getRoleLabel("DEPT_HEAD"), value: "DEPT_HEAD" },
                        { label: getRoleLabel("TEAM_LEAD"), value: "TEAM_LEAD" },
                        { label: getRoleLabel("MEMBER"), value: "MEMBER" },
                      ]}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          role: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      재직 상태
                    </p>
                    <Select
                      value={filters.employmentStatus}
                      options={[
                        { label: "전체 상태", value: "all" },
                        { label: getEmploymentStatusLabel("ACTIVE"), value: "ACTIVE" },
                        { label: getEmploymentStatusLabel("LEAVE"), value: "LEAVE" },
                        { label: getEmploymentStatusLabel("INACTIVE"), value: "INACTIVE" },
                      ]}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          employmentStatus: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-4">
        <div className="worklog-divider-top" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">표시 중인 사용자</span>
          <span className="text-lg font-semibold text-foreground">{filteredUsers.length}명</span>
        </div>
        <UserList users={userPagination.items} readOnly={!canManage} />
        <Pagination
          page={userPagination.page}
          totalPages={userPagination.totalPages}
          onPageChange={userPagination.setPage}
        />
      </div>
    </div>
  );
}
