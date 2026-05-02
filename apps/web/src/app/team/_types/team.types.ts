import type { TeamMemberRoleRecord, TeamRecord } from "@/app/_common/service/mock-db";

export type Team = TeamRecord;

export interface TeamFormValues {
  name: string;
  departmentId: number;
  leaderId: number;
  adminId: number;
  description: string;
  members: number[];
  memberRoles: TeamMemberRoleRecord[];
  status: "ACTIVE" | "INACTIVE";
  startDate: string;
  endDate: string;
}
