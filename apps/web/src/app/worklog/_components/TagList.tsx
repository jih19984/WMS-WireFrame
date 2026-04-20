import { tags } from "@/app/_common/service/mock-db";
import { getTagSourceBadgeClass } from "@/app/tag/_utils/tag-badge";
import { Badge } from "@/components/ui/badge";

export function TagList({ tagIds }: { tagIds: number[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags
        .filter((tag) => tagIds.includes(tag.id))
        .map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className={getTagSourceBadgeClass(tag.source)}
          >
            #{tag.name}
          </Badge>
        ))}
    </div>
  );
}
