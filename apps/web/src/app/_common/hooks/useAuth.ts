import { useSyncExternalStore } from "react";
import {
  getCurrentUser,
  loginAsUser,
  logout,
  refreshCurrentUser,
  subscribe,
} from "@/app/_common/store/auth.store";

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser);

  return {
    user,
    login: loginAsUser,
    logout,
    refreshUser: refreshCurrentUser,
    isAuthenticated: Boolean(user),
  };
}
