import type { Worklog } from "@/app/worklog/_types/worklog.types";

export function StatusHistory({ worklog }: { worklog: Worklog }) {
  const items = [
    { label: "생성", value: worklog.createdAt },
    { label: "최근 수정", value: worklog.updatedAt },
    ...(worklog.completionDate ? [{ label: "완료", value: worklog.completionDate }] : []),
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
