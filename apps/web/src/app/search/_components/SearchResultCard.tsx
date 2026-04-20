import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { tags } from "@/app/_common/service/mock-db";
import type { SearchResultItem } from "@/app/search/_types/search.types";
import { getTagSourceBadgeClass } from "@/app/tag/_utils/tag-badge";
import { ImportanceBadge } from "@/app/worklog/_components/ImportanceBadge";
import { StatusBadge } from "@/app/worklog/_components/StatusBadge";
import { WorklogPreviewDialog } from "@/app/worklog/_components/WorklogPreviewDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function SearchResultCard({ result }: { result: SearchResultItem }) {
  const sourceTypeLabel = result.sourceType === "WORKLOG" ? "업무" : "파일";
  const [previewOpen, setPreviewOpen] = useState(false);
  const worklogId = useMemo(() => {
    const match = result.sourceLink.match(/\/worklog\/detail\/(\d+)/);
    return match ? Number(match[1]) : null;
  }, [result.sourceLink]);

  return (
    <>
      <Card className="group transition-all hover:border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Badge>{sourceTypeLabel}</Badge>
                <Badge variant="secondary">{result.score}% 일치</Badge>
                {result.metadata.fileType ? <Badge variant="outline">{result.metadata.fileType}</Badge> : null}
              </div>
              {result.sourceType === "WORKLOG" && worklogId ? (
                <button
                  type="button"
                  className="block truncate text-[18px] font-semibold tracking-[-0.03em] text-foreground transition-colors hover:text-primary"
                  onClick={() => setPreviewOpen(true)}
                >
                  {result.title}
                </button>
              ) : (
                <Link
                  to={result.sourceLink}
                  className="block truncate text-[18px] font-semibold tracking-[-0.03em] text-foreground transition-colors hover:text-primary"
                >
                  {result.title}
                </Link>
              )}
              <p className="text-sm leading-7 text-muted-foreground">{result.snippet}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/35 px-4 py-3 text-xs text-muted-foreground">
              <p>생성일</p>
              <p className="mt-1 font-semibold text-foreground">{formatDate(result.createdAt)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{result.metadata.departmentName}</span>
            <span>•</span>
            <span>{result.teamName}</span>
            <span>•</span>
            <span>{result.authorName}</span>
          </div>
          {result.metadata.statusCode || result.metadata.importanceCode ? (
            <div className="flex flex-wrap gap-2">
              {result.metadata.statusCode ? (
                <StatusBadge status={result.metadata.statusCode} />
              ) : null}
              {result.metadata.importanceCode ? (
                <ImportanceBadge importance={result.metadata.importanceCode} />
              ) : null}
            </div>
          ) : null}
          {result.metadata.tagNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.metadata.tagNames.map((tagName) => (
                <Badge
                  key={tagName}
                  variant="outline"
                  className={getTagSourceBadgeClass(
                    tags.find((tag) => tag.name === tagName)?.source ?? "MANUAL",
                  )}
                >
                  #{tagName}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <WorklogPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        worklogId={worklogId}
      />
    </>
  );
}
