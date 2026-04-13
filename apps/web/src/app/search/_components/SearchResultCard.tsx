import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/app/search/_types/search.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function SearchResultCard({ result }: { result: SearchResultItem }) {
  const sourceTypeLabel = result.sourceType === "WORKLOG" ? "업무" : "파일";

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge>{sourceTypeLabel}</Badge>
              <Badge variant="secondary">{result.score}% 일치</Badge>
              {result.metadata.fileType ? <Badge variant="outline">{result.metadata.fileType}</Badge> : null}
            </div>
            <Link to={result.sourceLink} className="text-base font-medium hover:text-primary">
              {result.title}
            </Link>
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(result.createdAt)}</span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{result.snippet}</p>
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
