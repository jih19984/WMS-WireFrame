import { Link } from "react-router-dom";
import { Download, Trash2 } from "lucide-react";
import { worklogs } from "@/app/_common/service/mock-db";
import type { FileItem } from "@/app/file/_types/file.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getAiStatusLabel } from "@/lib/utils";

export function FileCard({
  file,
  onDelete,
}: {
  file: FileItem;
  onDelete: (file: FileItem) => void;
}) {
  const worklog = worklogs.find((item) => item.id === file.worklogId);
  const statusVariant =
    file.aiStatus === "DONE"
      ? "success"
      : file.aiStatus === "FAILED"
        ? "destructive"
        : "secondary";

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div>
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                {file.originalName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{file.type}</span>
                <span>•</span>
                <span>{file.size}</span>
                <span>•</span>
                <span>{formatDate(file.uploadedAt)}</span>
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
            <p className="text-xs text-muted-foreground">저장 경로: {file.storedPath}</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Badge variant={statusVariant}>{getAiStatusLabel(file.aiStatus)}</Badge>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" type="button">
                <Download className="size-4" />
                다운로드
              </Button>
              <Button variant="outline" size="sm" type="button" onClick={() => onDelete(file)}>
                <Trash2 className="size-4" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
