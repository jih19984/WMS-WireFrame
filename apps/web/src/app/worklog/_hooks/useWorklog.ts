import { useEffect, useState } from "react";
import { getVisibleWorklogs } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb, teams } from "@/app/_common/service/mock-db";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import type { Worklog } from "@/app/worklog/_types/worklog.types";

export function useWorklog() {
  const { user } = useAuth();
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);

  useEffect(() => {
    const sync = async () => {
      const items = await worklogService.list();
      setWorklogs(getVisibleWorklogs(user, items, teams));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  return {
    worklogs,
    refresh: async () =>
      setWorklogs(getVisibleWorklogs(user, await worklogService.list(), teams)),
  };
}
