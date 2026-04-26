export const teamScopeStorageKey = "ax-wms-team-scope";
export const teamScopeModeStorageKey = "ax-wms-team-scope-mode";
export const teamScopeChangedEvent = "ax-wms-team-scope-change";
export const allTeamsScopeValue = "ALL";

export type TeamScopeValue = typeof allTeamsScopeValue | `${number}`;
export type TeamScopeMode = "PRIMARY" | "CUSTOM";

export function readStoredTeamScope(): TeamScopeValue {
  if (typeof window === "undefined") return allTeamsScopeValue;

  const storedValue = window.localStorage.getItem(teamScopeStorageKey);
  if (!storedValue || storedValue === allTeamsScopeValue) return allTeamsScopeValue;

  return Number.isFinite(Number(storedValue))
    ? (storedValue as `${number}`)
    : allTeamsScopeValue;
}

export function writeStoredTeamScope(value: TeamScopeValue) {
  if (typeof window === "undefined") return;

  if (value === allTeamsScopeValue) {
    window.localStorage.removeItem(teamScopeStorageKey);
  } else {
    window.localStorage.setItem(teamScopeStorageKey, value);
  }

  window.dispatchEvent(new CustomEvent<TeamScopeValue>(teamScopeChangedEvent, {
    detail: value,
  }));
}

export function readStoredTeamScopeMode(fallback: TeamScopeMode = "PRIMARY"): TeamScopeMode {
  if (typeof window === "undefined") return fallback;

  const storedValue = window.localStorage.getItem(teamScopeModeStorageKey);
  return storedValue === "CUSTOM" || storedValue === "PRIMARY"
    ? storedValue
    : fallback;
}

export function writeStoredTeamScopeMode(value: TeamScopeMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(teamScopeModeStorageKey, value);
}
