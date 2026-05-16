import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, Search, X, XCircle } from "lucide-react";
import { useTag } from "@/app/tag/_hooks/useTag";
import { TagStateBadge } from "@/app/tag/_components/TagStateBadge";
import { tagService } from "@/app/tag/_service/tag.service";
import { getTagSourceBadgeClass } from "@/app/tag/_utils/tag-badge";
import type { TagItem } from "@/app/tag/_types/tag.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sourceLabelMap = {
  AI: "AI 생성",
  MANUAL: "수동 생성",
} as const;

type SearchMode = "candidate" | "target";
type MergeProposal = {
  target: TagItem;
  candidates: TagItem[];
  usageCount: number;
};

export function TagManager({ canManage }: { canManage: boolean }) {
  const { tags, refresh } = useTag();
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [candidateIdsByTarget, setCandidateIdsByTarget] = useState<
    Record<number, number[]>
  >({});
  const [targetNameDrafts, setTargetNameDrafts] = useState<Record<number, string>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("candidate");
  const [tagQuery, setTagQuery] = useState("");

  const tagById = useMemo(
    () => new Map(tags.map((tag) => [tag.id, tag] as const)),
    [tags],
  );
  const pendingTags = tags.filter((tag) => tag.mergeState === "PENDING");
  const activeTags = tags.filter((tag) => tag.mergeState === "ACTIVE");

  useEffect(() => {
    const nextCandidates = tags.reduce<Record<number, number[]>>((acc, tag) => {
      if (tag.mergeState !== "MERGE_CANDIDATE" || !tag.mergeTargetId) return acc;
      acc[tag.mergeTargetId] = [...(acc[tag.mergeTargetId] ?? []), tag.id];
      return acc;
    }, {});

    setCandidateIdsByTarget((current) => {
      const merged = { ...nextCandidates };
      Object.entries(current).forEach(([targetId, ids]) => {
        const numericTargetId = Number(targetId);
        const target = tagById.get(numericTargetId);
        if (!target || target.mergeState === "PENDING") return;

        merged[numericTargetId] = Array.from(
          new Set([
            ...(merged[numericTargetId] ?? []),
            ...ids.filter((id) => tagById.has(id)),
          ]),
        ).filter((id) => id !== numericTargetId);
      });
      return merged;
    });

    setTargetNameDrafts((current) => {
      const next = { ...current };
      Object.keys(nextCandidates).forEach((targetId) => {
        const numericTargetId = Number(targetId);
        next[numericTargetId] = next[numericTargetId] ?? tagById.get(numericTargetId)?.name ?? "";
      });
      return next;
    });
  }, [tagById, tags]);

  const proposals = useMemo<MergeProposal[]>(() => {
    return Object.entries(candidateIdsByTarget)
      .map(([targetId, candidateIds]) => {
        const numericTargetId = Number(targetId);
        const target = tagById.get(numericTargetId);
        const candidates = candidateIds
          .map((id) => tagById.get(id))
          .filter((tag): tag is TagItem => Boolean(tag))
          .filter((tag) => tag.mergeState !== "PENDING");

        if (!target || candidates.length === 0) return null;

        return {
          target,
          candidates,
          usageCount: candidates.reduce((sum, tag) => sum + tag.usageCount, target.usageCount),
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((left, right) => right.candidates.length - left.candidates.length);
  }, [candidateIdsByTarget, tagById]);

  useEffect(() => {
    if (proposals.length === 0) {
      setSelectedTargetId(null);
      return;
    }

    if (!selectedTargetId || !proposals.some((proposal) => proposal.target.id === selectedTargetId)) {
      setSelectedTargetId(proposals[0].target.id);
    }
  }, [proposals, selectedTargetId]);

  const selectedProposal =
    proposals.find((proposal) => proposal.target.id === selectedTargetId) ?? null;

  const searchableTags = useMemo(() => {
    const normalizedQuery = tagQuery.trim().toLowerCase();
    const selectedCandidateIds = new Set(
      selectedTargetId ? candidateIdsByTarget[selectedTargetId] ?? [] : [],
    );

    return tags
      .filter((tag) => {
        if (tag.mergeState === "PENDING") return false;
        if (tag.mergeState === "REVIEW") return false;
        if (searchMode === "candidate" && tag.id === selectedTargetId) return false;
        if (searchMode === "candidate" && selectedCandidateIds.has(tag.id)) return false;
        if (searchMode === "target" && selectedCandidateIds.has(tag.id)) return false;

        if (!normalizedQuery) return true;

        return [tag.name, tag.category, tag.reuseHint, sourceLabelMap[tag.source]]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [candidateIdsByTarget, searchMode, selectedTargetId, tagQuery, tags]);

  const openSearch = (mode: SearchMode) => {
    setSearchMode(mode);
    setTagQuery("");
    setSearchOpen(true);
  };

  const addCandidate = (tagId: number) => {
    if (!selectedTargetId) return;

    setCandidateIdsByTarget((current) => ({
      ...current,
      [selectedTargetId]: Array.from(
        new Set([...(current[selectedTargetId] ?? []), tagId]),
      ),
    }));
    setSearchOpen(false);
  };

  const removeCandidate = (targetId: number, tagId: number) => {
    setCandidateIdsByTarget((current) => ({
      ...current,
      [targetId]: (current[targetId] ?? []).filter((id) => id !== tagId),
    }));
  };

  const changeTarget = (nextTargetId: number) => {
    if (!selectedTargetId || nextTargetId === selectedTargetId) return;

    const currentCandidates = candidateIdsByTarget[selectedTargetId] ?? [];
    const nextCandidates = Array.from(
      new Set([...currentCandidates, selectedTargetId]),
    ).filter((id) => id !== nextTargetId);

    setCandidateIdsByTarget((current) => {
      const next = { ...current };
      delete next[selectedTargetId];
      next[nextTargetId] = nextCandidates;
      return next;
    });
    setTargetNameDrafts((current) => ({
      ...current,
      [nextTargetId]: current[nextTargetId] ?? tagById.get(nextTargetId)?.name ?? "",
    }));
    setSelectedTargetId(nextTargetId);
    setSearchOpen(false);
  };

  const approveProposal = async (proposal: MergeProposal) => {
    await tagService.approveMerge(
      proposal.candidates.map((tag) => tag.id),
      proposal.target.id,
      targetNameDrafts[proposal.target.id] ?? proposal.target.name,
    );
    await refresh();
  };

  const rejectProposal = async (proposal: MergeProposal) => {
    await tagService.rejectMerge(proposal.candidates.map((tag) => tag.id));
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryMetric label="승인 대기 후보" value={proposals.length} />
        <SummaryMetric label="새벽 배치 대기" value={pendingTags.length} />
        <SummaryMetric label="운영 태그" value={activeTags.length} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section className="min-w-0 rounded-[24px] border border-border/70 bg-card/58 p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">추천 병합 후보</p>
              <p className="mt-1 text-xs text-muted-foreground">
                유사 태그 묶음을 확인하고 체크 또는 X로 처리합니다.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs"
              disabled={!canManage || !selectedProposal}
              onClick={() => openSearch("candidate")}
            >
              <Plus className="size-3.5" />
              후보 추가
            </Button>
          </div>

          <div className="tag-bubble-stage">
            {proposals.length > 0 ? (
              proposals.map((proposal, index) => (
                <MergeBubbleCard
                  key={proposal.target.id}
                  proposal={proposal}
                  selected={selectedTargetId === proposal.target.id}
                  draftName={targetNameDrafts[proposal.target.id] ?? proposal.target.name}
                  canManage={canManage}
                  index={index}
                  onSelect={() => setSelectedTargetId(proposal.target.id)}
                  onDraftNameChange={(value) =>
                    setTargetNameDrafts((current) => ({
                      ...current,
                      [proposal.target.id]: value,
                    }))
                  }
                  onApprove={() => approveProposal(proposal)}
                  onReject={() => rejectProposal(proposal)}
                  onRemoveCandidate={(tagId) => {
                    setSelectedTargetId(proposal.target.id);
                    removeCandidate(proposal.target.id, tagId);
                  }}
                  onChangeTarget={() => {
                    setSelectedTargetId(proposal.target.id);
                    openSearch("target");
                  }}
                />
              ))
            ) : (
              <EmptyState message="검토할 추천 후보가 없습니다." />
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-border/70 bg-muted/25 p-4 text-sm leading-6 text-muted-foreground">
            승인 시 후보 태그는 `PENDING` 상태가 되고, 새벽 배치 전까지 LLM의
            업무일지 태그 연결 후보에서 제외됩니다.
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[24px] border border-border/70 bg-card/58 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">배치 대기</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  승인 후 새벽 병합 대상입니다.
                </p>
              </div>
              <Badge variant="warning">{pendingTags.length}건</Badge>
            </div>

            <div className="space-y-3">
              {pendingTags.length > 0 ? (
                pendingTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">#{tag.name}</p>
                      <TagStateBadge state={tag.mergeState} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      병합 기준 #
                      {tag.mergeTargetId ? tagById.get(tag.mergeTargetId)?.name ?? tag.mergeTargetId : "-"} ·
                      LLM 후보 제외
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState message="배치 대기 중인 태그가 없습니다." />
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-border/70 bg-card/58 p-5">
            <p className="text-sm font-semibold text-foreground">상태 기준</p>
            <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">추천 후보</span>는 유사
                태그 묶음이 이미 만들어져 승인/반려만 필요한 상태입니다.
              </p>
              <p>
                <span className="font-medium text-foreground">배치 대기</span>는 승인
                후 새벽 병합 전까지 자동 태깅에서 제외되는 상태입니다.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <TagSearchDialog
        open={searchOpen}
        mode={searchMode}
        query={tagQuery}
        tags={searchableTags}
        onQueryChange={setTagQuery}
        onOpenChange={setSearchOpen}
        onSelect={(tagId) => {
          if (searchMode === "candidate") {
            addCandidate(tagId);
            return;
          }
          changeTarget(tagId);
        }}
      />
    </div>
  );
}

function MergeBubbleCard({
  proposal,
  selected,
  draftName,
  canManage,
  index,
  onSelect,
  onDraftNameChange,
  onApprove,
  onReject,
  onRemoveCandidate,
  onChangeTarget,
}: {
  proposal: MergeProposal;
  selected: boolean;
  draftName: string;
  canManage: boolean;
  index: number;
  onSelect: () => void;
  onDraftNameChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRemoveCandidate: (tagId: number) => void;
  onChangeTarget: () => void;
}) {
  return (
    <article
      className={cn(
        "tag-merge-bubble",
        selected && "tag-merge-bubble-selected",
      )}
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <button
        type="button"
        className="absolute inset-0 rounded-[34px]"
        aria-label={`${proposal.target.name} 병합 후보 선택`}
        onClick={onSelect}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            병합될 태그
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <Input
              value={draftName}
              disabled={!canManage}
              onFocus={onSelect}
              onChange={(event) => onDraftNameChange(event.target.value)}
              className="h-9 max-w-[240px] border-0 border-b border-border/70 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100"
            />
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
              disabled={!canManage}
              onClick={onChangeTarget}
            >
              기준 변경
            </Button>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 rounded-none border-0 bg-transparent p-0 text-rose-500 shadow-none hover:bg-transparent hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-200"
            disabled={!canManage}
            aria-label={`${proposal.target.name} 병합 반려`}
            onClick={onReject}
          >
            <XCircle className="size-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 rounded-none border-0 bg-transparent p-0 text-primary shadow-none hover:bg-transparent hover:text-primary/80"
            disabled={!canManage}
            aria-label={`${proposal.target.name} 병합 승인`}
            onClick={onApprove}
          >
            <CheckCircle2 className="size-5" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        {proposal.candidates.map((tag) => (
          <span
            key={tag.id}
            className="tag-candidate-droplet"
          >
            #{tag.name}
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
              disabled={!canManage}
              aria-label={`${tag.name} 후보 제거`}
              onClick={() => onRemoveCandidate(tag.id)}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{proposal.candidates.length}개 후보</Badge>
        <span>예상 사용량 {proposal.usageCount}회</span>
      </div>
    </article>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/58 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function TagSearchDialog({
  open,
  mode,
  query,
  tags,
  onQueryChange,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  mode: SearchMode;
  query: string;
  tags: TagItem[];
  onQueryChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSelect: (tagId: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,640px)] max-w-none">
        <DialogHeader>
          <DialogTitle>
            {mode === "candidate" ? "후보 태그 추가" : "병합 기준 태그 변경"}
          </DialogTitle>
          <DialogDescription>
            태그명, 분류, 재사용 힌트로 검색해서 선택합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-12 pl-11"
            autoFocus
            placeholder="태그 검색"
          />
        </div>

        <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-left transition-colors hover:border-primary/35 hover:bg-primary/8"
                onClick={() => onSelect(tag.id)}
              >
                <div>
                  <p className="font-medium text-foreground">#{tag.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tag.category} · {tag.usageCount}회 사용
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("border px-2.5 py-0.5", getTagSourceBadgeClass(tag.source))}
                  >
                    {sourceLabelMap[tag.source]}
                  </Badge>
                  <TagStateBadge state={tag.mergeState} />
                </div>
              </button>
            ))
          ) : (
            <EmptyState message="검색 가능한 태그가 없습니다." />
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
