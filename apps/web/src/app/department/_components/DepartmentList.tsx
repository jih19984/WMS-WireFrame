import { Link } from "react-router-dom";
import { Building2, PenSquare } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import type { Department } from "@/app/department/_types/department.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function DepartmentList({
  departments,
  readOnly = false,
}: {
  departments: Department[];
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {departments.map((department) => {
        const leader = users.find((user) => user.id === department.leaderId);
        return (
          <Card key={department.id} className="relative overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-5 text-muted-foreground" />
                    <CardTitle className="text-[18px] font-[600] tracking-[-0.04em]">{department.name}</CardTitle>
                  </div>
                  <CardDescription className="text-[14px] leading-relaxed line-clamp-2">{department.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1 font-[500]">{department.activeProjects} 진행중</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-5 text-sm transition-colors hover:bg-muted/60">
                <p className="mb-1 text-muted-foreground text-[13px]">사업부장</p>
                <p className="text-[16px] font-[500]">{leader?.name ?? "미지정"}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">생성일</p>
                  <p className="font-medium">{formatDate(department.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">수정일</p>
                  <p className="font-medium">{formatDate(department.updatedAt)}</p>
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                부서 삭제는 실제 구현 시 소속 팀과 사용자가 남아 있으면 차단됩니다. 현재 와이어프레임에서는 정책 안내만 제공합니다.
              </div>
              <div className="flex items-center justify-end gap-2">
                {!readOnly ? (
                  <Button variant="outline" asChild>
                    <Link to={`/department/edit/${department.id}`} className="inline-flex items-center gap-2">
                      <PenSquare className="size-4" />
                      수정
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
