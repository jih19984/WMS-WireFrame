import type { AuthUser } from "@/app/_common/store/auth.store";
import type {
  DepartmentRecord,
  FileRecord,
  NotificationRecord,
  TeamRecord,
  UserRecord,
  WorklogRecord,
} from "@/app/_common/service/mock-db";

export function isDirector(user: AuthUser | null | undefined) {
  return user?.role === "DIRECTOR";
}

export function isDepartmentHead(user: AuthUser | null | undefined) {
  return user?.role === "DEPT_HEAD";
}

export function isTeamLead(user: AuthUser | null | undefined) {
  return user?.role === "TEAM_LEAD";
}

export function canManageDepartments(user: AuthUser | null | undefined) {
  return isDirector(user);
}

export function canManageTeams(user: AuthUser | null | undefined) {
  return isDirector(user) || isDepartmentHead(user);
}

export function canManageUsers(user: AuthUser | null | undefined) {
  return isDirector(user) || isDepartmentHead(user);
}

export function canEditUserProfile(
  user: AuthUser | null | undefined,
  targetUserId?: number,
) {
  if (!user || !targetUserId) return false;
  return canManageUsers(user) || user.id === targetUserId;
}

export function canManageTags(user: AuthUser | null | undefined) {
  return isDirector(user) || isDepartmentHead(user);
}

export function canCreateWorklog(user: AuthUser | null | undefined) {
  return Boolean(user);
}

export function canWriteEvaluations(
  user: AuthUser | null | undefined,
  targetUserId?: number,
) {
  return (
    Boolean(user) &&
    (isDirector(user) || isDepartmentHead(user)) &&
    user?.id !== targetUserId
  );
}

export function canViewEvaluations(user: AuthUser | null | undefined) {
  return isDirector(user) || isDepartmentHead(user);
}

export function getVisibleDepartments(
  user: AuthUser | null | undefined,
  items: DepartmentRecord[],
) {
  if (!user) return [];
  if (isDirector(user)) return items;
  return items.filter((department) => department.id === user.departmentId);
}

export function getVisibleTeams(
  user: AuthUser | null | undefined,
  items: TeamRecord[],
) {
  if (!user) return [];
  if (isDirector(user)) return items;
  if (isDepartmentHead(user)) {
    return items.filter((team) => team.departmentId === user.departmentId);
  }
  return items.filter((team) => user.teamIds.includes(team.id));
}

export function getVisibleUsers(
  user: AuthUser | null | undefined,
  items: UserRecord[],
) {
  if (!user) return [];
  if (isDirector(user)) return items;
  if (isDepartmentHead(user)) {
    return items.filter((member) => member.departmentId === user.departmentId);
  }
  if (isTeamLead(user)) {
    return items.filter((member) =>
      member.teamIds.some((teamId) => user.teamIds.includes(teamId)),
    );
  }
  return items.filter((member) => member.id === user.id);
}

export function getVisibleWorklogs(
  user: AuthUser | null | undefined,
  items: WorklogRecord[],
  teams: TeamRecord[],
) {
  if (!user) return [];
  const activeItems = items.filter((worklog) => !worklog.isDeleted);

  if (isDirector(user)) return activeItems;

  if (isDepartmentHead(user)) {
    return activeItems.filter((worklog) => {
      const team = teams.find((item) => item.id === worklog.teamId);
      return team?.departmentId === user.departmentId;
    });
  }

  if (isTeamLead(user)) {
    return activeItems.filter((worklog) => user.teamIds.includes(worklog.teamId));
  }

  return activeItems.filter((worklog) => worklog.authorId === user.id);
}

export function getVisibleFiles(
  user: AuthUser | null | undefined,
  items: FileRecord[],
  worklogs: WorklogRecord[],
  teams: TeamRecord[],
) {
  if (!user) return [];
  const visibleWorklogIds = new Set(
    getVisibleWorklogs(user, worklogs, teams).map((worklog) => worklog.id),
  );

  return items.filter(
    (file) => !file.isDeleted && visibleWorklogIds.has(file.worklogId),
  );
}

export function getVisibleNotifications(
  user: AuthUser | null | undefined,
  items: NotificationRecord[],
) {
  if (!user) return [];
  return items
    .filter((notification) => notification.userId === user.id)
    .sort((left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
}

export function canEditWorklog(
  user: AuthUser | null | undefined,
  worklog: WorklogRecord,
) {
  if (!user) return false;
  return (
    user.id === worklog.authorId || isDirector(user) || isDepartmentHead(user)
  );
}

export function canTransitionWorklog(
  user: AuthUser | null | undefined,
  worklog: WorklogRecord,
) {
  if (!user) return false;

  if (user.id === worklog.authorId) return true;
  if (isDirector(user) || isDepartmentHead(user)) return true;
  if (isTeamLead(user) && user.teamIds.includes(worklog.teamId)) return true;
  return false;
}

export function getDefaultSearchFilters(user: AuthUser | null | undefined) {
  const departmentId = user && isDepartmentHead(user) ? String(user.departmentId) : "all";
  const teamId = user && isTeamLead(user) ? String(user.primaryTeamId) : "all";

  return {
    sourceType: "all",
    departmentId,
    teamId,
    status: "all",
    importance: "all",
    authorId: user && user.role === "MEMBER" ? String(user.id) : "all",
    tagId: "all",
    period: "ALL" as const,
  };
}
