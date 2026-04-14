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
    className: "border-[#334155] bg-[#0f172a] text-[#cbd5e1]",
  },
  IN_PROGRESS: {
    icon: LoaderCircle,
    label: getWorklogStatusLabel("IN_PROGRESS"),
    variant: "default",
    className: "border-[#1d4ed8] bg-[#112f72] text-[#60a5fa]",
  },
  DONE: {
    icon: CheckCheck,
    label: getWorklogStatusLabel("DONE"),
    variant: "success",
    className: "border-[#065f46] bg-[#063a32] text-[#5eead4]",
  },
  ON_HOLD: {
    icon: Pause,
    label: getWorklogStatusLabel("ON_HOLD"),
    variant: "warning",
    className: "border-[#92400e] bg-[#4a3210] text-[#fbbf24]",
  },
  CANCELLED: {
    icon: X,
    label: getWorklogStatusLabel("CANCELLED"),
    variant: "destructive",
    className: "border-[#9f1239] bg-[#4a142b] text-[#fda4af]",
  },
};

const importanceBadgeConfig: Record<ImportanceLevel, ImportanceMeta> = {
  URGENT: {
    icon: AlertTriangle,
    label: getImportanceLabel("URGENT"),
    variant: "destructive",
    className: "border-[#9f1239] bg-[#4a142b] text-[#fda4af]",
  },
  HIGH: {
    icon: ArrowUp,
    label: getImportanceLabel("HIGH"),
    variant: "secondary",
    className: "border-[#1e3a8a] bg-[#172554] text-[#dbeafe]",
  },
  NORMAL: {
    icon: Minus,
    label: getImportanceLabel("NORMAL"),
    variant: "secondary",
    className: "border-[#1e3a8a] bg-[#172554] text-[#dbeafe]",
  },
  LOW: {
    icon: ArrowDown,
    label: getImportanceLabel("LOW"),
    variant: "secondary",
    className: "border-[#1e3a8a] bg-[#172554] text-[#dbeafe]",
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
