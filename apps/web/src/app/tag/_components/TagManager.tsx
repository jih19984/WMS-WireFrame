import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, RefreshCw, Search } from "lucide-react";
import { usePagination } from "@/app/_common/hooks/usePagination";
import { ConfirmDialog } from "@/app/_common/components/ConfirmDialog";
import { Pagination } from "@/app/_common/components/Pagination";
import { useTag } from "@/app/tag/_hooks/useTag";
import { TagStateBadge } from "@/app/tag/_components/TagStateBadge";
import { tagService } from "@/app/tag/_service/tag.service";
import { getTagSourceBadgeClass } from "@/app/tag/_utils/tag-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CardContent } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sourceLabelMap = {
  AI: "AI 생성",
  MANUAL: "수동 생성",
} as const;

export function TagManager({ canManage }: { canManage: boolean }) {
  const { tags, refresh } = useTag();
  const [query, setQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [mergeTargetId, setMergeTargetId] = useState("");
  const [mergeConfirmOpen, setMergeConfirmOpen] = useState(false);
  const [mergePickerOpen, setMergePickerOpen] = useState(false);
  const mergePickerRef = useRef<HTMLDivElement>(null);

  const mergeCandidates = tags.filter((tag) => tag.mergeState === "MERGE_CANDIDATE");
  const reviewTags = tags.filter((tag) => tag.mergeState === "REVIEW");

  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tags.filter((tag) => {
      if (!normalizedQuery) return true;

      const searchableText = [
        tag.name,
        tag.category,
        tag.reuseHint,
        sourceLabelMap[tag.source],
        tag.mergeState,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, tags]);

  const tagPagination = usePagination(filteredTags, 6);
  const pageTagIds = tagPagination.items.map((tag) => tag.id);
  const selectedTags = filteredTags.filter((tag) => selectedTagIds.includes(tag.id));
  const isAllCurrentPageSelected =
    pageTagIds.length > 0 && pageTagIds.every((id) => selectedTagIds.includes(id));

  useEffect(() => {
    const visibleIds = new Set(filteredTags.map((tag) => tag.id));
    setSelectedTagIds((current) => current.filter((id) => visibleIds.has(id)));
  }, [filteredTags]);

  useEffect(() => {
    if (selectedTagIds.length < 2) {
      setMergeTargetId("");
      return;
    }

    if (!selectedTagIds.includes(Number(mergeTargetId))) {
      setMergeTargetId(String(selectedTagIds[0]));
    }
  }, [mergeTargetId, selectedTagIds]);

  useEffect(() => {
    if (!mergePickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mergePickerRef.current &&
        !mergePickerRef.current.contains(event.target as Node)
      ) {
        setMergePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mergePickerOpen]);

  const handleToggleSelect = (tagId: number, checked: boolean) => {
    setSelectedTagIds((current) =>
      checked ? Array.from(new Set([...current, tagId])) : current.filter((id) => id !== tagId),
    );
  };

  const handleSelectCard = (tagId: number) => {
    handleToggleSelect(tagId, !selectedTagIds.includes(tagId));
  };

  const handleToggleSelectAllCurrentPage = (checked: boolean) => {
    setSelectedTagIds((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...pageTagIds]));
      }

      return current.filter((id) => !pageTagIds.includes(id));
    });
  };

  const handleMerge = async () => {
    if (selectedTagIds.length < 2 || !mergeTargetId) return;

    await tagService.merge(selectedTagIds, Number(mergeTargetId));
    await refresh();
    setSelectedTagIds([]);
    setMergeTargetId("");
    setMergeConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <CardSpotlight className="rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Tags</p>
          <p className="mt-2 text-2xl font-semibold">{tags.length}</p>
        </CardSpotlight>
        <CardSpotlight className="rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Merge Candidates</p>
          <p className="mt-2 text-2xl font-semibold">{mergeCandidates.length}</p>
        </CardSpotlight>
        <CardSpotlight className="rounded-[24px] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Review Queue</p>
          <p className="mt-2 text-2xl font-semibold">{reviewTags.length}</p>
        </CardSpotlight>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 pl-11 pr-12"
            placeholder="태그 이름, 분류, 상태, 힌트로 검색하세요"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
            aria-label="검색어 초기화"
            onClick={() => setQuery("")}
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>

        <div className="worklog-divider-top" />

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium">표시 중인 태그</span>
          <span className="text-lg font-semibold text-foreground">{filteredTags.length}개</span>

          {canManage ? (
            <label className="ml-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={isAllCurrentPageSelected}
                onChange={(event) => handleToggleSelectAllCurrentPage(event.target.checked)}
              />
              <span>현재 페이지 전체 선택</span>
            </label>
          ) : null}

          {selectedTagIds.length > 0 ? (
            <span className="text-sm font-medium text-foreground">선택 {selectedTagIds.length}개</span>
          ) : null}

          {canManage ? (
            <div className="relative ml-auto flex flex-wrap items-center gap-2" ref={mergePickerRef}>
              <Button
                type="button"
                variant="default"
                className="h-11 min-w-32 px-5 text-sm font-semibold"
                disabled={selectedTagIds.length < 2}
                onClick={() => setMergePickerOpen((prev) => !prev)}
              >
                <ArrowLeftRight className="size-4" />
                선택 태그 병합
              </Button>
              {mergePickerOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[260px] rounded-2xl border border-border bg-popover p-2 shadow-2xl">
                  <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    병합 기준 태그 선택
                  </p>
                  <div className="space-y-1">
                    {selectedTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-muted"
                        onClick={() => {
                          setMergeTargetId(String(tag.id));
                          setMergePickerOpen(false);
                          setMergeConfirmOpen(true);
                        }}
                      >
                        <span className="font-medium">#{tag.name}</span>
                        <span className="text-xs text-muted-foreground">{tag.usageCount}회</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tagPagination.items.map((tag) => {
          const checked = selectedTagIds.includes(tag.id);

          return (
            <CardSpotlight
              key={tag.id}
              className={cn(
                "rounded-[24px] border-border/75 transition-all duration-300 hover:-translate-y-1",
                checked && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background",
              )}
            >
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => {
                  if (!canManage) return;
                  handleSelectCard(tag.id);
                }}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">#{tag.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tag.category} / {tag.usageCount}회 사용
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TagStateBadge state={tag.mergeState} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "border px-2.5 py-0.5 font-medium",
                        getTagSourceBadgeClass(tag.source),
                      )}
                    >
                      {sourceLabelMap[tag.source]}
                    </Badge>
                    {tag.mergeTargetId ? (
                      <Badge
                        variant="outline"
                        className="border-slate-300 bg-slate-100 text-slate-700 shadow-sm dark:border-slate-300/45 dark:bg-slate-200/12 dark:text-slate-100"
                      >
                        병합 대상 #{tag.mergeTargetId}
                      </Badge>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border border-dashed p-3 text-sm",
                      "border-border/60 bg-muted/25 text-muted-foreground",
                    )}
                  >
                    {tag.reuseHint}
                  </div>
                </CardContent>
              </button>
            </CardSpotlight>
          );
        })}
      </div>

      <Pagination
        page={tagPagination.page}
        totalPages={tagPagination.totalPages}
        onPageChange={tagPagination.setPage}
      />

      <ConfirmDialog
        open={mergeConfirmOpen}
        onOpenChange={setMergeConfirmOpen}
        title="선택한 태그를 병합할까요?"
        description="선택한 여러 태그를 하나의 기준 태그로 통합합니다. 병합 후에는 대상 태그만 유지됩니다."
        confirmText={`선택 ${selectedTagIds.length}개 병합`}
        onConfirm={handleMerge}
      >
        {mergeTargetId ? (
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
            병합 기준 태그:{" "}
            <span className="font-semibold text-foreground">
              #{selectedTags.find((tag) => String(tag.id) === mergeTargetId)?.name}
            </span>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
