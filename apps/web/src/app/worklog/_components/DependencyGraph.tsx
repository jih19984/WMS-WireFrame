import { worklogs } from "@/app/_common/service/mock-db";
import { Badge } from "@/components/ui/badge";

export function DependencyGraph({ dependencyIds }: { dependencyIds: number[] }) {
  const dependencies = worklogs.filter((worklog) => dependencyIds.includes(worklog.id));

  if (dependencies.length === 0) {
    return <p className="text-sm text-muted-foreground">선행 업무가 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {dependencies.map((dependency) => (
        <div key={dependency.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{dependency.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{dependency.aiSummary}</p>
            </div>
            <Badge>{dependency.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
