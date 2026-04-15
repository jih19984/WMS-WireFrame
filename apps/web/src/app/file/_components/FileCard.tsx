import { Link } from "react-router-dom";
import { worklogs } from "@/app/_common/service/mock-db";
import { FileAiStatusBadge } from "@/app/file/_components/FileAiStatusBadge";
import type { FileItem } from "@/app/file/_types/file.types";
import { CardContent } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn, formatDate } from "@/lib/utils";

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
    <CardSpotlight
      role="button"
      tabIndex={0}
      onClick={() => onToggleSelect(file.id, !selected)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggleSelect(file.id, !selected);
        }
      }}
      className={cn(
        "cursor-pointer rounded-[24px] transition-all duration-300 hover:-translate-y-1",
        selected && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background",
      )}
    >
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                {file.originalName}
              </p>
              <FileAiStatusBadge status={file.aiStatus} />
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-sm leading-7 text-muted-foreground">
            {file.summaryPreview}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-foreground">소속 업무일지</span>
            {worklog ? (
              <Link
                to={`/worklog/detail/${worklog.id}`}
                className="font-medium text-primary hover:underline"
                onClick={(event) => event.stopPropagation()}
              >
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
      </CardContent>
    </CardSpotlight>
  );
}
