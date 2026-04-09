import { getNextTeamId, teams } from "@/app/_common/service/mock-db";
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
      ...values,
    };
    teams.push(created);
    return created;
  },
  async update(id: number, values: TeamFormValues) {
    const target = teams.find((team) => team.id === id);
    if (!target) return undefined;
    Object.assign(target, values);
    return target;
  },
};
