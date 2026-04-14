import type { ImportanceLevel } from "@/app/_common/types/api.types";
import { getImportanceBadgeMeta } from "@/app/worklog/_components/worklog-badge-config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ImportanceBadge({
  importance,
  iconOnly = false,
}: {
  importance: ImportanceLevel;
  iconOnly?: boolean;
}) {
  const { icon: Icon, label, variant, className } = getImportanceBadgeMeta(importance);

  return (
    <Badge
      variant={variant}
      aria-label={label}
      title={label}
      className={cn(
        "border",
        className,
        iconOnly && "size-8 shrink-0 justify-center rounded-full p-0",
      )}
    >
      {iconOnly ? (
        <Icon className="size-4" />
      ) : (
        <>
          <Icon className="size-3.5" />
          <span>{label}</span>
        </>
      )}
    </Badge>
  );
}
