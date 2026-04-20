import { ArrowLeftRight, CircleAlert, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tagStateMeta = {
  ACTIVE: {
    label: "운영중",
    icon: CheckCheck,
    className:
      "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm dark:border-emerald-400/55 dark:bg-emerald-400/16 dark:text-emerald-100",
  },
  REVIEW: {
    label: "검토 필요",
    icon: CircleAlert,
    className:
      "border-orange-300 bg-orange-100 text-orange-800 shadow-sm dark:border-orange-400/55 dark:bg-orange-400/16 dark:text-orange-100",
  },
  MERGE_CANDIDATE: {
    label: "병합 후보",
    icon: ArrowLeftRight,
    className:
      "border-violet-300 bg-violet-100 text-violet-800 shadow-sm dark:border-violet-400/55 dark:bg-violet-400/16 dark:text-violet-100",
  },
};

export function TagStateBadge({
  state,
}: {
  state: keyof typeof tagStateMeta;
}) {
  const { icon: Icon, label, className } = tagStateMeta[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-[0.01em]",
        className,
      )}
    >
      <Icon className="size-3.5" />
      <span>{label}</span>
    </span>
  );
}
