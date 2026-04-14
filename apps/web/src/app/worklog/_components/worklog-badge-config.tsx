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
};

type ImportanceMeta = {
  icon: LucideIcon;
  label: string;
  variant: BadgeVariant;
};

const statusBadgeConfig: Record<WorklogStatus, StatusMeta> = {
  PENDING: {
    icon: CircleDashed,
    label: getWorklogStatusLabel("PENDING"),
    variant: "outline",
  },
  IN_PROGRESS: {
    icon: LoaderCircle,
    label: getWorklogStatusLabel("IN_PROGRESS"),
    variant: "default",
  },
  DONE: {
    icon: CheckCheck,
    label: getWorklogStatusLabel("DONE"),
    variant: "success",
  },
  ON_HOLD: {
    icon: Pause,
    label: getWorklogStatusLabel("ON_HOLD"),
    variant: "warning",
  },
  CANCELLED: {
    icon: X,
    label: getWorklogStatusLabel("CANCELLED"),
    variant: "destructive",
  },
};

const importanceBadgeConfig: Record<ImportanceLevel, ImportanceMeta> = {
  URGENT: {
    icon: AlertTriangle,
    label: getImportanceLabel("URGENT"),
    variant: "destructive",
  },
  HIGH: {
    icon: ArrowUp,
    label: getImportanceLabel("HIGH"),
    variant: "secondary",
  },
  NORMAL: {
    icon: Minus,
    label: getImportanceLabel("NORMAL"),
    variant: "secondary",
  },
  LOW: {
    icon: ArrowDown,
    label: getImportanceLabel("LOW"),
    variant: "secondary",
  },
};

export const worklogStatusLegendOrder: WorklogStatus[] = [
  "IN_PROGRESS",
  "PENDING",
  "DONE",
  "ON_HOLD",
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
