import type { FileRecord } from "@/app/_common/service/mock-db";

export type FileItem = FileRecord;

export interface FileFiltersValue {
  type: string;
  period: "ALL" | "7D" | "30D" | "90D";
  aiStatus: string;
}
