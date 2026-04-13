import type { FileFiltersValue } from "@/app/file/_types/file.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAiStatusLabel } from "@/lib/utils";

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
    <div className="grid gap-3 md:grid-cols-[180px_180px_180px_1fr]">
      <Select
        value={value.type}
        options={[{ label: "전체 형식", value: "ALL" }, ...fileTypes.map((type) => ({ label: type, value: type }))]}
        onChange={(event) => onChange({ ...value, type: event.target.value })}
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
            period: event.target.value as FileFiltersValue["period"],
          })
        }
      />
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
      <Input
        value={value.summaryKeyword}
        onChange={(event) => onChange({ ...value, summaryKeyword: event.target.value })}
        placeholder="AI 요약 키워드 또는 파일명 검색"
      />
    </div>
  );
}
