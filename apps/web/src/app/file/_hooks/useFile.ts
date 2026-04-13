import { useEffect, useState } from "react";
import { getVisibleFiles } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import {
  subscribeMockDb,
  teams,
  worklogs,
} from "@/app/_common/service/mock-db";
import { fileService } from "@/app/file/_service/file.service";
import type { FileItem } from "@/app/file/_types/file.types";

export function useFile() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);

  const refresh = async () =>
    setFiles(getVisibleFiles(user, await fileService.list(), worklogs, teams));

  useEffect(() => {
    void refresh();
    return subscribeMockDb(() => {
      void refresh();
    });
  }, [user]);

  return {
    files,
    refresh,
    deleteFile: async (id: number) => {
      await fileService.softDelete(id);
      await refresh();
    },
  };
}
