import { ArrowLeftRight, CheckCheck, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tagStateMeta = {
  ACTIVE: {
    label: "운영중",
    icon: CheckCheck,
    className:
      "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm dark:border-emerald-400/55 dark:bg-emerald-400/16 dark:text-emerald-100",
  },
  REVIEW: {
    label: "",
    icon: Clock3,
    className:
      "border-orange-300 bg-orange-100 text-orange-800 shadow-sm dark:border-orange-400/55 dark:bg-orange-400/16 dark:text-orange-100",
  },
  MERGE_CANDIDATE: {
    label: "추천 후보",
    icon: ArrowLeftRight,
    className:
      "border-violet-300 bg-violet-100 text-violet-800 shadow-sm dark:border-violet-400/55 dark:bg-violet-400/16 dark:text-violet-100",
  },
  PENDING: {
    label: "배치 대기",
    icon: Clock3,
    className:
      "border-sky-300 bg-sky-100 text-sky-800 shadow-sm dark:border-sky-400/55 dark:bg-sky-400/16 dark:text-sky-100",
  },
};

export function TagStateBadge({
  state,
}: {
  state: keyof typeof tagStateMeta;
}) {
  if (state === "REVIEW") return null;

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
