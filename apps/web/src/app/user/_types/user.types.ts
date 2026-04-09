import type { EvaluationRecord, UserRecord } from "@/app/_common/service/mock-db";

export type UserProfile = UserRecord;
export type UserEvaluation = EvaluationRecord;

export interface UserFormValues {
  name: string;
  email: string;
  role: UserRecord["role"];
  departmentId: number;
  primaryTeamId: number;
  position: string;
  title: string;
  phone: string;
}
