import { getVisibleFiles, getVisibleWorklogs } from "@/app/_common/service/access-control";
import type { AuthUser } from "@/app/_common/store/auth.store";
import { departments, files, tags, teams, users, worklogs } from "@/app/_common/service/mock-db";
import type { SearchFiltersValue, SearchResultItem } from "@/app/search/_types/search.types";
import { getAiStatusLabel, getImportanceLabel, getWorklogStatusLabel } from "@/lib/utils";

function matchesPeriod(date: string, period: SearchFiltersValue["period"]) {
  if (period === "ALL") return true;
  const now = new Date("2026-04-13T23:59:59");
  const diffDays = Math.floor(
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    (period === "7D" && diffDays <= 7) ||
    (period === "30D" && diffDays <= 30) ||
    (period === "90D" && diffDays <= 90)
  );
}

export const searchService = {
  async search(
    query: string,
    filters: SearchFiltersValue,
    viewer: AuthUser | null,
  ): Promise<SearchResultItem[]> {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleWorklogs = getVisibleWorklogs(viewer, worklogs, teams);
    const visibleFiles = getVisibleFiles(viewer, files, worklogs, teams);

    const worklogResults = visibleWorklogs
      .filter((worklog) => {
        const matchesQuery =
          !normalizedQuery ||
          [worklog.title, worklog.aiSummary, worklog.requestContent, worklog.workContent]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const team = teams.find((item) => item.id === worklog.teamId);
        const matchesDepartment =
          filters.departmentId === "all" ||
          String(team?.departmentId) === filters.departmentId;
        const matchesTeam = filters.teamId === "all" || String(worklog.teamId) === filters.teamId;
        const matchesStatus = filters.status === "all" || worklog.status === filters.status;
        const matchesImportance =
          filters.importance === "all" || worklog.importance === filters.importance;
        const matchesAuthor =
          filters.authorId === "all" || String(worklog.authorId) === filters.authorId;
        const matchesTag =
          filters.tagId === "all" || worklog.tagIds.includes(Number(filters.tagId));
        const matchesPeriodFilter = matchesPeriod(worklog.createdAt, filters.period);

        return (
          (filters.sourceType === "all" || filters.sourceType === "WORKLOG") &&
          matchesQuery &&
          matchesDepartment &&
          matchesTeam &&
          matchesStatus &&
          matchesImportance &&
          matchesAuthor &&
          matchesTag &&
          matchesPeriodFilter
        );
      })
      .map((worklog) => {
        const team = teams.find((item) => item.id === worklog.teamId);
        const departmentName = departments.find(
          (department) => department.id === team?.departmentId,
        )?.name;

        return {
          id: `WORKLOG-${worklog.id}`,
          sourceId: worklog.id,
          title: worklog.title,
          snippet: worklog.aiSummary,
          sourceType: "WORKLOG" as const,
          sourceLink: `/worklog/detail/${worklog.id}`,
          teamName: team?.name ?? "-",
          authorName: users.find((user) => user.id === worklog.authorId)?.name ?? "-",
          score: Math.min(
            99,
            68 + worklog.tagIds.length * 5 + (normalizedQuery ? 12 : 0),
          ),
          createdAt: worklog.createdAt,
          metadata: {
            departmentName: departmentName ?? "-",
            status: getWorklogStatusLabel(worklog.status),
            statusCode: worklog.status,
            importance: getImportanceLabel(worklog.importance),
            importanceCode: worklog.importance,
            tagNames: tags
              .filter((tag) => worklog.tagIds.includes(tag.id))
              .map((tag) => tag.name),
          },
        };
      });

    const fileResults = visibleFiles
      .filter((file) => {
        const linkedWorklog = visibleWorklogs.find((worklog) => worklog.id === file.worklogId);
        if (!linkedWorklog) return false;
        const linkedTeam = teams.find((team) => team.id === linkedWorklog.teamId);
        const matchesQuery =
          !normalizedQuery ||
          [file.originalName, file.summaryPreview, linkedWorklog.title]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesDepartment =
          filters.departmentId === "all" ||
          String(linkedTeam?.departmentId) === filters.departmentId;
        const matchesTeam =
          filters.teamId === "all" || String(linkedWorklog.teamId) === filters.teamId;
        const matchesStatus =
          filters.status === "all" || linkedWorklog.status === filters.status;
        const matchesImportance =
          filters.importance === "all" ||
          linkedWorklog.importance === filters.importance;
        const matchesAuthor =
          filters.authorId === "all" ||
          String(linkedWorklog.authorId) === filters.authorId;
        const matchesTag =
          filters.tagId === "all" ||
          linkedWorklog.tagIds.includes(Number(filters.tagId));
        const matchesPeriodFilter = matchesPeriod(file.uploadedAt, filters.period);

        return (
          (filters.sourceType === "all" || filters.sourceType === "FILE") &&
          matchesQuery &&
          matchesDepartment &&
          matchesTeam &&
          matchesStatus &&
          matchesImportance &&
          matchesAuthor &&
          matchesTag &&
          matchesPeriodFilter
        );
      })
      .map((file) => {
        const linkedWorklog = worklogs.find((worklog) => worklog.id === file.worklogId);
        const linkedTeam = teams.find((team) => team.id === linkedWorklog?.teamId);
        const departmentName = departments.find(
          (department) => department.id === linkedTeam?.departmentId,
        )?.name;
        return {
          id: `FILE-${file.id}`,
          sourceId: file.id,
          title: file.originalName,
          snippet: file.summaryPreview,
          sourceType: "FILE" as const,
          sourceLink: `/worklog/detail/${file.worklogId}`,
          teamName: linkedTeam?.name ?? "-",
          authorName:
            users.find((user) => user.id === file.uploadedBy)?.name ?? "-",
          score: Math.min(
            98,
            63 + (normalizedQuery ? 10 : 0) + (file.aiStatus === "DONE" ? 7 : 2),
          ),
          createdAt: file.uploadedAt,
          metadata: {
            departmentName: departmentName ?? "-",
            status: linkedWorklog
              ? getWorklogStatusLabel(linkedWorklog.status)
              : undefined,
            statusCode: linkedWorklog?.status,
            importance: linkedWorklog
              ? getImportanceLabel(linkedWorklog.importance)
              : undefined,
            importanceCode: linkedWorklog?.importance,
            tagNames: linkedWorklog
              ? tags
                  .filter((tag) => linkedWorklog.tagIds.includes(tag.id))
                  .map((tag) => tag.name)
              : [],
            fileType: file.type,
            aiStatus: getAiStatusLabel(file.aiStatus),
          },
        };
      });

    return [...worklogResults, ...fileResults].sort(
      (left, right) => right.score - left.score,
    );
  },
  async popularTags() {
    return tags.slice(0, 5);
  },
};
