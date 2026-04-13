import { useEffect, useState } from "react";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { tagService } from "@/app/tag/_service/tag.service";
import type { TagItem } from "@/app/tag/_types/tag.types";

export function useTag() {
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => {
    const sync = async () => {
      setTags(await tagService.list());
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, []);

  return {
    tags,
    refresh: async () => setTags(await tagService.list()),
  };
}
