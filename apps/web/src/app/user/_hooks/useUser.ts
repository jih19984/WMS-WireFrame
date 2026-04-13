import { useEffect, useState } from "react";
import { getVisibleUsers } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { userService } from "@/app/user/_service/user.service";
import type { UserProfile } from "@/app/user/_types/user.types";

export function useUser() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const sync = async () => {
      const items = await userService.list();
      setUsers(getVisibleUsers(user, items));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  return {
    users,
    refresh: async () => setUsers(getVisibleUsers(user, await userService.list())),
  };
}
