import type {
  AiProcessingStatus,
  EmploymentStatus,
  ImportanceLevel,
  UserRole,
  WorklogStatus,
} from "@/app/_common/types/api.types";

export interface DepartmentRecord {
  id: number;
  name: string;
  description: string;
  leaderId: number;
  activeProjects: number;
}

export interface TeamRecord {
  id: number;
  name: string;
  departmentId: number;
  leaderId: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  members: number[];
  startDate: string;
  endDate: string;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  departmentId: number;
  primaryTeamId: number;
  teamIds: number[];
  position: string;
  title: string;
  phone: string;
  status: EmploymentStatus;
  avatar: string;
  skills: { name: string; level: number }[];
}

export interface EvaluationRecord {
  id: number;
  userId: number;
  evaluatorId: number;
  content: string;
  createdAt: string;
}

export interface FileRecord {
  id: number;
  worklogId: number;
  name: string;
  type: string;
  size: string;
  aiSummary: string;
  aiStatus: AiProcessingStatus;
  uploadedAt: string;
  isDeleted: boolean;
}

export interface TagRecord {
  id: number;
  name: string;
  usageCount: number;
  category: "AI" | "업무" | "기술" | "부서";
}

export interface WorklogRecord {
  id: number;
  title: string;
  requestContent: string;
  workContent: string;
  status: WorklogStatus;
  importance: ImportanceLevel;
  actualHours: number;
  instructionDate: string;
  dueDate: string;
  completionDate?: string;
  teamId: number;
  authorId: number;
  dependencies: number[];
  aiSummary: string;
  aiSummaryEdited: boolean;
  aiStatus: AiProcessingStatus;
  tagIds: number[];
  fileIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: number;
  userId: number;
  type: "URGENT" | "DEADLINE" | "OVERDUE" | "DEPENDENCY" | "WORKLOAD";
  title: string;
  content: string;
  referenceId?: number;
  isRead: boolean;
  createdAt: string;
}

export const departments: DepartmentRecord[] = [
  { id: 1, name: "데이터컨설팅사업부", description: "데이터 기반 컨설팅 및 분석 서비스", leaderId: 2, activeProjects: 4 },
  { id: 2, name: "솔루션사업부", description: "AI 솔루션 영업 및 고객 대응", leaderId: 3, activeProjects: 3 },
  { id: 3, name: "솔루션개발사업부", description: "AI 솔루션 및 플랫폼 개발", leaderId: 4, activeProjects: 5 }
];

export const teams: TeamRecord[] = [
  { id: 11, name: "MCP Project", departmentId: 3, leaderId: 6, status: "ACTIVE", description: "MCP 기반 협업 도구 구축", members: [6, 7, 8, 9], startDate: "2026-03-01", endDate: "2026-06-30" },
  { id: 12, name: "AX Insight", departmentId: 1, leaderId: 5, status: "ACTIVE", description: "업무 분석 대시보드 고도화", members: [2, 5, 10], startDate: "2026-02-15", endDate: "2026-05-20" },
  { id: 13, name: "PreSales Squad", departmentId: 2, leaderId: 3, status: "ACTIVE", description: "고객 제안 및 데모 운영", members: [3, 11, 12], startDate: "2026-01-01", endDate: "2026-12-31" }
];

