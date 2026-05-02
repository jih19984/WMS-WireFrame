import { getNextTeamId, notifyMockDb, teams, users } from "@/app/_common/service/mock-db";
import type { Team, TeamFormValues } from "@/app/team/_types/team.types";

function normalizeMemberIds(memberIds: number[]) {
  return Array.from(new Set(memberIds));
}

function syncUserTeamIds(teamId: number, memberIds: number[]) {
  const selectedMemberIds = new Set(memberIds);

  users.forEach((user) => {
    const isSelected = selectedMemberIds.has(user.id);
    const isAlreadyInTeam = user.teamIds.includes(teamId);

    if (isSelected && !isAlreadyInTeam) {
      user.teamIds = [...user.teamIds, teamId];
      return;
    }

    if (!isSelected && isAlreadyInTeam) {
      const nextTeamIds = user.teamIds.filter((id) => id !== teamId);
      user.teamIds = nextTeamIds;

      if (user.primaryTeamId === teamId && nextTeamIds.length > 0) {
        user.primaryTeamId = nextTeamIds[0];
      }
    }
  });
}

export const teamService = {
  async list(): Promise<Team[]> {
    return [...teams];
  },
  async getById(id: number): Promise<Team | undefined> {
    return teams.find((team) => team.id === id);
  },
  async create(values: TeamFormValues) {
    const id = getNextTeamId();
    const members = normalizeMemberIds(values.members);
    const created: Team = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      operationNote:
        values.status === "INACTIVE"
          ? "비활성 팀은 기록을 유지한 채 읽기 전용으로 관리합니다."
          : "구성원이 남아 있는 팀은 삭제 대신 비활성 전환을 권장합니다.",
      ...values,
      members,
    };
    teams.push(created);
    syncUserTeamIds(id, members);
    notifyMockDb();
    return created;
  },
  async update(id: number, values: TeamFormValues) {
    const target = teams.find((team) => team.id === id);
    if (!target) return undefined;
    const members = normalizeMemberIds(values.members);
    Object.assign(target, values, { members, updatedAt: new Date().toISOString() });
    syncUserTeamIds(id, members);
    notifyMockDb();
    return target;
  },
};
