import { useEffect, useState } from "react";
import { getDefaultSearchFilters } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { searchService } from "@/app/search/_service/search.service";
import type { SearchFiltersValue, SearchResultItem } from "@/app/search/_types/search.types";

export function useSearch(initialQuery = "MCP 관련 업무") {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFiltersValue>(getDefaultSearchFilters(user));
  const [results, setResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    setFilters(getDefaultSearchFilters(user));
  }, [user]);

  useEffect(() => {
    searchService.search(query, filters, user).then(setResults);
  }, [query, filters, user]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
  };
}
