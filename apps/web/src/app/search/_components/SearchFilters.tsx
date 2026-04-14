import {
  getVisibleDepartments,
  getVisibleTeams,
  getVisibleUsers,
  isDepartmentHead,
  isDirector,
  isTeamLead,
} from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, tags, teams, users } from "@/app/_common/service/mock-db";
import { Select } from "@/components/ui/select";
import type { SearchFiltersValue } from "@/app/search/_types/search.types";
import { cn, getRoleLabel, getImportanceLabel, getWorklogStatusLabel } from "@/lib/utils";

export function SearchFilters({
  value,
  onChange,
}: {
  value: SearchFiltersValue;
  onChange: (value: SearchFiltersValue) => void;
}) {
  const { user } = useAuth();
  const visibleDepartments = getVisibleDepartments(user, departments);
  const visibleTeams = getVisibleTeams(user, teams);
  const visibleUsers = getVisibleUsers(user, users);
  const userRoleLabel = user ? getRoleLabel(user.role) : "구성원";

  const fieldClassName = "space-y-2";
  const labelClassName = "text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground";

  const visibleFields = [
    {
      key: "sourceType",
      label: "출처",
      control: (
        <Select
          value={value.sourceType}
          options={[
            { label: "전체 출처", value: "all" },
            { label: "업무일지", value: "WORKLOG" },
            { label: "파일", value: "FILE" },
          ]}
          onChange={(event) => onChange({ ...value, sourceType: event.target.value })}
        />
      ),
    },
    ...(user && isDirector(user)
      ? [
          {
            key: "departmentId",
            label: "부서",
            control: (
              <Select
                value={value.departmentId}
                options={[
                  { label: "전체 부서", value: "all" },
                  ...visibleDepartments.map((department) => ({
                    label: department.name,
                    value: String(department.id),
                  })),
                ]}
                onChange={(event) => onChange({ ...value, departmentId: event.target.value })}
              />
            ),
          },
        ]
      : []),
    ...(user && (isDirector(user) || isDepartmentHead(user))
      ? [
          {
            key: "teamId",
            label: "팀",
            control: (
              <Select
                value={value.teamId}
                options={[
                  { label: "전체 팀", value: "all" },
                  ...visibleTeams.map((team) => ({ label: team.name, value: String(team.id) })),
                ]}
                onChange={(event) => onChange({ ...value, teamId: event.target.value })}
              />
            ),
          },
        ]
      : []),
    {
      key: "status",
      label: "상태",
      control: (
        <Select
          value={value.status}
          options={[
            { label: "전체 상태", value: "all" },
            { label: getWorklogStatusLabel("IN_PROGRESS"), value: "IN_PROGRESS" },
            { label: getWorklogStatusLabel("DONE"), value: "DONE" },
            { label: getWorklogStatusLabel("ON_HOLD"), value: "ON_HOLD" },
          ]}
          onChange={(event) => onChange({ ...value, status: event.target.value })}
        />
      ),
    },
    {
      key: "importance",
      label: "중요도",
      control: (
        <Select
          value={value.importance}
          options={[
            { label: "전체 중요도", value: "all" },
            { label: getImportanceLabel("URGENT"), value: "URGENT" },
            { label: getImportanceLabel("HIGH"), value: "HIGH" },
            { label: getImportanceLabel("NORMAL"), value: "NORMAL" },
            { label: getImportanceLabel("LOW"), value: "LOW" },
          ]}
          onChange={(event) => onChange({ ...value, importance: event.target.value })}
        />
      ),
    },
    ...(user && (isDirector(user) || isDepartmentHead(user) || isTeamLead(user))
      ? [
          {
            key: "authorId",
            label: "작성자",
            control: (
              <Select
                value={value.authorId}
                options={[
                  { label: "전체 작성자", value: "all" },
                  ...visibleUsers.map((member) => ({
                    label: member.name,
                    value: String(member.id),
                  })),
                ]}
                onChange={(event) => onChange({ ...value, authorId: event.target.value })}
              />
            ),
          },
        ]
      : []),
    {
      key: "tagId",
      label: "태그",
      control: (
        <Select
          value={value.tagId}
          options={[
            { label: "전체 태그", value: "all" },
            ...tags.map((tag) => ({ label: `#${tag.name}`, value: String(tag.id) })),
          ]}
          onChange={(event) => onChange({ ...value, tagId: event.target.value })}
        />
      ),
    },
    {
      key: "period",
      label: "기간",
      control: (
        <Select
          value={value.period}
          options={[
            { label: "전체 기간", value: "ALL" },
            { label: "최근 7일", value: "7D" },
            { label: "최근 30일", value: "30D" },
            { label: "최근 90일", value: "90D" },
          ]}
          onChange={(event) =>
            onChange({
              ...value,
              period: event.target.value as SearchFiltersValue["period"],
            })
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="workspace-panel-inset rounded-2xl px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Search Scope
        </p>
        <p className="mt-1 text-sm text-foreground">
          {userRoleLabel} 권한 기준으로 볼 수 있는 필터만 노출합니다.
        </p>
      </div>
      <div className={cn("grid gap-4", visibleFields.length >= 8 ? "xl:grid-cols-4 md:grid-cols-3" : "xl:grid-cols-3 md:grid-cols-2")}>
        {visibleFields.map((field) => (
          <div key={field.key} className={fieldClassName}>
            <p className={labelClassName}>{field.label}</p>
            {field.control}
          </div>
        ))}
      </div>
    </div>
  );
}
