import type {
  AiProcessingStatus,
  EmploymentStatus,
  ImportanceLevel,
  UserRole,
  WorklogStatus,
} from "@/app/_common/types/api.types";

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeMockDb(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyMockDb() {
  listeners.forEach((listener) => listener());
}

export interface DepartmentRecord {
  id: number;
  name: string;
  description: string;
  leaderId: number;
  activeProjects: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRecord {
  id: number;
  name: string;
  departmentId: number;
  leaderId: number;
  adminId?: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  members: number[];
  memberRoles?: TeamMemberRoleRecord[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  operationNote: string;
}

export interface TeamMemberRoleRecord {
  userId: number;
  role: string;
}

export interface UserSkillRecord {
  name: string;
  level: number;
  selfRated: boolean;
}

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  departmentId: number;
  primaryTeamId: number;
  teamIds: number[];
  position: string;
  title: string;
  phone: string;
  employmentStatus: EmploymentStatus;
  joinDate: string;
  profileImage: string;
  skills: UserSkillRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationRecord {
  id: number;
  userId: number;
  evaluatorId: number;
  content: string;
  visibility: "MANAGER_ONLY";
  createdAt: string;
}

export interface WorklogStatusHistoryRecord {
  id: number;
  previousStatus?: WorklogStatus;
  newStatus: WorklogStatus;
  changedBy: number;
  reason: string;
  changedAt: string;
}

export interface FileRecord {
  id: number;
  worklogId: number;
  originalName: string;
  storedPath: string;
  type: string;
  size: string;
  summaryPreview: string;
  aiStatus: AiProcessingStatus;
  uploadedAt: string;
  uploadedBy: number;
  isDeleted: boolean;
}

export interface TagRecord {
  id: number;
  name: string;
  usageCount: number;
  category: "AI" | "업무" | "기술" | "부서";
  source: "AI" | "MANUAL";
  mergeState: "ACTIVE" | "REVIEW" | "MERGE_CANDIDATE";
  reuseHint: string;
  mergeTargetId?: number;
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
  dependencyIds: number[];
  aiSummary: string;
  aiSummaryEdited: boolean;
  aiStatus: AiProcessingStatus;
  tagIds: number[];
  fileIds: number[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  statusHistory: WorklogStatusHistoryRecord[];
}

export interface NotificationRecord {
  id: number;
  userId: number;
  type: "URGENT" | "DEADLINE" | "OVERDUE" | "DEPENDENCY" | "WORKLOAD";
  title: string;
  content: string;
  referenceId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  sourceScope: "PERSONAL" | "TEAM" | "DEPARTMENT";
  deepLink: string;
}

export const departments: DepartmentRecord[] = [
  {
    id: 1,
    name: "데이터컨설팅사업부",
    description: "데이터 기반 컨설팅 및 분석 서비스",
    leaderId: 2,
    activeProjects: 1,
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 2,
    name: "솔루션사업부",
    description: "AI 솔루션 영업 및 고객 대응",
    leaderId: 3,
    activeProjects: 1,
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 3,
    name: "솔루션개발사업부",
    description: "AI 솔루션 및 플랫폼 개발",
    leaderId: 4,
    activeProjects: 2,
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
];

export const teams: TeamRecord[] = [
  {
    id: 11,
    name: "MCP Project",
    departmentId: 3,
    leaderId: 6,
    status: "ACTIVE",
    description: "MCP 기반 협업 도구 구축",
    members: [6, 7, 8, 9],
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-04-09T09:00:00",
    operationNote: "프로젝트 종료 시 삭제 대신 비활성화로 전환하는 운영 정책을 사용합니다.",
  },
  {
    id: 12,
    name: "AX Insight",
    departmentId: 1,
    leaderId: 5,
    status: "ACTIVE",
    description: "업무 분석 대시보드 고도화",
    members: [2, 5, 10],
    startDate: "2026-02-15",
    endDate: "2026-05-20",
    createdAt: "2026-02-15T09:00:00",
    updatedAt: "2026-04-09T09:00:00",
    operationNote: "구성원이 남아 있는 팀은 삭제하지 않고 상태를 비활성으로 전환하는 와이어프레임 흐름입니다.",
  },
  {
    id: 13,
    name: "PreSales Squad",
    departmentId: 2,
    leaderId: 3,
    status: "ACTIVE",
    description: "고객 제안 및 데모 운영",
    members: [3, 11, 12],
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    createdAt: "2026-01-01T09:00:00",
    updatedAt: "2026-04-09T09:00:00",
    operationNote: "마감 임박 제안서를 집중 관리하는 영업 대응 팀입니다.",
  },
  {
    id: 14,
    name: "AI RAG Lab",
    departmentId: 3,
    leaderId: 6,
    status: "ACTIVE",
    description: "LLM, 임베딩, RAG 품질 실험 및 프롬프트 튜닝",
    members: [6, 7, 8, 9],
    startDate: "2026-03-20",
    endDate: "2026-08-31",
    createdAt: "2026-03-20T09:00:00",
    updatedAt: "2026-04-09T09:00:00",
    operationNote: "복수 팀 소속 와이어프레임 검증용 서브 프로젝트입니다.",
  },
  {
    id: 15,
    name: "Data Quality Cell",
    departmentId: 1,
    leaderId: 10,
    adminId: 2,
    status: "ACTIVE",
    description: "데이터 품질 규칙과 검증 기준을 정리하는 운영 팀",
    members: [2, 10, 7],
    memberRoles: [
      { userId: 2, role: "품질 정책 승인" },
      { userId: 10, role: "데이터 검증 리드" },
      { userId: 7, role: "프론트 검증 화면 지원" },
    ],
    startDate: "2026-04-01",
    endDate: "2026-07-15",
    createdAt: "2026-04-01T09:00:00",
    updatedAt: "2026-04-12T09:00:00",
    operationNote: "활성 팀 필터와 페이지네이션 확인을 위한 데이터 품질 관리 팀입니다.",
  },
  {
    id: 16,
    name: "Workflow Automation",
    departmentId: 3,
    leaderId: 8,
    adminId: 4,
    status: "ACTIVE",
    description: "반복 업무 자동화와 알림 트리거를 실험하는 팀",
    members: [4, 8, 9],
    memberRoles: [
      { userId: 4, role: "자동화 방향 승인" },
      { userId: 8, role: "AI 자동화 설계" },
      { userId: 9, role: "시나리오 테스트" },
    ],
    startDate: "2026-04-05",
    endDate: "2026-09-30",
    createdAt: "2026-04-05T09:00:00",
    updatedAt: "2026-04-15T09:00:00",
    operationNote: "업무 자동화 검토를 진행 중인 활성 팀입니다.",
  },
  {
    id: 17,
    name: "Customer Demo TF",
    departmentId: 2,
    leaderId: 11,
    adminId: 3,
    status: "ACTIVE",
    description: "고객 데모와 제안 시나리오를 빠르게 구성하는 태스크포스",
    members: [3, 11, 12],
    memberRoles: [
      { userId: 3, role: "고객 커뮤니케이션 총괄" },
      { userId: 11, role: "데모 스토리라인 리드" },
      { userId: 12, role: "제안 자료 지원" },
    ],
    startDate: "2026-04-18",
    endDate: "2026-06-10",
    createdAt: "2026-04-18T09:00:00",
    updatedAt: "2026-04-20T09:00:00",
    operationNote: "고객 데모 준비 상태를 관리하는 단기 활성 팀입니다.",
  },
  {
    id: 18,
    name: "Legacy Migration",
    departmentId: 3,
    leaderId: 6,
    adminId: 4,
    status: "INACTIVE",
    description: "레거시 업무관리 데이터 이전 검증을 마친 팀",
    members: [4, 6, 7],
    memberRoles: [
      { userId: 4, role: "이관 범위 승인" },
      { userId: 6, role: "마이그레이션 리드" },
      { userId: 7, role: "UI 회귀 점검" },
    ],
    startDate: "2026-01-10",
    endDate: "2026-03-31",
    createdAt: "2026-01-10T09:00:00",
    updatedAt: "2026-04-01T09:00:00",
    operationNote: "검증이 완료되어 비활성화된 마이그레이션 팀입니다.",
  },
  {
    id: 19,
    name: "Search Relevance TF",
    departmentId: 1,
    leaderId: 5,
    adminId: 2,
    status: "INACTIVE",
    description: "통합 검색 관련성 평가 기준을 정리했던 팀",
    members: [2, 5, 10],
    memberRoles: [
      { userId: 2, role: "평가 기준 승인" },
      { userId: 5, role: "검색 품질 리드" },
      { userId: 10, role: "분석 데이터 정리" },
    ],
    startDate: "2026-02-01",
    endDate: "2026-04-10",
    createdAt: "2026-02-01T09:00:00",
    updatedAt: "2026-04-11T09:00:00",
    operationNote: "검색 평가 기준 정리가 끝나 비활성화된 팀입니다.",
  },
  {
    id: 20,
    name: "Alert Policy Review",
    departmentId: 1,
    leaderId: 10,
    adminId: 2,
    status: "INACTIVE",
    description: "업무 알림 기준과 예외 정책을 검토했던 팀",
    members: [2, 10, 8],
    memberRoles: [
      { userId: 2, role: "정책 의사결정" },
      { userId: 10, role: "운영 기준 정리" },
      { userId: 8, role: "AI 알림 기준 검토" },
    ],
    startDate: "2026-03-01",
    endDate: "2026-04-25",
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-04-26T09:00:00",
    operationNote: "알림 정책 초안 검토가 완료되어 보관 중인 비활성 팀입니다.",
  },
];

export const users: UserRecord[] = [
  {
    id: 1,
    name: "이재범",
    email: "director@ax-wms.com",
    role: "DIRECTOR",
    departmentId: 1,
    primaryTeamId: 12,
    teamIds: [12],
    position: "전무",
    title: "AX사업본부장",
    phone: "010-1111-1111",
    employmentStatus: "ACTIVE",
    joinDate: "2021-03-02",
    profileImage: "https://i.pravatar.cc/150?u=director",
    skills: [
      { name: "조직 관리", level: 5, selfRated: false },
      { name: "사업 전략", level: 5, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 2,
    name: "한서윤",
    email: "head-data@ax-wms.com",
    role: "DEPT_HEAD",
    departmentId: 1,
    primaryTeamId: 12,
    teamIds: [12],
    position: "부장",
    title: "데이터컨설팅사업부장",
    phone: "010-2222-2222",
    employmentStatus: "ACTIVE",
    joinDate: "2022-01-10",
    profileImage: "https://i.pravatar.cc/150?u=head-data",
    skills: [
      { name: "데이터 전략", level: 5, selfRated: false },
      { name: "프로젝트 관리", level: 4, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 3,
    name: "오민석",
    email: "head-sales@ax-wms.com",
    role: "DEPT_HEAD",
    departmentId: 2,
    primaryTeamId: 13,
    teamIds: [13],
    position: "부장",
    title: "솔루션사업부장",
    phone: "010-3333-3333",
    employmentStatus: "ACTIVE",
    joinDate: "2022-05-16",
    profileImage: "https://i.pravatar.cc/150?u=head-sales",
    skills: [
      { name: "PreSales", level: 5, selfRated: false },
      { name: "고객 제안", level: 4, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 4,
    name: "윤지후",
    email: "head-dev@ax-wms.com",
    role: "DEPT_HEAD",
    departmentId: 3,
    primaryTeamId: 11,
    teamIds: [11, 14],
    position: "부장",
    title: "솔루션개발사업부장",
    phone: "010-4444-4444",
    employmentStatus: "ACTIVE",
    joinDate: "2021-11-08",
    profileImage: "https://i.pravatar.cc/150?u=head-dev",
    skills: [
      { name: "아키텍처", level: 5, selfRated: false },
      { name: "AI 플랫폼", level: 5, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 5,
    name: "김나연",
    email: "leader-data@ax-wms.com",
    role: "TEAM_LEAD",
    departmentId: 1,
    primaryTeamId: 12,
    teamIds: [12],
    position: "차장",
    title: "팀리더",
    phone: "010-5555-5555",
    employmentStatus: "ACTIVE",
    joinDate: "2023-04-03",
    profileImage: "https://i.pravatar.cc/150?u=leader-data",
    skills: [
      { name: "BI", level: 4, selfRated: false },
      { name: "SQL", level: 5, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 6,
    name: "박정민",
    email: "leader-dev@ax-wms.com",
    role: "TEAM_LEAD",
    departmentId: 3,
    primaryTeamId: 11,
    teamIds: [11, 14],
    position: "차장",
    title: "팀리더",
    phone: "010-6666-6666",
    employmentStatus: "ACTIVE",
    joinDate: "2022-07-11",
    profileImage: "https://i.pravatar.cc/150?u=leader-dev",
    skills: [
      { name: "React", level: 4, selfRated: false },
      { name: "FastAPI", level: 4, selfRated: false },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 7,
    name: "최수빈",
    email: "member1@ax-wms.com",
    role: "MEMBER",
    departmentId: 3,
    primaryTeamId: 11,
    teamIds: [11, 14],
    position: "대리",
    title: "프론트엔드 개발자",
    phone: "010-7777-7777",
    employmentStatus: "ACTIVE",
    joinDate: "2024-02-19",
    profileImage: "https://i.pravatar.cc/150?u=member1",
    skills: [
      { name: "TypeScript", level: 4, selfRated: true },
      { name: "UI 구현", level: 4, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 8,
    name: "정다희",
    email: "member2@ax-wms.com",
    role: "MEMBER",
    departmentId: 3,
    primaryTeamId: 14,
    teamIds: [11, 14],
    position: "대리",
    title: "백엔드 개발자",
    phone: "010-8888-8888",
    employmentStatus: "ACTIVE",
    joinDate: "2024-03-11",
    profileImage: "https://i.pravatar.cc/150?u=member2",
    skills: [
      { name: "NestJS", level: 4, selfRated: true },
      { name: "pgvector", level: 3, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 9,
    name: "문서연",
    email: "member3@ax-wms.com",
    role: "MEMBER",
    departmentId: 3,
    primaryTeamId: 14,
    teamIds: [11, 14],
    position: "사원",
    title: "AI 엔지니어",
    phone: "010-9999-9999",
    employmentStatus: "LEAVE",
    joinDate: "2025-01-13",
    profileImage: "https://i.pravatar.cc/150?u=member3",
    skills: [
      { name: "Gemini", level: 4, selfRated: true },
      { name: "RAG", level: 3, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 10,
    name: "배지영",
    email: "member4@ax-wms.com",
    role: "MEMBER",
    departmentId: 1,
    primaryTeamId: 12,
    teamIds: [12],
    position: "대리",
    title: "분석가",
    phone: "010-1212-1212",
    employmentStatus: "ACTIVE",
    joinDate: "2023-08-21",
    profileImage: "https://i.pravatar.cc/150?u=member4",
    skills: [
      { name: "Python", level: 4, selfRated: true },
      { name: "문서화", level: 5, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 11,
    name: "신호준",
    email: "member5@ax-wms.com",
    role: "MEMBER",
    departmentId: 2,
    primaryTeamId: 13,
    teamIds: [13],
    position: "과장",
    title: "PreSales",
    phone: "010-3434-3434",
    employmentStatus: "ACTIVE",
    joinDate: "2023-01-09",
    profileImage: "https://i.pravatar.cc/150?u=member5",
    skills: [
      { name: "제안서", level: 5, selfRated: true },
      { name: "데모", level: 4, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
  {
    id: 12,
    name: "서하린",
    email: "member6@ax-wms.com",
    role: "MEMBER",
    departmentId: 2,
    primaryTeamId: 13,
    teamIds: [13],
    position: "대리",
    title: "영업지원",
    phone: "010-5656-5656",
    employmentStatus: "INACTIVE",
    joinDate: "2024-06-24",
    profileImage: "https://i.pravatar.cc/150?u=member6",
    skills: [
      { name: "업무 조율", level: 4, selfRated: true },
      { name: "고객 대응", level: 4, selfRated: true },
    ],
    createdAt: "2026-01-02T09:00:00",
    updatedAt: "2026-04-08T10:30:00",
  },
];

export const evaluations: EvaluationRecord[] = [
  {
    id: 1,
    userId: 7,
    evaluatorId: 6,
    content: "UI 구현 속도가 빠르고 문서 반영 정확도가 높습니다.",
    visibility: "MANAGER_ONLY",
    createdAt: "2026-04-02T10:00:00",
  },
  {
    id: 2,
    userId: 8,
    evaluatorId: 4,
    content: "백엔드 협업 시 커뮤니케이션이 안정적이며 이슈 공유가 빠릅니다.",
    visibility: "MANAGER_ONLY",
    createdAt: "2026-04-03T11:30:00",
  },
];

export const tags: TagRecord[] = [
  {
    id: 1,
    name: "MCP",
    usageCount: 18,
    category: "기술",
    source: "AI",
    mergeState: "ACTIVE",
    reuseHint: "관리형 태그 풀의 기준 태그로 재사용 중입니다.",
  },
  {
    id: 2,
    name: "Gemini",
    usageCount: 14,
    category: "AI",
    source: "AI",
    mergeState: "ACTIVE",
    reuseHint: "LLM 호출 관련 업무에 자동 재사용됩니다.",
  },
  {
    id: 3,
    name: "pgvector",
    usageCount: 11,
    category: "기술",
    source: "AI",
    mergeState: "ACTIVE",
    reuseHint: "임베딩 저장소 관련 태그로 유지합니다.",
  },
  {
    id: 4,
    name: "업무자동화",
    usageCount: 23,
    category: "업무",
    source: "MANUAL",
    mergeState: "ACTIVE",
    reuseHint: "업무일지 자동화 시나리오에 가장 많이 재사용됩니다.",
  },
  {
    id: 5,
    name: "요구사항정의",
    usageCount: 9,
    category: "업무",
    source: "MANUAL",
    mergeState: "REVIEW",
    reuseHint: "기획 문서/프로젝트 착수 태그와 통합 검토 중입니다.",
  },
  {
    id: 6,
    name: "솔루션개발사업부",
    usageCount: 17,
    category: "부서",
    source: "AI",
    mergeState: "ACTIVE",
    reuseHint: "부서 컨텍스트 추론 시 자동 부여됩니다.",
  },
  {
    id: 7,
    name: "AI자동화",
    usageCount: 4,
    category: "업무",
    source: "AI",
    mergeState: "MERGE_CANDIDATE",
    reuseHint: "업무자동화 태그와 유사하여 병합 후보로 표시합니다.",
    mergeTargetId: 4,
  },
];

export const files: FileRecord[] = [
  {
    id: 2001,
    worklogId: 1001,
    originalName: "design-system-guide.pdf",
    storedPath: "SD/MCP/2026/04/1001_design-system-guide_20260408161000.pdf",
    type: "PDF",
    size: "2.4MB",
    summaryPreview: "디자인 토큰과 공용 컴포넌트 운영 원칙이 정리된 문서입니다.",
    aiStatus: "DONE",
    uploadedAt: "2026-04-08T16:10:00",
    uploadedBy: 7,
    isDeleted: false,
  },
  {
    id: 2002,
    worklogId: 1001,
    originalName: "wireframe-reference.png",
    storedPath: "SD/MCP/2026/04/1001_wireframe-reference_20260409110000.png",
    type: "PNG",
    size: "1.1MB",
    summaryPreview: "주요 화면 와이어프레임 참조 이미지입니다.",
    aiStatus: "DONE",
    uploadedAt: "2026-04-09T11:00:00",
    uploadedBy: 7,
    isDeleted: false,
  },
  {
    id: 2003,
    worklogId: 1002,
    originalName: "semantic-search-api.docx",
    storedPath: "SD/RAG/2026/04/1002_semantic-search-api_20260407140000.docx",
    type: "DOCX",
    size: "780KB",
    summaryPreview: "검색 API와 필터 명세, 결과 카드 구조가 포함된 초안입니다.",
    aiStatus: "DONE",
    uploadedAt: "2026-04-07T14:00:00",
    uploadedBy: 8,
    isDeleted: false,
  },
  {
    id: 2004,
    worklogId: 1003,
    originalName: "requirements-draft.hwp",
    storedPath: "DC/AXINSIGHT/2026/04/1003_requirements-draft_20260405174000.hwp",
    type: "HWP",
    size: "3.8MB",
    summaryPreview: "요구사항 정의서 초안입니다.",
    aiStatus: "DONE",
    uploadedAt: "2026-04-05T17:40:00",
    uploadedBy: 10,
    isDeleted: false,
  },
  {
    id: 2005,
    worklogId: 1004,
    originalName: "notification-policy.xlsx",
    storedPath: "SS/PRESALES/2026/04/1004_notification-policy_20260409084500.xlsx",
    type: "XLSX",
    size: "420KB",
    summaryPreview: "알림 정책 점검용 시트이며 기준치 조정안이 포함되어 있습니다.",
    aiStatus: "PROCESSING",
    uploadedAt: "2026-04-09T08:45:00",
    uploadedBy: 11,
    isDeleted: false,
  },
  {
    id: 2006,
    worklogId: 1005,
    originalName: "demo-script.pptx",
    storedPath: "SS/PRESALES/2026/04/1005_demo-script_20260410103000.pptx",
    type: "PPTX",
    size: "6.1MB",
    summaryPreview: "고객 데모 진행 순서와 FAQ 응답 시나리오가 포함된 발표 자료입니다.",
    aiStatus: "DONE",
    uploadedAt: "2026-04-10T10:30:00",
    uploadedBy: 12,
    isDeleted: false,
  },
  {
    id: 2007,
    worklogId: 1007,
    originalName: "chunking-prompt-notes.md",
    storedPath: "SD/RAG/2026/04/1007_chunking-prompt-notes_20260411153000.md",
    type: "MD",
    size: "52KB",
    summaryPreview: "청킹 프롬프트 개선안과 실패 사례가 정리된 메모입니다.",
    aiStatus: "FAILED",
    uploadedAt: "2026-04-11T15:30:00",
    uploadedBy: 9,
    isDeleted: false,
  },
];

export const worklogs: WorklogRecord[] = [
  {
    id: 1001,
    title: "AX-WMS 디자인 시스템 정리",
    requestContent: "와이어프레임 일관성을 위해 공통 토큰과 shadcn 스타일을 반영해주세요.",
    workContent: "디자인 토큰과 shadcn 기반 UI 스타일을 피그마와 프로토타입에 반영하고, 컴포넌트 위계를 정리했습니다.",
    status: "IN_PROGRESS",
    importance: "HIGH",
    actualHours: 7.5,
    instructionDate: "2026-04-04",
    dueDate: "2026-04-14",
    teamId: 11,
    authorId: 7,
    dependencyIds: [1003],
    aiSummary: "디자인 토큰과 공용 컴포넌트 스타일을 정리하고, 프로토타입 기준선을 맞추는 작업을 진행 중입니다.",
    aiSummaryEdited: false,
    aiStatus: "DONE",
    tagIds: [1, 4, 5],
    fileIds: [2001, 2002],
    isDeleted: false,
    createdAt: "2026-04-04T09:00:00",
    updatedAt: "2026-04-09T13:40:00",
    statusHistory: [
      {
        id: 5001,
        newStatus: "PENDING",
        changedBy: 7,
        reason: "업무일지 생성",
        changedAt: "2026-04-04T09:00:00",
      },
      {
        id: 5002,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 6,
        reason: "디자인 토큰 적용 작업을 시작했습니다.",
        changedAt: "2026-04-05T10:10:00",
      },
    ],
  },
  {
    id: 1002,
    title: "시맨틱 검색 API 설계 리뷰",
    requestContent: "pgvector와 role-based filter가 함께 반영되도록 API 설계를 검토해주세요.",
    workContent: "검색 요청 구조, 필터, 결과 카드 구성, Graph RAG 확장 포인트를 문서화했습니다.",
    status: "DONE",
    importance: "NORMAL",
    actualHours: 5,
    instructionDate: "2026-04-03",
    dueDate: "2026-04-07",
    completionDate: "2026-04-07",
    teamId: 14,
    authorId: 8,
    dependencyIds: [],
    aiSummary: "검색 API와 역할 기반 범위 제어를 포함한 시맨틱 검색 구조가 정리되었습니다.",
    aiSummaryEdited: true,
    aiStatus: "DONE",
    tagIds: [2, 3],
    fileIds: [2003],
    isDeleted: false,
    createdAt: "2026-04-03T10:00:00",
    updatedAt: "2026-04-07T16:10:00",
    statusHistory: [
      {
        id: 5003,
        newStatus: "PENDING",
        changedBy: 8,
        reason: "업무일지 생성",
        changedAt: "2026-04-03T10:00:00",
      },
      {
        id: 5004,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 8,
        reason: "검색 설계 리뷰 착수",
        changedAt: "2026-04-03T13:20:00",
      },
      {
        id: 5005,
        previousStatus: "IN_PROGRESS",
        newStatus: "DONE",
        changedBy: 6,
        reason: "리뷰 반영과 문서 정리가 완료되었습니다.",
        changedAt: "2026-04-07T16:10:00",
      },
    ],
  },
  {
    id: 1003,
    title: "요구사항 상세 문서 초안",
    requestContent: "프로젝트 전체 요구사항을 구조화해서 문서로 정리해주세요.",
    workContent: "부서/팀/사용자/업무일지/검색/알림/Graph RAG 요구사항을 상세 항목으로 정리했습니다.",
    status: "DONE",
    importance: "URGENT",
    actualHours: 9,
    instructionDate: "2026-04-01",
    dueDate: "2026-04-05",
    completionDate: "2026-04-05",
    teamId: 12,
    authorId: 10,
    dependencyIds: [],
    aiSummary: "전체 기획서를 업무 단위로 정리한 요구사항 상세 문서가 완성되었습니다.",
    aiSummaryEdited: false,
    aiStatus: "DONE",
    tagIds: [5],
    fileIds: [2004],
    isDeleted: false,
    createdAt: "2026-04-01T11:00:00",
    updatedAt: "2026-04-05T18:00:00",
    statusHistory: [
      {
        id: 5006,
        newStatus: "PENDING",
        changedBy: 10,
        reason: "업무일지 생성",
        changedAt: "2026-04-01T11:00:00",
      },
      {
        id: 5007,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 5,
        reason: "기획 문서 작성을 시작했습니다.",
        changedAt: "2026-04-02T09:30:00",
      },
      {
        id: 5008,
        previousStatus: "IN_PROGRESS",
        newStatus: "DONE",
        changedBy: 2,
        reason: "요구사항 리뷰와 수정이 완료되었습니다.",
        changedAt: "2026-04-05T18:00:00",
      },
    ],
  },
  {
    id: 1004,
    title: "긴급: 업무 부하 알림 정책 점검",
    requestContent: "마감 임박 및 과부하 알림 정책이 현실적인지 재검토해주세요.",
    workContent: "업무 부하 기준치와 실시간/배치 알림 기준을 점검했고, 일부 문구 개선이 필요합니다.",
    status: "ON_HOLD",
    importance: "URGENT",
    actualHours: 3,
    instructionDate: "2026-04-08",
    dueDate: "2026-04-10",
    teamId: 13,
    authorId: 11,
    dependencyIds: [],
    aiSummary: "알림 정책 검토는 완료되었고, 기준치 재조정 결론이 보류 상태입니다.",
    aiSummaryEdited: false,
    aiStatus: "FAILED",
    tagIds: [4],
    fileIds: [2005],
    isDeleted: false,
    createdAt: "2026-04-08T08:30:00",
    updatedAt: "2026-04-09T09:50:00",
    statusHistory: [
      {
        id: 5009,
        newStatus: "PENDING",
        changedBy: 11,
        reason: "업무일지 생성",
        changedAt: "2026-04-08T08:30:00",
      },
      {
        id: 5010,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 3,
        reason: "정책 점검 작업 시작",
        changedAt: "2026-04-08T10:00:00",
      },
      {
        id: 5011,
        previousStatus: "IN_PROGRESS",
        newStatus: "ON_HOLD",
        changedBy: 3,
        reason: "사업부장 승인 대기",
        changedAt: "2026-04-09T09:50:00",
      },
    ],
  },
  {
    id: 1005,
    title: "고객 데모 시나리오 리허설 준비",
    requestContent: "내주 제안 발표 전 데모 시나리오와 FAQ를 정리해주세요.",
    workContent: "고객 질의 예상 리스트를 정리하고 데모 흐름을 표준 스크립트로 통합했습니다.",
    status: "IN_PROGRESS",
    importance: "HIGH",
    actualHours: 4.5,
    instructionDate: "2026-04-10",
    dueDate: "2026-04-15",
    teamId: 13,
    authorId: 12,
    dependencyIds: [1004],
    aiSummary: "제안 발표 전 고객 데모 시나리오와 FAQ 응답 흐름을 정리하고 있습니다.",
    aiSummaryEdited: false,
    aiStatus: "PROCESSING",
    tagIds: [4],
    fileIds: [2006],
    isDeleted: false,
    createdAt: "2026-04-10T09:30:00",
    updatedAt: "2026-04-10T14:20:00",
    statusHistory: [
      {
        id: 5012,
        newStatus: "PENDING",
        changedBy: 12,
        reason: "업무일지 생성",
        changedAt: "2026-04-10T09:30:00",
      },
      {
        id: 5013,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 3,
        reason: "리허설 자료 정리를 시작했습니다.",
        changedAt: "2026-04-10T14:20:00",
      },
    ],
  },
  {
    id: 1006,
    title: "부서별 업무 부하 대시보드 시안 제작",
    requestContent: "관리자 화면에 부서별 진행중 업무 수와 주간 시간을 보여주세요.",
    workContent: "부서별 집계 카드와 기준치 초과 표시 패턴을 시안으로 만들었습니다.",
    status: "PENDING",
    importance: "NORMAL",
    actualHours: 2,
    instructionDate: "2026-04-09",
    dueDate: "2026-04-16",
    teamId: 12,
    authorId: 5,
    dependencyIds: [1003],
    aiSummary: "관리자용 부하 대시보드 초안을 준비 중이며, 기준치 강조 패턴을 검토하고 있습니다.",
    aiSummaryEdited: false,
    aiStatus: "PENDING",
    tagIds: [4, 5],
    fileIds: [],
    isDeleted: false,
    createdAt: "2026-04-09T15:00:00",
    updatedAt: "2026-04-09T15:00:00",
    statusHistory: [
      {
        id: 5014,
        newStatus: "PENDING",
        changedBy: 5,
        reason: "업무일지 생성",
        changedAt: "2026-04-09T15:00:00",
      },
    ],
  },
  {
    id: 1007,
    title: "지능형 청킹 프롬프트 정밀화",
    requestContent: "3,000자 초과 문서의 청킹 품질을 높일 프롬프트를 정리해주세요.",
    workContent: "문서 구조와 의미 전환점을 기준으로 청킹하도록 프롬프트를 보완했지만 일부 실패 사례가 남아 있습니다.",
    status: "DONE",
    importance: "HIGH",
    actualHours: 6,
    instructionDate: "2026-04-07",
    dueDate: "2026-04-11",
    completionDate: "2026-04-11",
    teamId: 14,
    authorId: 9,
    dependencyIds: [],
    aiSummary: "지능형 청킹 프롬프트를 정교화했으며 실패 사례를 별도로 기록했습니다.",
    aiSummaryEdited: true,
    aiStatus: "FAILED",
    tagIds: [2, 3, 7],
    fileIds: [2007],
    isDeleted: false,
    createdAt: "2026-04-07T09:00:00",
    updatedAt: "2026-04-11T18:20:00",
    statusHistory: [
      {
        id: 5015,
        newStatus: "PENDING",
        changedBy: 9,
        reason: "업무일지 생성",
        changedAt: "2026-04-07T09:00:00",
      },
      {
        id: 5016,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 6,
        reason: "프롬프트 품질 개선 작업 시작",
        changedAt: "2026-04-08T10:30:00",
      },
      {
        id: 5017,
        previousStatus: "IN_PROGRESS",
        newStatus: "DONE",
        changedBy: 6,
        reason: "실패 사례 정리까지 완료",
        changedAt: "2026-04-11T18:20:00",
      },
    ],
  },
  {
    id: 1008,
    title: "임베딩 재처리 배치 복구",
    requestContent: "파일 임베딩 재처리 배치가 실패한 원인을 확인하고 복구 방안을 정리해주세요.",
    workContent: "배치 실패 로그를 확인했고, 재처리 큐 분리와 재시도 정책 보완이 필요하다는 결론을 정리했습니다.",
    status: "FAILED",
    importance: "HIGH",
    actualHours: 3.5,
    instructionDate: "2026-04-11",
    dueDate: "2026-04-13",
    teamId: 14,
    authorId: 9,
    dependencyIds: [],
    aiSummary: "임베딩 재처리 배치가 실패하여 원인 분석과 복구 방안 정리가 필요한 상태입니다.",
    aiSummaryEdited: false,
    aiStatus: "FAILED",
    tagIds: [2, 3, 7],
    fileIds: [],
    isDeleted: false,
    createdAt: "2026-04-11T14:10:00",
    updatedAt: "2026-04-13T11:25:00",
    statusHistory: [
      {
        id: 5018,
        newStatus: "PENDING",
        changedBy: 9,
        reason: "업무일지 생성",
        changedAt: "2026-04-11T14:10:00",
      },
      {
        id: 5019,
        previousStatus: "PENDING",
        newStatus: "IN_PROGRESS",
        changedBy: 6,
        reason: "배치 로그 분석과 복구 검토를 시작했습니다.",
        changedAt: "2026-04-11T15:40:00",
      },
      {
        id: 5020,
        previousStatus: "IN_PROGRESS",
        newStatus: "FAILED",
        changedBy: 6,
        reason: "재처리 배치 실패 원인이 확인되어 실패 상태로 전환했습니다.",
        changedAt: "2026-04-13T11:25:00",
      },
    ],
  },
];

export const notifications: NotificationRecord[] = [
  {
    id: 3001,
    userId: 6,
    type: "URGENT",
    title: "긴급 업무가 등록되었습니다",
    content: "신호준님의 긴급 업무가 등록되었습니다: 업무 부하 알림 정책 점검",
    referenceId: 1004,
    isRead: false,
    createdAt: "2026-04-09T09:20:00",
    sourceScope: "TEAM",
    deepLink: "/worklog/detail/1004",
  },
  {
    id: 3002,
    userId: 7,
    type: "DEADLINE",
    title: "내일이 마감일입니다",
    content: "AX-WMS 디자인 시스템 정리 업무의 마감이 내일입니다.",
    referenceId: 1001,
    isRead: false,
    createdAt: "2026-04-13T08:00:00",
    sourceScope: "PERSONAL",
    deepLink: "/worklog/detail/1001",
  },
  {
    id: 3003,
    userId: 1,
    type: "WORKLOAD",
    title: "업무 과부하 감지",
    content: "솔루션개발사업부의 진행중 업무가 기준치를 초과했습니다.",
    referenceId: 1001,
    isRead: true,
    readAt: "2026-04-12T09:10:00",
    createdAt: "2026-04-12T09:00:00",
    sourceScope: "DEPARTMENT",
    deepLink: "/worklog/detail/1001",
  },
  {
    id: 3004,
    userId: 11,
    type: "OVERDUE",
    title: "마감일이 초과되었습니다",
    content: "업무 부하 알림 정책 점검 업무가 3일 지연되었습니다.",
    referenceId: 1004,
    isRead: false,
    createdAt: "2026-04-13T09:00:00",
    sourceScope: "PERSONAL",
    deepLink: "/worklog/detail/1004",
  },
  {
    id: 3005,
    userId: 12,
    type: "DEPENDENCY",
    title: "선행 업무 상태가 변경되었습니다",
    content: "알림 정책 점검 업무가 보류 상태로 바뀌어 후행 업무 진행 전 확인이 필요합니다.",
    referenceId: 1004,
    isRead: false,
    createdAt: "2026-04-09T10:00:00",
    sourceScope: "PERSONAL",
    deepLink: "/worklog/detail/1004",
  },
  {
    id: 3006,
    userId: 2,
    type: "WORKLOAD",
    title: "부서 부하 지표를 확인해주세요",
    content: "데이터컨설팅사업부의 진행중 업무 시간이 주간 기준치를 넘겼습니다.",
    referenceId: 1006,
    isRead: false,
    createdAt: "2026-04-13T09:00:00",
    sourceScope: "DEPARTMENT",
    deepLink: "/worklog/detail/1006",
  },
];

let nextDepartmentId = 4;
let nextTeamId = 21;
let nextUserId = 13;
let nextWorklogId = 1009;
let nextTagId = 8;
let nextFileId = 2008;
let nextEvaluationId = 3;
let nextStatusHistoryId = 5021;
let nextNotificationId = 3007;

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

export function getNextFileId() {
  return nextFileId++;
}

export function getNextEvaluationId() {
  return nextEvaluationId++;
}

export function getNextStatusHistoryId() {
  return nextStatusHistoryId++;
}

export function getNextNotificationId() {
  return nextNotificationId++;
}
