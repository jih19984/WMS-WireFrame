export interface SearchFiltersValue {
  sourceType: string;
  departmentId: string;
  teamId: string;
  status: string;
  importance: string;
  authorId: string;
  tagId: string;
  period: "ALL" | "7D" | "30D" | "90D";
}

export interface SearchResultItem {
  id: string;
  sourceId: number;
  title: string;
  snippet: string;
  sourceType: "WORKLOG" | "FILE";
  sourceLink: string;
  teamName: string;
  authorName: string;
  score: number;
  createdAt: string;
  metadata: {
    departmentName: string;
    status?: string;
    importance?: string;
    tagNames: string[];
    fileType?: string;
    aiStatus?: string;
  };
}
