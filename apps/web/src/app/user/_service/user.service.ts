import { evaluations, getNextUserId, users } from "@/app/_common/service/mock-db";
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
      teamIds: [values.primaryTeamId],
      status: "ACTIVE",
      avatar: `https://i.pravatar.cc/150?u=${values.email}`,
      skills: [],
      ...values,
    };
    users.push(created);
    return created;
  },
  async update(id: number, values: UserFormValues) {
    const target = users.find((user) => user.id === id);
    if (!target) return undefined;
    Object.assign(target, values, { teamIds: [values.primaryTeamId] });
    return target;
  },
  async getEvaluations(userId: number): Promise<UserEvaluation[]> {
    return evaluations.filter((evaluation) => evaluation.userId === userId);
  },
};
