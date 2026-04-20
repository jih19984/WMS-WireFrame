import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCheck,
  CircleDashed,
  LoaderCircle,
  Minus,
  Pause,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ImportanceLevel, WorklogStatus } from "@/app/_common/types/api.types";
import type { BadgeProps } from "@/components/ui/badge";
import { getImportanceLabel, getWorklogStatusLabel } from "@/lib/utils";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

type StatusMeta = {
  icon: LucideIcon;
  label: string;
  variant: BadgeVariant;
  className: string;
};

type ImportanceMeta = {
  icon: LucideIcon;
  label: string;
  variant: BadgeVariant;
  className: string;
};

const statusBadgeConfig: Record<WorklogStatus, StatusMeta> = {
  PENDING: {
    icon: CircleDashed,
    label: getWorklogStatusLabel("PENDING"),
    variant: "outline",
    className:
      "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-400/35 dark:bg-slate-300/12 dark:text-slate-100",
  },
  IN_PROGRESS: {
    icon: LoaderCircle,
    label: getWorklogStatusLabel("IN_PROGRESS"),
    variant: "default",
    className:
      "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-400/45 dark:bg-blue-400/16 dark:text-blue-100",
  },
  DONE: {
    icon: CheckCheck,
    label: getWorklogStatusLabel("DONE"),
    variant: "success",
    className:
      "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-400/45 dark:bg-emerald-400/16 dark:text-emerald-100",
  },
  ON_HOLD: {
    icon: Pause,
    label: getWorklogStatusLabel("ON_HOLD"),
    variant: "warning",
    className:
      "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-400/45 dark:bg-amber-400/16 dark:text-amber-100",
  },
  FAILED: {
    icon: AlertTriangle,
    label: getWorklogStatusLabel("FAILED"),
    variant: "destructive",
    className:
      "border-red-300 bg-red-100 text-red-800 dark:border-red-400/45 dark:bg-red-400/16 dark:text-red-100",
  },
  CANCELLED: {
    icon: X,
    label: getWorklogStatusLabel("CANCELLED"),
    variant: "destructive",
    className:
      "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800 dark:border-fuchsia-400/45 dark:bg-fuchsia-400/16 dark:text-fuchsia-100",
  },
};

const importanceBadgeConfig: Record<ImportanceLevel, ImportanceMeta> = {
  URGENT: {
    icon: AlertTriangle,
    label: getImportanceLabel("URGENT"),
    variant: "destructive",
    className:
      "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-400/45 dark:bg-rose-400/16 dark:text-rose-100",
  },
  HIGH: {
    icon: ArrowUp,
    label: getImportanceLabel("HIGH"),
    variant: "secondary",
    className:
      "border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-400/45 dark:bg-indigo-400/16 dark:text-indigo-100",
  },
  NORMAL: {
    icon: Minus,
    label: getImportanceLabel("NORMAL"),
    variant: "secondary",
    className:
      "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-300/45 dark:bg-sky-300/14 dark:text-sky-100",
  },
  LOW: {
    icon: ArrowDown,
    label: getImportanceLabel("LOW"),
    variant: "secondary",
    className:
      "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-300/45 dark:bg-teal-300/14 dark:text-teal-100",
  },
};

export const worklogStatusLegendOrder: WorklogStatus[] = [
  "IN_PROGRESS",
  "PENDING",
  "DONE",
  "ON_HOLD",
  "FAILED",
  "CANCELLED",
];

export const worklogImportanceLegendOrder: ImportanceLevel[] = [
  "URGENT",
  "HIGH",
  "NORMAL",
  "LOW",
];

export function getStatusBadgeMeta(status: WorklogStatus) {
  return statusBadgeConfig[status];
}

export function getImportanceBadgeMeta(importance: ImportanceLevel) {
  return importanceBadgeConfig[importance];
}
