import { ArrowLeftRight, CircleAlert, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tagStateMeta = {
  ACTIVE: {
    label: "운영중",
    icon: CheckCheck,
    className:
      "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300",
  },
  REVIEW: {
    label: "검토 필요",
    icon: CircleAlert,
    className:
      "border-amber-400 bg-amber-50 text-amber-600 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-300",
  },
  MERGE_CANDIDATE: {
    label: "병합 후보",
    icon: ArrowLeftRight,
    className:
      "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-200",
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
