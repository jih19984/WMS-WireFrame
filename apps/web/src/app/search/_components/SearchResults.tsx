import type { SearchResultItem } from "@/app/search/_types/search.types";
import { SearchResultCard } from "@/app/search/_components/SearchResultCard";

export function SearchResults({ results }: { results: SearchResultItem[] }) {
  return (
    <div className="workspace-list">
      {results.length === 0 ? (
        <div className="workspace-empty rounded-3xl px-6 py-12 text-center text-sm">
          검색 결과가 없습니다. 필터를 줄이거나 다른 검색어를 입력해보세요.
        </div>
      ) : (
        results.map((result) => <SearchResultCard key={result.id} result={result} />)
      )}
    </div>
  );
}
