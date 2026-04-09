import { useEffect, useState } from "react";
import { tagService } from "@/app/tag/_service/tag.service";
import type { TagItem } from "@/app/tag/_types/tag.types";

export function useTag() {
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => {
    tagService.list().then(setTags);
  }, []);

  return {
    tags,
    refresh: async () => setTags(await tagService.list()),
  };
}
