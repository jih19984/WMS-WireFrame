import { tags, teams, users, worklogs } from "@/app/_common/service/mock-db";
import type { SearchFiltersValue, SearchResultItem } from "@/app/search/_types/search.types";

export const searchService = {
  async search(query: string, filters: SearchFiltersValue): Promise<SearchResultItem[]> {
    const base = worklogs
      .filter((worklog) => {
        const matchesQuery =
          !query ||
          [worklog.title, worklog.aiSummary, worklog.requestContent, worklog.workContent]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesDepartment =
          filters.departmentId === "all" ||
          String(teams.find((team) => team.id === worklog.teamId)?.departmentId) === filters.departmentId;
        const matchesTeam = filters.teamId === "all" || String(worklog.teamId) === filters.teamId;
        const matchesStatus = filters.status === "all" || worklog.status === filters.status;
        return matchesQuery && matchesDepartment && matchesTeam && matchesStatus;
      })
      .map((worklog) => ({
        id: worklog.id,
        title: worklog.title,
        snippet: worklog.aiSummary,
        sourceType: "WORKLOG" as const,
        teamName: teams.find((team) => team.id === worklog.teamId)?.name ?? "-",
        authorName: users.find((user) => user.id === worklog.authorId)?.name ?? "-",
        score: Math.min(99, 72 + worklog.tagIds.length * 5 + (query ? 8 : 0)),
      }));

    return base;
  },
  async popularTags() {
    return tags.slice(0, 5);
  },
};
