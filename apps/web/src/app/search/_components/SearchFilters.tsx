import { getVisibleDepartments, getVisibleTeams, getVisibleUsers } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departments, tags, teams, users } from "@/app/_common/service/mock-db";
import { Select } from "@/components/ui/select";
import type { SearchFiltersValue } from "@/app/search/_types/search.types";
import { getImportanceLabel, getWorklogStatusLabel } from "@/lib/utils";

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

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Select
        value={value.sourceType}
        options={[
          { label: "전체 출처", value: "all" },
          { label: "업무일지", value: "WORKLOG" },
          { label: "파일", value: "FILE" },
        ]}
        onChange={(event) => onChange({ ...value, sourceType: event.target.value })}
      />
      <Select
        value={value.departmentId}
        options={[{ label: "전체 부서", value: "all" }, ...visibleDepartments.map((department) => ({ label: department.name, value: String(department.id) }))]}
        onChange={(event) => onChange({ ...value, departmentId: event.target.value })}
      />
      <Select
        value={value.teamId}
        options={[{ label: "전체 팀", value: "all" }, ...visibleTeams.map((team) => ({ label: team.name, value: String(team.id) }))]}
        onChange={(event) => onChange({ ...value, teamId: event.target.value })}
      />
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
      <Select
        value={value.authorId}
        options={[{ label: "전체 작성자", value: "all" }, ...visibleUsers.map((member) => ({ label: member.name, value: String(member.id) }))]}
        onChange={(event) => onChange({ ...value, authorId: event.target.value })}
      />
      <Select
        value={value.tagId}
        options={[{ label: "전체 태그", value: "all" }, ...tags.map((tag) => ({ label: `#${tag.name}`, value: String(tag.id) }))]}
        onChange={(event) => onChange({ ...value, tagId: event.target.value })}
      />
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
    </div>
  );
}
