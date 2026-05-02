import type { TeamRecord } from "@/app/_common/service/mock-db";

export type Team = TeamRecord;

export interface TeamFormValues {
  name: string;
  departmentId: number;
  leaderId: number;
  description: string;
  members: number[];
  status: "ACTIVE" | "INACTIVE";
  startDate: string;
  endDate: string;
}
