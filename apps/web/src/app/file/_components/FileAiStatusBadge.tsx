import type { AiProcessingStatus } from "@/app/_common/types/api.types";
import { getFileAiStatusMeta } from "@/app/file/_components/file-ai-badge-config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FileAiStatusBadge({
  status,
  iconOnly = false,
}: {
  status: AiProcessingStatus;
  iconOnly?: boolean;
}) {
  const { icon: Icon, label, variant, className, iconClassName } = getFileAiStatusMeta(status);

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
        <Icon className={cn("size-4", iconClassName)} />
      ) : (
        <>
          <Icon className={cn("size-3.5", iconClassName)} />
          <span>{label}</span>
        </>
      )}
    </Badge>
  );
}
