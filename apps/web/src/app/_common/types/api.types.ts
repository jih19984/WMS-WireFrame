export type UserRole = "DIRECTOR" | "DEPT_HEAD" | "TEAM_LEAD" | "MEMBER";
export type EmploymentStatus = "ACTIVE" | "LEAVE" | "INACTIVE";
export type WorklogStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DONE"
  | "ON_HOLD"
  | "FAILED"
  | "CANCELLED";
export type ImportanceLevel = "URGENT" | "HIGH" | "NORMAL" | "LOW";
export type AiProcessingStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}
