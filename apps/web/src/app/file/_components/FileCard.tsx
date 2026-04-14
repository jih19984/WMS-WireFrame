import { Link } from "react-router-dom";
import { worklogs } from "@/app/_common/service/mock-db";
import { FileAiStatusBadge } from "@/app/file/_components/FileAiStatusBadge";
import type { FileItem } from "@/app/file/_types/file.types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";

export function FileCard({
  file,
  selected,
  onToggleSelect,
}: {
  file: FileItem;
  selected: boolean;
  onToggleSelect: (fileId: number, checked: boolean) => void;
}) {
  const worklog = worklogs.find((item) => item.id === file.worklogId);

  return (
    <article className="worklog-divider-item py-5 last:border-b-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={selected}
              onChange={(event) => onToggleSelect(file.id, event.target.checked)}
              aria-label={`${file.originalName} 선택`}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                  {file.originalName}
                </p>
                <FileAiStatusBadge status={file.aiStatus} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-sm leading-7 text-muted-foreground">
            {file.summaryPreview}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">소속 업무일지</span>
            {worklog ? (
              <Link to={`/worklog/detail/${worklog.id}`} className="font-medium text-primary hover:underline">
                {worklog.title}
              </Link>
            ) : (
              <span className="text-muted-foreground">연결 없음</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 text-sm text-muted-foreground lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <span>{file.type}</span>
            <span>•</span>
            <span>{file.size}</span>
            <span>•</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
