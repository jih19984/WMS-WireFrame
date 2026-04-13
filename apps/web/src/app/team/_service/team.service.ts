import { getNextTeamId, notifyMockDb, teams } from "@/app/_common/service/mock-db";
import type { Team, TeamFormValues } from "@/app/team/_types/team.types";

export const teamService = {
  async list(): Promise<Team[]> {
    return [...teams];
  },
  async getById(id: number): Promise<Team | undefined> {
    return teams.find((team) => team.id === id);
  },
  async create(values: TeamFormValues) {
    const created: Team = {
      id: getNextTeamId(),
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      operationNote:
        values.status === "INACTIVE"
          ? "비활성 팀은 기록을 유지한 채 읽기 전용으로 관리합니다."
          : "구성원이 남아 있는 팀은 삭제 대신 비활성 전환을 권장합니다.",
      ...values,
    };
    teams.push(created);
    notifyMockDb();
    return created;
  },
  async update(id: number, values: TeamFormValues) {
    const target = teams.find((team) => team.id === id);
    if (!target) return undefined;
    Object.assign(target, values, { updatedAt: new Date().toISOString() });
    notifyMockDb();
    return target;
  },
};
