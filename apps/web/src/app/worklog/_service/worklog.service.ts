import { getNextWorklogId, worklogs } from "@/app/_common/service/mock-db";
import type { Worklog, WorklogFormValues } from "@/app/worklog/_types/worklog.types";

export const worklogService = {
  async list(): Promise<Worklog[]> {
    return [...worklogs];
  },
  async getById(id: number): Promise<Worklog | undefined> {
    return worklogs.find((worklog) => worklog.id === id);
  },
  async create(values: WorklogFormValues) {
    const created: Worklog = {
      id: getNextWorklogId(),
      completionDate: values.status === "DONE" ? values.dueDate : undefined,
      aiSummary: "새로 생성된 업무입니다. AI 파이프라인 mock 상태는 PENDING으로 시작합니다.",
      aiSummaryEdited: false,
      aiStatus: "PENDING",
      tagIds: [],
      fileIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...values,
    };
    worklogs.unshift(created);
    return created;
  },
  async update(id: number, values: WorklogFormValues) {
    const target = worklogs.find((worklog) => worklog.id === id);
    if (!target) return undefined;
    Object.assign(target, values, { updatedAt: new Date().toISOString() });
    return target;
  },
};
