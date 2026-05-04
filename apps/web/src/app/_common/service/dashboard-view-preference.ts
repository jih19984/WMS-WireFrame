import type { UserRole } from "@/app/_common/types/api.types";

export const dashboardViewStorageKey = "ax-wms-dashboard-view-mode";
export const dashboardScopeStorageKey = "ax-wms-dashboard-scope";
export const dashboardViewChangedEvent = "ax-wms-dashboard-view-change";
export const defaultDashboardScopeValue = "DEFAULT";

export type DashboardViewMode =
  | "ADMIN_A"
  | "ADMIN_B"
  | "TEAM_OPERATOR"
  | "PERSONAL";
export type DashboardScopeValue =
  | typeof defaultDashboardScopeValue
  | `DEPARTMENT:${number}`
  | `TEAM:${number}`;

export interface DashboardViewPreference {
  mode: DashboardViewMode;
  scope: DashboardScopeValue;
}

export interface DashboardUserLike {
  id: number;
  role: UserRole;
  departmentId: number;
  primaryTeamId: number;
  teamIds: number[];
}

export interface DashboardTeamLike {
  id: number;
  name: string;
  departmentId: number;
  leaderId: number;
}

export interface DashboardDepartmentLike {
  id: number;
  name: string;
}

export interface DashboardScopeOption {
  label: string;
  value: DashboardScopeValue;
}

export function readStoredDashboardViewPreference(): DashboardViewPreference {
  if (typeof window === "undefined") {
    return { mode: "PERSONAL", scope: defaultDashboardScopeValue };
  }

  const storedMode = window.localStorage.getItem(dashboardViewStorageKey);
  const storedScope = window.localStorage.getItem(dashboardScopeStorageKey);

  return {
    mode: isDashboardViewMode(storedMode) ? storedMode : "PERSONAL",
    scope: isDashboardScopeValue(storedScope)
      ? storedScope
      : defaultDashboardScopeValue,
  };
}

export function writeStoredDashboardViewPreference(
  preference: DashboardViewPreference,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(dashboardViewStorageKey, preference.mode);

  if (preference.scope === defaultDashboardScopeValue) {
    window.localStorage.removeItem(dashboardScopeStorageKey);
  } else {
    window.localStorage.setItem(dashboardScopeStorageKey, preference.scope);
  }

  window.dispatchEvent(
    new CustomEvent<DashboardViewPreference>(dashboardViewChangedEvent, {
      detail: preference,
    }),
  );
}

export function getAvailableDashboardViewModes(
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
): DashboardViewMode[] {
  const modes: DashboardViewMode[] = [];

  if (user.role === "DIRECTOR") modes.push("ADMIN_A");
  if (user.role === "DEPT_HEAD") modes.push("ADMIN_B");
  if (getLedDashboardTeams(user, teams).length > 0) modes.push("TEAM_OPERATOR");

  modes.push("PERSONAL");
  return modes;
}

export function getDefaultDashboardViewPreference(
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
): DashboardViewPreference {
  if (user.role === "DIRECTOR") {
    return { mode: "ADMIN_A", scope: defaultDashboardScopeValue };
  }

  if (user.role === "DEPT_HEAD") {
    return { mode: "ADMIN_B", scope: defaultDashboardScopeValue };
  }

  if (getLedDashboardTeams(user, teams).length > 0) {
    return { mode: "TEAM_OPERATOR", scope: defaultDashboardScopeValue };
  }

  return {
    mode: "PERSONAL",
    scope: getDefaultDashboardScopeForMode("PERSONAL", user, teams),
  };
}

export function normalizeDashboardViewPreference(
  preference: DashboardViewPreference,
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
  departments: DashboardDepartmentLike[] = [],
): DashboardViewPreference {
  const availableModes = getAvailableDashboardViewModes(user, teams);
  const defaultPreference = getDefaultDashboardViewPreference(user, teams);
  const mode = availableModes.includes(preference.mode)
    ? preference.mode
    : defaultPreference.mode;

  const availableScopes = getDashboardScopeOptions(
    mode,
    user,
    teams,
    departments,
  ).map((option) => option.value);
  const defaultScope = getDefaultDashboardScopeForMode(mode, user, teams);

  return {
    mode,
    scope: availableScopes.includes(preference.scope)
      ? preference.scope
      : defaultScope,
  };
}

export function getDefaultDashboardScopeForMode(
  mode: DashboardViewMode,
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
): DashboardScopeValue {
  if (mode !== "PERSONAL") return defaultDashboardScopeValue;

  const personalTeams = getPersonalDashboardTeams(user, teams);
  const primaryTeam = personalTeams.find((team) => team.id === user.primaryTeamId);
  const defaultTeam = primaryTeam ?? personalTeams[0];

  return defaultTeam
    ? (`TEAM:${defaultTeam.id}` as DashboardScopeValue)
    : defaultDashboardScopeValue;
}

