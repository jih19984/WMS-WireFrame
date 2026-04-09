export interface SearchFiltersValue {
  departmentId: string;
  teamId: string;
  status: string;
}

export interface SearchResultItem {
  id: number;
  title: string;
  snippet: string;
  sourceType: "WORKLOG" | "FILE";
  teamName: string;
  authorName: string;
  score: number;
}
