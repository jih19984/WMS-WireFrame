import { useEffect, useState } from "react";
import { fileService } from "@/app/file/_service/file.service";
import type { FileItem } from "@/app/file/_types/file.types";

export function useFile() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const refresh = async () => setFiles(await fileService.list());

  useEffect(() => {
    refresh();
  }, []);

  return {
    files,
    refresh,
    deleteFile: async (id: number) => {
      await fileService.softDelete(id);
      await refresh();
    },
  };
}