export function getDashboardScopeOptions(
  mode: DashboardViewMode,
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
  departments: DashboardDepartmentLike[],
): DashboardScopeOption[] {
  if (mode === "ADMIN_A") {
    return [
      { label: "전체 부서 비교", value: defaultDashboardScopeValue },
      ...departments.map((department) => ({
        label: `부서 드릴다운 · ${department.name}`,
        value: `DEPARTMENT:${department.id}` as DashboardScopeValue,
      })),
      ...teams.map((team) => ({
        label: `팀 상세 · ${team.name}`,
        value: `TEAM:${team.id}` as DashboardScopeValue,
      })),
    ];
  }

  if (mode === "ADMIN_B") {
    const departmentTeams = teams.filter(
      (team) => team.departmentId === user.departmentId,
    );

    return [
      { label: "내 부서 팀 비교", value: defaultDashboardScopeValue },
      ...departmentTeams.map((team) => ({
        label: `팀 상세 · ${team.name}`,
        value: `TEAM:${team.id}` as DashboardScopeValue,
      })),
    ];
  }

  if (mode === "TEAM_OPERATOR") {
    const ledTeams = getLedDashboardTeams(user, teams);

    return [
      { label: "리드 팀 전체", value: defaultDashboardScopeValue },
      ...ledTeams.map((team) => ({
        label: `팀 운영 · ${team.name}`,
        value: `TEAM:${team.id}` as DashboardScopeValue,
      })),
    ];
  }

  return getPersonalDashboardTeams(user, teams).map((team) => ({
    label: `내 업무 · ${team.name}`,
    value: `TEAM:${team.id}` as DashboardScopeValue,
  }));
}

export function getDashboardVisibleTeamIds(
  preference: DashboardViewPreference,
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
): number[] {
  const teamScopeId = parseDashboardTeamScope(preference.scope);
  if (teamScopeId !== null) {
    const team = teams.find((item) => item.id === teamScopeId);
    if (!team) return [];
    if (preference.mode === "ADMIN_B" && team.departmentId !== user.departmentId) {
      return [];
    }
    if (
      preference.mode === "TEAM_OPERATOR" &&
      !getLedDashboardTeams(user, teams).some((item) => item.id === teamScopeId)
    ) {
      return [];
    }
    if (preference.mode === "PERSONAL" && !user.teamIds.includes(teamScopeId)) {
      return [];
    }

    return [teamScopeId];
  }

  if (preference.mode === "ADMIN_A") {
    const departmentScopeId = parseDashboardDepartmentScope(preference.scope);
    if (departmentScopeId !== null) {
      return teams
        .filter((team) => team.departmentId === departmentScopeId)
        .map((team) => team.id);
    }

    return teams.map((team) => team.id);
  }

  if (preference.mode === "ADMIN_B") {
    return teams
      .filter((team) => team.departmentId === user.departmentId)
      .map((team) => team.id);
  }

  if (preference.mode === "TEAM_OPERATOR") {
    return getLedDashboardTeams(user, teams).map((team) => team.id);
  }

  return getDefaultDashboardScopeForMode("PERSONAL", user, teams) ===
    defaultDashboardScopeValue
    ? []
    : getPersonalDashboardTeams(user, teams)
        .filter((team) => team.id === parseDashboardTeamScope(preference.scope))
        .map((team) => team.id);
}

export function getLedDashboardTeams(
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
) {
  const ledTeams = teams.filter((team) => team.leaderId === user.id);

  if (ledTeams.length > 0) return ledTeams;
  if (user.role === "TEAM_LEAD") {
    return teams.filter((team) => user.teamIds.includes(team.id));
  }

  return [];
}

export function getPersonalDashboardTeams(
  user: DashboardUserLike,
  teams: DashboardTeamLike[],
) {
  return teams
    .filter((team) => user.teamIds.includes(team.id))
    .sort((left, right) => {
      if (left.id === user.primaryTeamId) return -1;
      if (right.id === user.primaryTeamId) return 1;
      return left.name.localeCompare(right.name);
    });
}

export function getDashboardViewModeLabel(mode: DashboardViewMode) {
  const labels = {
    ADMIN_A: "관리자 A",
    ADMIN_B: "관리자 B",
    TEAM_OPERATOR: "팀 운영자",
    PERSONAL: "내 업무",
  } as const;

  return labels[mode];
}

export function getDashboardViewModeDescription(mode: DashboardViewMode) {
  const descriptions = {
    ADMIN_A: "본부장 관점으로 부서 간 성과와 리스크를 비교합니다.",
    ADMIN_B: "사업부장 관점으로 내 부서에 속한 팀을 비교합니다.",
    TEAM_OPERATOR: "팀장 관점으로 내가 리드하는 팀의 업무를 봅니다.",
    PERSONAL: "구성원 관점으로 내가 맡은 업무만 봅니다.",
  } as const;

  return descriptions[mode];
}

export function parseDashboardDepartmentScope(scope: DashboardScopeValue) {
  if (!scope.startsWith("DEPARTMENT:")) return null;
  const id = Number(scope.replace("DEPARTMENT:", ""));
  return Number.isFinite(id) ? id : null;
}

export function parseDashboardTeamScope(scope: DashboardScopeValue) {
  if (!scope.startsWith("TEAM:")) return null;
  const id = Number(scope.replace("TEAM:", ""));
  return Number.isFinite(id) ? id : null;
}

function isDashboardViewMode(value: string | null): value is DashboardViewMode {
  return (
    value === "ADMIN_A" ||
    value === "ADMIN_B" ||
    value === "TEAM_OPERATOR" ||
    value === "PERSONAL"
  );
}

function isDashboardScopeValue(
  value: string | null,
): value is DashboardScopeValue {
  if (value === defaultDashboardScopeValue) return true;
  if (!value) return false;
  if (value.startsWith("DEPARTMENT:")) {
    return Number.isFinite(Number(value.replace("DEPARTMENT:", "")));
  }
  if (value.startsWith("TEAM:")) {
    return Number.isFinite(Number(value.replace("TEAM:", "")));
  }
  return false;
}