export const users: UserRecord[] = [
  { id: 1, name: "이재범", email: "director@ax-wms.com", role: "DIRECTOR", departmentId: 1, primaryTeamId: 12, teamIds: [12], position: "본부장", title: "AX사업본부장", phone: "010-1111-1111", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=director", skills: [{ name: "조직 관리", level: 5 }, { name: "사업 전략", level: 5 }] },
  { id: 2, name: "한서윤", email: "head-data@ax-wms.com", role: "DEPT_HEAD", departmentId: 1, primaryTeamId: 12, teamIds: [12], position: "부장", title: "사업부장", phone: "010-2222-2222", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=head-data", skills: [{ name: "데이터 전략", level: 5 }, { name: "프로젝트 관리", level: 4 }] },
  { id: 3, name: "오민석", email: "head-sales@ax-wms.com", role: "DEPT_HEAD", departmentId: 2, primaryTeamId: 13, teamIds: [13], position: "부장", title: "사업부장", phone: "010-3333-3333", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=head-sales", skills: [{ name: "PreSales", level: 5 }, { name: "고객 제안", level: 4 }] },
  { id: 4, name: "윤지후", email: "head-dev@ax-wms.com", role: "DEPT_HEAD", departmentId: 3, primaryTeamId: 11, teamIds: [11], position: "부장", title: "사업부장", phone: "010-4444-4444", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=head-dev", skills: [{ name: "아키텍처", level: 5 }, { name: "AI 플랫폼", level: 5 }] },
  { id: 5, name: "김나연", email: "leader-data@ax-wms.com", role: "TEAM_LEAD", departmentId: 1, primaryTeamId: 12, teamIds: [12], position: "차장", title: "팀리더", phone: "010-5555-5555", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=leader-data", skills: [{ name: "BI", level: 4 }, { name: "SQL", level: 5 }] },
  { id: 6, name: "박정민", email: "leader-dev@ax-wms.com", role: "TEAM_LEAD", departmentId: 3, primaryTeamId: 11, teamIds: [11], position: "차장", title: "팀리더", phone: "010-6666-6666", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=leader-dev", skills: [{ name: "React", level: 4 }, { name: "FastAPI", level: 4 }] },
  { id: 7, name: "최수빈", email: "member1@ax-wms.com", role: "MEMBER", departmentId: 3, primaryTeamId: 11, teamIds: [11], position: "대리", title: "개발자", phone: "010-7777-7777", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member1", skills: [{ name: "TypeScript", level: 4 }, { name: "UI 구현", level: 4 }] },
  { id: 8, name: "정다희", email: "member2@ax-wms.com", role: "MEMBER", departmentId: 3, primaryTeamId: 11, teamIds: [11], position: "대리", title: "개발자", phone: "010-8888-8888", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member2", skills: [{ name: "NestJS", level: 4 }, { name: "pgvector", level: 3 }] },
  { id: 9, name: "문서연", email: "member3@ax-wms.com", role: "MEMBER", departmentId: 3, primaryTeamId: 11, teamIds: [11], position: "사원", title: "AI 엔지니어", phone: "010-9999-9999", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member3", skills: [{ name: "Gemini", level: 4 }, { name: "RAG", level: 3 }] },
  { id: 10, name: "배지영", email: "member4@ax-wms.com", role: "MEMBER", departmentId: 1, primaryTeamId: 12, teamIds: [12], position: "대리", title: "분석가", phone: "010-1212-1212", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member4", skills: [{ name: "Python", level: 4 }, { name: "문서화", level: 5 }] },
  { id: 11, name: "신호준", email: "member5@ax-wms.com", role: "MEMBER", departmentId: 2, primaryTeamId: 13, teamIds: [13], position: "과장", title: "PreSales", phone: "010-3434-3434", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member5", skills: [{ name: "제안서", level: 5 }, { name: "데모", level: 4 }] },
  { id: 12, name: "서하린", email: "member6@ax-wms.com", role: "MEMBER", departmentId: 2, primaryTeamId: 13, teamIds: [13], position: "대리", title: "영업지원", phone: "010-5656-5656", status: "ACTIVE", avatar: "https://i.pravatar.cc/150?u=member6", skills: [{ name: "업무 조율", level: 4 }, { name: "고객 대응", level: 4 }] }
];

export const evaluations: EvaluationRecord[] = [
  { id: 1, userId: 7, evaluatorId: 6, content: "UI 구현 속도가 빠르고 문서 반영 정확도가 높습니다.", createdAt: "2026-04-02T10:00:00" },
  { id: 2, userId: 8, evaluatorId: 4, content: "백엔드 협업시 커뮤니케이션이 안정적이며 이슈 공유가 빠릅니다.", createdAt: "2026-04-03T11:30:00" }
];

export const tags: TagRecord[] = [
  { id: 1, name: "MCP", usageCount: 18, category: "기술" },
  { id: 2, name: "Gemini", usageCount: 14, category: "AI" },
  { id: 3, name: "pgvector", usageCount: 11, category: "기술" },
  { id: 4, name: "업무자동화", usageCount: 23, category: "업무" },
  { id: 5, name: "요구사항정의", usageCount: 9, category: "업무" },
  { id: 6, name: "솔루션개발사업부", usageCount: 17, category: "부서" }
];

export const worklogs: WorklogRecord[] = [
  { id: 1001, title: "AX-WMS 디자인 시스템 정리", requestContent: "와이어프레임 일관성을 위해 공통 토큰과 shadcn 스타일을 반영해주세요.", workContent: "디자인 토큰과 shadcn 기반 UI 스타일을 피그마와 프로토타입에 반영하고, 컴포넌트 위계를 정리했습니다.", status: "IN_PROGRESS", importance: "HIGH", actualHours: 7.5, instructionDate: "2026-04-04", dueDate: "2026-04-12", teamId: 11, authorId: 7, dependencies: [1003], aiSummary: "디자인 토큰과 공통 컴포넌트 스타일을 정리하고, 프로토타입 기준선을 맞추는 작업을 진행 중입니다.", aiSummaryEdited: false, aiStatus: "DONE", tagIds: [1, 4, 5], fileIds: [2001, 2002], createdAt: "2026-04-04T09:00:00", updatedAt: "2026-04-09T13:40:00" },
  { id: 1002, title: "시맨틱 검색 API 설계 리뷰", requestContent: "pgvector와 role-based filter가 함께 반영되도록 API 설계를 검토해주세요.", workContent: "검색 요청 구조, 필터, 결과 카드 구성, Graph RAG 확장 포인트를 문서화했습니다.", status: "DONE", importance: "NORMAL", actualHours: 5, instructionDate: "2026-04-03", dueDate: "2026-04-07", completionDate: "2026-04-07", teamId: 11, authorId: 8, dependencies: [], aiSummary: "검색 API와 역할 기반 범위 제어를 포함한 시맨틱 검색 구조가 정리되었습니다.", aiSummaryEdited: true, aiStatus: "DONE", tagIds: [2, 3], fileIds: [2003], createdAt: "2026-04-03T10:00:00", updatedAt: "2026-04-07T16:10:00" },
  { id: 1003, title: "요구사항 상세 문서 초안", requestContent: "프로젝트 전체 요구사항을 구조화해서 문서로 정리해주세요.", workContent: "부서/팀/사용자/업무일지/검색/알림/Graph RAG 요구사항을 상세 항목으로 정리했습니다.", status: "DONE", importance: "URGENT", actualHours: 9, instructionDate: "2026-04-01", dueDate: "2026-04-05", completionDate: "2026-04-05", teamId: 12, authorId: 10, dependencies: [], aiSummary: "전체 기획서를 업무 단위로 정리한 요구사항 상세 문서가 완성되었습니다.", aiSummaryEdited: false, aiStatus: "DONE", tagIds: [5], fileIds: [2004], createdAt: "2026-04-01T11:00:00", updatedAt: "2026-04-05T18:00:00" },
  { id: 1004, title: "긴급: 업무 부하 알림 정책 점검", requestContent: "마감 임박 및 과부하 알림 정책이 현실적인지 재검토해주세요.", workContent: "업무 부하 기준치와 실시간/배치 알림 기준을 점검했고, 일부 문구 개선이 필요합니다.", status: "ON_HOLD", importance: "URGENT", actualHours: 3, instructionDate: "2026-04-08", dueDate: "2026-04-10", teamId: 13, authorId: 11, dependencies: [], aiSummary: "알림 정책 검토는 완료되었고, 기준치 재조정 결론이 보류 상태입니다.", aiSummaryEdited: false, aiStatus: "FAILED", tagIds: [4], fileIds: [2005], createdAt: "2026-04-08T08:30:00", updatedAt: "2026-04-09T09:50:00" }
];

export const files: FileRecord[] = [
  { id: 2001, worklogId: 1001, name: "design-system-guide.pdf", type: "PDF", size: "2.4MB", aiSummary: "디자인 토큰과 컴포넌트 가이드가 정리된 문서입니다.", aiStatus: "DONE", uploadedAt: "2026-04-08T16:10:00", isDeleted: false },
  { id: 2002, worklogId: 1001, name: "wireframe-reference.png", type: "PNG", size: "1.1MB", aiSummary: "주요 화면 와이어프레임 참조 이미지입니다.", aiStatus: "DONE", uploadedAt: "2026-04-09T11:00:00", isDeleted: false },
  { id: 2003, worklogId: 1002, name: "semantic-search-api.docx", type: "DOCX", size: "780KB", aiSummary: "검색 API와 필터 명세가 포함된 초안입니다.", aiStatus: "DONE", uploadedAt: "2026-04-07T14:00:00", isDeleted: false },
  { id: 2004, worklogId: 1003, name: "requirements-draft.hwp", type: "HWP", size: "3.8MB", aiSummary: "요구사항 정의서 초안입니다.", aiStatus: "DONE", uploadedAt: "2026-04-05T17:40:00", isDeleted: false },
  { id: 2005, worklogId: 1004, name: "notification-policy.xlsx", type: "XLSX", size: "420KB", aiSummary: "알림 정책 점검용 시트입니다.", aiStatus: "PROCESSING", uploadedAt: "2026-04-09T08:45:00", isDeleted: false }
];

export const notifications: NotificationRecord[] = [
  { id: 3001, userId: 6, type: "URGENT", title: "긴급 업무가 등록되었습니다", content: "박정민님 팀에 긴급 우선순위 업무가 추가되었습니다.", referenceId: 1004, isRead: false, createdAt: "2026-04-09T09:20:00" },
  { id: 3002, userId: 7, type: "DEADLINE", title: "내일이 마감일입니다", content: "AX-WMS 디자인 시스템 정리 업무의 마감이 내일입니다.", referenceId: 1001, isRead: false, createdAt: "2026-04-09T08:00:00" },
  { id: 3003, userId: 1, type: "WORKLOAD", title: "업무 과부하 감지", content: "솔루션개발사업부의 진행중 업무가 기준치를 초과했습니다.", isRead: true, createdAt: "2026-04-08T18:00:00" }
];

let nextDepartmentId = 4;
let nextTeamId = 14;
let nextUserId = 13;
let nextWorklogId = 1005;
let nextTagId = 7;

export function getNextDepartmentId() {
  return nextDepartmentId++;
}

export function getNextTeamId() {
  return nextTeamId++;
}

export function getNextUserId() {
  return nextUserId++;
}

export function getNextWorklogId() {
  return nextWorklogId++;
}

export function getNextTagId() {
  return nextTagId++;
}
