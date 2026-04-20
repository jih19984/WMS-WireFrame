import {
  evaluations,
  getNextEvaluationId,
  getNextUserId,
  notifyMockDb,
  teams,
  users,
} from "@/app/_common/service/mock-db";
import type { UserEvaluation, UserFormValues, UserProfile } from "@/app/user/_types/user.types";

export const userService = {
  async list(): Promise<UserProfile[]> {
    return [...users];
  },
  async getById(id: number): Promise<UserProfile | undefined> {
    return users.find((user) => user.id === id);
  },
  async create(values: UserFormValues) {
    const created: UserProfile = {
      id: getNextUserId(),
      password: "password123",
      skills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...values,
    };
    users.push(created);
    notifyMockDb();
    return created;
  },
  async signup(values: {
    departmentId: number;
    name: string;
    email: string;
    password: string;
    position: string;
    joinDate: string;
    profileImage: string;
    phone: string;
  }) {
    const normalizedEmail = values.email.trim().toLowerCase();
    const emailExists = users.some(
      (user) => user.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      return {
        ok: false as const,
        message: "이미 사용 중인 이메일입니다.",
      };
    }

    const departmentTeams = teams.filter(
      (team) => team.departmentId === values.departmentId && team.status === "ACTIVE",
    );
    const primaryTeamId = departmentTeams[0]?.id ?? 0;
    const now = new Date().toISOString();

    const created: UserProfile = {
      id: getNextUserId(),
      name: values.name.trim(),
      email: normalizedEmail,
      password: values.password,
      role: "MEMBER",
      departmentId: values.departmentId,
      primaryTeamId,
      teamIds: primaryTeamId ? [primaryTeamId] : [],
      position: values.position.trim(),
      title: "팀원",
      phone: values.phone.trim(),
      employmentStatus: "ACTIVE",
      joinDate: values.joinDate,
      profileImage: values.profileImage.trim(),
      skills: [],
      createdAt: now,
      updatedAt: now,
    };

    users.push(created);
    notifyMockDb();

    return {
      ok: true as const,
      user: created,
    };
  },
  async update(id: number, values: UserFormValues) {
    const target = users.find((user) => user.id === id);
    if (!target) return undefined;
    Object.assign(target, values, {
      teamIds: values.teamIds,
      updatedAt: new Date().toISOString(),
    });
    notifyMockDb();
    return target;
  },
  async updatePassword(id: number, currentPassword: string, nextPassword: string) {
    const target = users.find((user) => user.id === id);
    if (!target) {
      return { ok: false as const, message: "사용자 정보를 찾을 수 없습니다." };
    }

    const resolvedPassword = target.password ?? "password123";
    if (resolvedPassword !== currentPassword) {
      return { ok: false as const, message: "현재 비밀번호가 올바르지 않습니다." };
    }

    target.password = nextPassword;
    target.updatedAt = new Date().toISOString();
    notifyMockDb();

    return { ok: true as const };
  },
  async getEvaluations(userId: number): Promise<UserEvaluation[]> {
    return evaluations.filter((evaluation) => evaluation.userId === userId);
  },
  async addEvaluation(userId: number, evaluatorId: number, content: string) {
    const created: UserEvaluation = {
      id: getNextEvaluationId(),
      userId,
      evaluatorId,
      content,
      visibility: "MANAGER_ONLY",
      createdAt: new Date().toISOString(),
    };
    evaluations.unshift(created);
    notifyMockDb();
    return created;
  },
};
