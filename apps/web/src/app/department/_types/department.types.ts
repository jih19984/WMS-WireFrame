import type { DepartmentRecord } from "@/app/_common/service/mock-db";

export type Department = DepartmentRecord;

export interface DepartmentFormValues {
  name: string;
  description: string;
  leaderId: number;
}
