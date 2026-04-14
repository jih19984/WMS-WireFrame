import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/app/_common/components/PageHeader";
import { useSearch } from "@/app/search/_hooks/useSearch";
import { SearchBar } from "@/app/search/_components/SearchBar";
import { SearchFilters } from "@/app/search/_components/SearchFilters";
import { SearchResults } from "@/app/search/_components/SearchResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const { query, setQuery, filters, setFilters, results } = useSearch();
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter(
        (value) => value !== "all" && value !== "ALL",
      ).length,
    [filters],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="시맨틱 검색"
        description="자연어 검색과 역할 기반 필터를 함께 적용하는 검색 와이어프레임입니다."
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-[-0.04em] text-foreground">자료 탐색</h2>
          <p className="text-sm text-muted-foreground">검색 결과 {results.length}건</p>
        </div>
        <Card className="border-white/8">
          <CardContent className="grid gap-4 p-5">
            <SearchBar value={query} onChange={setQuery} />
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                className="h-10 border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="size-4" />
                필터
                {activeFilterCount > 0 ? (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "ml-1 size-4 transition-transform duration-300 ease-out",
                    showFilters && "rotate-180",
                  )}
                />
              </Button>
              <p className="text-xs text-muted-foreground">
                필요한 필터만 펼쳐서 검색 범위를 세밀하게 조정할 수 있습니다.
              </p>
            </div>
            <div
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
                showFilters
                  ? "mt-0 grid-rows-[1fr] opacity-100"
                  : "mt-[-4px] grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="pt-1">
                  <SearchFilters value={filters} onChange={setFilters} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <SearchResults results={results} />
      </div>
    </div>
  );
}
