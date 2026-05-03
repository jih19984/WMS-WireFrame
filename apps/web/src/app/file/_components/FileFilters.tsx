import type { FileFiltersValue } from "@/app/file/_types/file.types";
import { worklogStatusLegendOrder } from "@/app/worklog/_components/worklog-badge-config";
import { Select } from "@/components/ui/select";
import { getAiStatusLabel, getWorklogStatusLabel } from "@/lib/utils";

export function FileFilters({
  value,
  onChange,
  fileTypes,
}: {
  value: FileFiltersValue;
  onChange: (value: FileFiltersValue) => void;
  fileTypes: string[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">형식</p>
        <Select
          value={value.type}
          options={[{ label: "전체 형식", value: "ALL" }, ...fileTypes.map((type) => ({ label: type, value: type }))]}
          onChange={(event) => onChange({ ...value, type: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">기간</p>
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
              period: event.target.value as FileFiltersValue["period"],
            })
          }
        />
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">AI 상태</p>
        <Select
          value={value.aiStatus}
          options={[
            { label: "전체 AI 상태", value: "ALL" },
            { label: getAiStatusLabel("PENDING"), value: "PENDING" },
            { label: getAiStatusLabel("PROCESSING"), value: "PROCESSING" },
            { label: getAiStatusLabel("DONE"), value: "DONE" },
            { label: getAiStatusLabel("FAILED"), value: "FAILED" },
          ]}
          onChange={(event) => onChange({ ...value, aiStatus: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">업무 상태</p>
        <Select
          value={value.worklogStatus}
          options={[
            { label: "전체 업무 상태", value: "ALL" },
            ...worklogStatusLegendOrder.map((status) => ({
              label: getWorklogStatusLabel(status),
              value: status,
            })),
          ]}
          onChange={(event) =>
            onChange({
              ...value,
              worklogStatus: event.target.value as FileFiltersValue["worklogStatus"],
            })
          }
        />
      </div>
    </div>
  );
}
