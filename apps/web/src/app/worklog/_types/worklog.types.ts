import type { WorklogRecord } from "@/app/_common/service/mock-db";

export type Worklog = WorklogRecord;

export interface WorklogFormValues {
  title: string;
  requestContent: string;
  workContent: string;
  status: WorklogRecord["status"];
  importance: WorklogRecord["importance"];
  actualHours: number;
  instructionDate: string;
  dueDate: string;
  teamId: number;
  authorId: number;
  dependencyIds: number[];
  attachmentNames: string[];
  tagIds: number[];
  aiSummary?: string;
  aiSummaryEdited?: boolean;
  aiRegenerateRequested?: boolean;
}
