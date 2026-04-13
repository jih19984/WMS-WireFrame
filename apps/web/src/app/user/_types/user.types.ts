import type { EvaluationRecord, UserRecord } from "@/app/_common/service/mock-db";

export type UserProfile = UserRecord;
export type UserEvaluation = EvaluationRecord;

export interface UserFormValues {
  name: string;
  email: string;
  role: UserRecord["role"];
  departmentId: number;
  teamIds: number[];
  primaryTeamId: number;
  position: string;
  title: string;
  phone: string;
  employmentStatus: UserRecord["employmentStatus"];
  joinDate: string;
  profileImage: string;
}
