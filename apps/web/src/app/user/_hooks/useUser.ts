import { useEffect, useState } from "react";
import { userService } from "@/app/user/_service/user.service";
import type { UserProfile } from "@/app/user/_types/user.types";

export function useUser() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    userService.list().then(setUsers);
  }, []);

  return {
    users,
    refresh: async () => setUsers(await userService.list()),
  };
}
