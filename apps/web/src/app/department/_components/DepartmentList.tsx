import { Link } from "react-router-dom";
import { Building2, PenSquare } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import type { Department } from "@/app/department/_types/department.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DepartmentList({ departments }: { departments: Department[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {departments.map((department) => {
        const leader = users.find((user) => user.id === department.leaderId);
        return (
          <Card key={department.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <CardTitle>{department.name}</CardTitle>
                  </div>
                  <CardDescription>{department.description}</CardDescription>
                </div>
                <Badge variant="secondary">{department.activeProjects} 진행중</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-4 text-sm">
                <p className="text-muted-foreground">사업부장</p>
                <p className="mt-1 font-medium">{leader?.name ?? "미지정"}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" asChild={false}>
                  <Link to={`/department/edit/${department.id}`} className="inline-flex items-center gap-2">
                    <PenSquare className="size-4" />
                    수정
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
