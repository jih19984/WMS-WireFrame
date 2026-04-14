import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/app/search/_types/search.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function SearchResultCard({ result }: { result: SearchResultItem }) {
  const sourceTypeLabel = result.sourceType === "WORKLOG" ? "업무" : "파일";

  return (
    <Card className="group border-white/8 transition-all hover:border-white/14">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Badge>{sourceTypeLabel}</Badge>
              <Badge variant="secondary">{result.score}% 일치</Badge>
              {result.metadata.fileType ? <Badge variant="outline">{result.metadata.fileType}</Badge> : null}
            </div>
            <Link
              to={result.sourceLink}
              className="block truncate text-[18px] font-semibold tracking-[-0.03em] text-foreground transition-colors hover:text-primary"
            >
              {result.title}
            </Link>
            <p className="text-sm leading-7 text-muted-foreground">{result.snippet}</p>
          </div>
          <div className="workspace-panel-inset rounded-2xl px-4 py-3 text-xs text-muted-foreground">
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
          {result.metadata.status ? (
            <>
              <span>•</span>
              <span>{result.metadata.status}</span>
            </>
          ) : null}
          {result.metadata.importance ? (
            <>
              <span>•</span>
              <span>{result.metadata.importance}</span>
            </>
          ) : null}
        </div>
        {result.metadata.tagNames.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.metadata.tagNames.map((tagName) => (
              <Badge key={tagName} variant="outline">
                #{tagName}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
