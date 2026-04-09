import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/app/search/_types/search.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function SearchResultCard({ result }: { result: SearchResultItem }) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge>{result.sourceType}</Badge>
              <Badge variant="secondary">{result.score}% match</Badge>
            </div>
            <Link to={`/worklog/detail/${result.id}`} className="text-base font-medium hover:text-primary">
              {result.title}
            </Link>
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{result.snippet}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{result.teamName}</span>
          <span>•</span>
          <span>{result.authorName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
