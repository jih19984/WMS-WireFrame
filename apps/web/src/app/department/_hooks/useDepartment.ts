import { useEffect, useState } from "react";
import { departmentService } from "@/app/department/_service/department.service";
import type { Department } from "@/app/department/_types/department.types";

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    departmentService.list().then(setDepartments);
  }, []);

  return {
    departments,
    refresh: async () => setDepartments(await departmentService.list()),
  };
}
