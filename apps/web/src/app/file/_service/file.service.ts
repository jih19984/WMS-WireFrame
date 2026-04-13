import { files, notifyMockDb } from "@/app/_common/service/mock-db";
import type { FileItem } from "@/app/file/_types/file.types";

export const fileService = {
  async list(): Promise<FileItem[]> {
    return files.filter((file) => !file.isDeleted).map((file) => ({ ...file }));
  },
  async softDelete(id: number) {
    const target = files.find((file) => file.id === id);
    if (!target) return undefined;
    target.isDeleted = true;
    notifyMockDb();
    return target;
  },
};
