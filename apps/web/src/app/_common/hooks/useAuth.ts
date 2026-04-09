import { useSyncExternalStore } from "react";
import { getCurrentUser, loginAsUser, logout, subscribe } from "@/app/_common/store/auth.store";

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getCurrentUser, getCurrentUser);

  return {
    user,
    login: loginAsUser,
    logout,
    isAuthenticated: Boolean(user),
  };
}
