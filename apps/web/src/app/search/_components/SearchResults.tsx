import type { SearchResultItem } from "@/app/search/_types/search.types";
import { SearchResultCard } from "@/app/search/_components/SearchResultCard";

export function SearchResults({ results }: { results: SearchResultItem[] }) {
  return (
    <div className="space-y-3">
      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">
          검색 결과가 없습니다. 필터를 줄이거나 다른 검색어를 입력해보세요.
        </div>
      ) : (
        results.map((result) => <SearchResultCard key={result.id} result={result} />)
      )}
    </div>
  );
}
