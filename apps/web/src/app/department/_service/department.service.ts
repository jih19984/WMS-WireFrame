import { departments, getNextDepartmentId } from "@/app/_common/service/mock-db";
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
      ...values,
    };
    departments.push(created);
    return created;
  },
  async update(id: number, values: DepartmentFormValues) {
    const target = departments.find((department) => department.id === id);
    if (!target) return undefined;
    Object.assign(target, values);
    return target;
  },
};
