import { Link } from "react-router-dom";
import { Building2, PenSquare } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import type { Department } from "@/app/department/_types/department.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { formatDate } from "@/lib/utils";

export function DepartmentList({
  departments,
  readOnly = false,
}: {
  departments: Department[];
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {departments.map((department) => {
        const leader = users.find((user) => user.id === department.leaderId);
        return (
          <CardSpotlight
            key={department.id}
            className="relative overflow-hidden rounded-[26px] transition-transform duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-primary/18 via-primary/8 to-transparent">
                      <Building2 className="size-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-[18px] font-[600] tracking-[-0.04em]">{department.name}</CardTitle>
                  </div>
                  <CardDescription className="text-[14px] leading-relaxed line-clamp-2">{department.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="px-3 py-1 font-[500]">
                  {department.activeProjects} 진행중
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/25 p-5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <p className="mb-1 text-muted-foreground text-[13px]">사업부장</p>
                <p className="text-[16px] font-[500]">{leader?.name ?? "미지정"}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">생성일</p>
                  <p className="font-medium">{formatDate(department.createdAt)}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm">
                  <p className="mb-1 text-[13px] text-muted-foreground">수정일</p>
                  <p className="font-medium">{formatDate(department.updatedAt)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 text-sm text-muted-foreground">
                부서 삭제는 실제 구현 시 소속 팀과 사용자가 남아 있으면 차단됩니다. 현재 와이어프레임에서는 정책 안내만 제공합니다.
              </div>
              <div className="flex items-center justify-end gap-2">
                {!readOnly ? (
                  <Button variant="default" asChild>
                    <Link to={`/department/edit/${department.id}`} className="inline-flex items-center gap-2">
                      <PenSquare className="size-4" />
                      수정
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </CardSpotlight>
        );
      })}
    </div>
  );
}
