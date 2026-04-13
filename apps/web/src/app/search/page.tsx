import { PageHeader } from "@/app/_common/components/PageHeader";
import { useSearch } from "@/app/search/_hooks/useSearch";
import { SearchBar } from "@/app/search/_components/SearchBar";
import { SearchFilters } from "@/app/search/_components/SearchFilters";
import { SearchResults } from "@/app/search/_components/SearchResults";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  const { query, setQuery, filters, setFilters, results } = useSearch();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="시맨틱 검색"
        description="자연어 검색과 역할 기반 필터를 함께 적용하는 검색 와이어프레임입니다."
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em]">자료 탐색</h2>
          <p className="text-sm text-muted-foreground">검색 결과 {results.length}건</p>
        </div>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="grid gap-4 p-5">
            <SearchBar value={query} onChange={setQuery} />
            <SearchFilters value={filters} onChange={setFilters} />
          </CardContent>
        </Card>
        <SearchResults results={results} />
      </div>
    </div>
  );
}
