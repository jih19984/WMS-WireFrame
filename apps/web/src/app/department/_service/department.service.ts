import {
  departments,
  getNextDepartmentId,
  notifyMockDb,
} from "@/app/_common/service/mock-db";
import type { Department, DepartmentFormValues } from "@/app/department/_types/department.types";

export const departmentService = {
  async list(): Promise<Department[]> {
    return [...departments];
  },
  async getById(id: number): Promise<Department | undefined> {
    return departments.find((department) => department.id === id);
  },
  async create(values: DepartmentFormValues) {
    const created: Department = {
      id: getNextDepartmentId(),
      activeProjects: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...values,
    };
    departments.push(created);
    notifyMockDb();
    return created;
  },
  async update(id: number, values: DepartmentFormValues) {
    const target = departments.find((department) => department.id === id);
    if (!target) return undefined;
    Object.assign(target, values, { updatedAt: new Date().toISOString() });
    notifyMockDb();
    return target;
  },
};
