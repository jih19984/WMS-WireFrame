import { useEffect, useState } from "react";
import { searchService } from "@/app/search/_service/search.service";
import type { SearchFiltersValue, SearchResultItem } from "@/app/search/_types/search.types";

export function useSearch(initialQuery = "MCP 관련 업무") {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFiltersValue>({
    departmentId: "all",
    teamId: "all",
    status: "all",
  });
  const [results, setResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    searchService.search(query, filters).then(setResults);
  }, [query, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
  };
}
