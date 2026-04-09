import { users } from "@/app/_common/service/mock-db";

type Listener = () => void;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "DIRECTOR" | "DEPT_HEAD" | "TEAM_LEAD" | "MEMBER";
  departmentId: number;
  primaryTeamId: number;
  teamIds: number[];
  title: string;
  avatar: string;
}

const STORAGE_KEY = "ax-wms-auth-user";
const listeners = new Set<Listener>();

function loadInitialState(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

let currentUser = loadInitialState();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentUser() {
  return currentUser;
}

export function loginAsUser(email: string) {
  const match = users.find((user) => user.email === email);
  if (!match) return null;
  currentUser = {
    id: match.id,
    name: match.name,
    email: match.email,
    role: match.role,
    departmentId: match.departmentId,
    primaryTeamId: match.primaryTeamId,
    teamIds: match.teamIds,
    title: match.title,
    avatar: match.avatar,
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  }
  emit();
  return currentUser;
}

export function logout() {
  currentUser = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  emit();
}
