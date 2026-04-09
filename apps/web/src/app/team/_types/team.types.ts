import type { TeamRecord } from "@/app/_common/service/mock-db";

export type Team = TeamRecord;

export interface TeamFormValues {
  name: string;
  departmentId: number;
  leaderId: number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  startDate: string;
  endDate: string;
}
