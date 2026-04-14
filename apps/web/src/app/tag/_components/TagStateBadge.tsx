import { ArrowLeftRight, CircleAlert, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tagStateMeta = {
  ACTIVE: {
    label: "운영중",
    variant: "success" as const,
    icon: CheckCheck,
  },
  REVIEW: {
    label: "검토 필요",
    variant: "warning" as const,
    icon: CircleAlert,
  },
  MERGE_CANDIDATE: {
    label: "병합 후보",
    variant: "secondary" as const,
    icon: ArrowLeftRight,
  },
};

export function TagStateBadge({
  state,
}: {
  state: keyof typeof tagStateMeta;
}) {
  const { icon: Icon, label, variant } = tagStateMeta[state];

  return (
    <Badge variant={variant}>
      <Icon className="size-3.5" />
      <span>{label}</span>
    </Badge>
  );
}
