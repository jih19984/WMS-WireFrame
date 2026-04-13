import {
  evaluations,
  getNextEvaluationId,
  getNextUserId,
  notifyMockDb,
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
      skills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...values,
    };
    users.push(created);
    notifyMockDb();
    return created;
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
