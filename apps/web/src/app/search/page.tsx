import { PageHeader } from "@/app/_common/components/PageHeader";
import { useSearch } from "@/app/search/_hooks/useSearch";
import { SearchBar } from "@/app/search/_components/SearchBar";
import { SearchFilters } from "@/app/search/_components/SearchFilters";
import { SearchResults } from "@/app/search/_components/SearchResults";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchPage() {
  const { query, setQuery, filters, setFilters, results } = useSearch();

  return (
    <>
      <PageHeader title="시맨틱 검색" description="자연어 검색과 구조화 필터를 조합해 과거 업무와 자료를 탐색합니다." />
      <Card>
        <CardContent className="grid gap-4 p-5">
          <SearchBar value={query} onChange={setQuery} />
          <SearchFilters value={filters} onChange={setFilters} />
        </CardContent>
      </Card>
      <SearchResults results={results} />
    </>
  );
}
