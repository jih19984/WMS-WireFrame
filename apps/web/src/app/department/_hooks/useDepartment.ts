import { useEffect, useState } from "react";
import { getVisibleDepartments } from "@/app/_common/service/access-control";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { departmentService } from "@/app/department/_service/department.service";
import type { Department } from "@/app/department/_types/department.types";

export function useDepartment() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const sync = async () => {
      const items = await departmentService.list();
      setDepartments(getVisibleDepartments(user, items));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  return {
    departments,
    refresh: async () =>
      setDepartments(getVisibleDepartments(user, await departmentService.list())),
  };
}
