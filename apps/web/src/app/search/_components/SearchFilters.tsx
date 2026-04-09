import { departments, teams } from "@/app/_common/service/mock-db";
import { Select } from "@/components/ui/select";
import type { SearchFiltersValue } from "@/app/search/_types/search.types";

export function SearchFilters({
  value,
  onChange,
}: {
  value: SearchFiltersValue;
  onChange: (value: SearchFiltersValue) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select
        value={value.departmentId}
        options={[{ label: "전체 부서", value: "all" }, ...departments.map((department) => ({ label: department.name, value: String(department.id) }))]}
        onChange={(event) => onChange({ ...value, departmentId: event.target.value })}
      />
      <Select
        value={value.teamId}
        options={[{ label: "전체 팀", value: "all" }, ...teams.map((team) => ({ label: team.name, value: String(team.id) }))]}
        onChange={(event) => onChange({ ...value, teamId: event.target.value })}
      />
      <Select
        value={value.status}
        options={[
          { label: "전체 상태", value: "all" },
          { label: "IN_PROGRESS", value: "IN_PROGRESS" },
          { label: "DONE", value: "DONE" },
          { label: "ON_HOLD", value: "ON_HOLD" },
        ]}
        onChange={(event) => onChange({ ...value, status: event.target.value })}
      />
    </div>
  );
}
