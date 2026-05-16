import { getNextTagId, notifyMockDb, tags, worklogs } from "@/app/_common/service/mock-db";
import type { TagItem } from "@/app/tag/_types/tag.types";

export const tagService = {
  async list(): Promise<TagItem[]> {
    return [...tags];
  },
  async create(name: string, category: TagItem["category"]) {
    const created: TagItem = {
      id: getNextTagId(),
      name,
      category,
      usageCount: 0,
      source: "MANUAL",
      mergeState: "REVIEW",
      reuseHint: "신규 태그이며 기존 유사 태그와의 병합 검토가 필요합니다.",
    };
    tags.push(created);
    notifyMockDb();
    return created;
  },
  async approveMerge(tagIds: number[], targetId: number, targetName?: string) {
    const selectedIds = Array.from(new Set(tagIds)).filter((id) => id !== targetId);
    const target = tags.find((tag) => tag.id === targetId);

    if (!target) {
      throw new Error("병합 기준 태그를 찾을 수 없습니다.");
    }

    if (targetName?.trim()) {
      target.name = targetName.trim();
    }

    selectedIds.forEach((id) => {
      const tag = tags.find((item) => item.id === id);
      if (!tag) return;

      tag.mergeState = "PENDING";
      tag.mergeTargetId = targetId;
      tag.reuseHint =
        "병합 승인 완료 상태입니다. 새벽 배치 전까지 LLM 자동 태깅 후보에서 제외됩니다.";
    });

    target.mergeState = "ACTIVE";
    target.mergeTargetId = undefined;
    target.reuseHint = "승인된 후보 태그가 새벽 배치에서 이 태그로 병합됩니다.";

    notifyMockDb();
    return target;
  },
  async rejectMerge(tagIds: number[]) {
    const selectedIds = Array.from(new Set(tagIds));

    selectedIds.forEach((id) => {
      const tag = tags.find((item) => item.id === id);
      if (!tag) return;

      tag.mergeState = "REVIEW";
      tag.mergeTargetId = undefined;
      tag.reuseHint = "추천 병합 후보에서 반려되어 별도 검토 대상으로 남았습니다.";
    });

    notifyMockDb();
  },
  async merge(tagIds: number[], targetId: number) {
    const selectedIds = Array.from(new Set(tagIds));
    const mergeIds = selectedIds.filter((id) => id !== targetId);

    if (mergeIds.length === 0) {
      return tags.find((tag) => tag.id === targetId);
    }

    const target = tags.find((tag) => tag.id === targetId);
    if (!target) {
      throw new Error("병합 대상 태그를 찾을 수 없습니다.");
    }

    const mergedTags = tags.filter((tag) => mergeIds.includes(tag.id));
    const mergedUsageCount = mergedTags.reduce((sum, tag) => sum + tag.usageCount, 0);

    worklogs.forEach((worklog) => {
      if (!mergeIds.some((id) => worklog.tagIds.includes(id))) return;

      const nextTagIds = worklog.tagIds.map((id) => (mergeIds.includes(id) ? targetId : id));
      worklog.tagIds = Array.from(new Set(nextTagIds));
      worklog.updatedAt = new Date().toISOString();
    });

    target.usageCount += mergedUsageCount;
    target.mergeState = "ACTIVE";
    target.mergeTargetId = undefined;
    target.reuseHint = "병합 완료 후 운영 태그로 유지되며, 관련 업무에 재사용됩니다.";

    mergeIds.forEach((id) => {
      const index = tags.findIndex((tag) => tag.id === id);
      if (index >= 0) {
        tags.splice(index, 1);
      }
    });

    notifyMockDb();
    return target;
  },
};
