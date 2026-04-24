export const teamScopeStorageKey = "ax-wms-team-scope";
export const teamScopeChangedEvent = "ax-wms-team-scope-change";
export const allTeamsScopeValue = "ALL";

export type TeamScopeValue = typeof allTeamsScopeValue | `${number}`;

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
