import {
  CheckCheck,
  CircleDashed,
  LoaderCircle,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { AiProcessingStatus } from "@/app/_common/types/api.types";
import type { BadgeProps } from "@/components/ui/badge";
import { getAiStatusLabel } from "@/lib/utils";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

type FileAiStatusMeta = {
  icon: LucideIcon;
  label: string;
  variant: BadgeVariant;
  className: string;
  iconClassName?: string;
};

const fileAiBadgeConfig: Record<AiProcessingStatus, FileAiStatusMeta> = {
  PENDING: {
    icon: CircleDashed,
    label: getAiStatusLabel("PENDING"),
    variant: "outline",
    className:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-400/35 dark:bg-slate-300/12 dark:text-slate-100",
  },
  PROCESSING: {
    icon: LoaderCircle,
    label: getAiStatusLabel("PROCESSING"),
    variant: "default",
    className:
      "border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-400/45 dark:bg-sky-400/16 dark:text-sky-100",
    iconClassName: "animate-spin",
  },
  DONE: {
    icon: CheckCheck,
    label: getAiStatusLabel("DONE"),
    variant: "success",
    className:
      "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-400/45 dark:bg-emerald-400/16 dark:text-emerald-100",
  },
  FAILED: {
    icon: OctagonAlert,
    label: getAiStatusLabel("FAILED"),
    variant: "destructive",
    className:
      "border-red-300 bg-red-100 text-red-800 dark:border-red-400/45 dark:bg-red-400/16 dark:text-red-100",
  },
};

export const fileAiStatusLegendOrder: AiProcessingStatus[] = [
  "PENDING",
  "PROCESSING",
  "DONE",
  "FAILED",
];

export function getFileAiStatusMeta(status: AiProcessingStatus) {
  return fileAiBadgeConfig[status];
}
