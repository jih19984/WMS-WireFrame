import { getNextTagId, tags } from "@/app/_common/service/mock-db";
import type { TagItem } from "@/app/tag/_types/tag.types";

export const tagService = {
  async list(): Promise<TagItem[]> {
    return [...tags];
  },
  async create(name: string, category: TagItem["category"]) {
    const created: TagItem = { id: getNextTagId(), name, category, usageCount: 0 };
    tags.push(created);
    return created;
  },
};
