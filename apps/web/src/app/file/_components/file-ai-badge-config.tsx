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
    className: "border-[#334155] bg-[#0f172a] text-[#cbd5e1]",
  },
  PROCESSING: {
    icon: LoaderCircle,
    label: getAiStatusLabel("PROCESSING"),
    variant: "default",
    className: "border-[#1d4ed8] bg-[#112f72] text-[#60a5fa]",
    iconClassName: "animate-spin",
  },
  DONE: {
    icon: CheckCheck,
    label: getAiStatusLabel("DONE"),
    variant: "success",
    className: "border-[#065f46] bg-[#063a32] text-[#5eead4]",
  },
  FAILED: {
    icon: OctagonAlert,
    label: getAiStatusLabel("FAILED"),
    variant: "destructive",
    className: "border-[#9f1239] bg-[#4a142b] text-[#fda4af]",
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
