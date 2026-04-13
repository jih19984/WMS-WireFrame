import { getNextTagId, notifyMockDb, tags } from "@/app/_common/service/mock-db";
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
};
