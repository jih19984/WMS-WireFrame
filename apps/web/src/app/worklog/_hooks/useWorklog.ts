import { useEffect, useState } from "react";
import { worklogService } from "@/app/worklog/_service/worklog.service";
import type { Worklog } from "@/app/worklog/_types/worklog.types";

export function useWorklog() {
  const [worklogs, setWorklogs] = useState<Worklog[]>([]);

  useEffect(() => {
    worklogService.list().then(setWorklogs);
  }, []);

  return {
    worklogs,
    refresh: async () => setWorklogs(await worklogService.list()),
  };
}
