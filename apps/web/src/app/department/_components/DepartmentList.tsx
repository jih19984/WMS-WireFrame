import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { users } from "@/app/_common/service/mock-db";
import type { Department } from "@/app/department/_types/department.types";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { formatDate } from "@/lib/utils";

export function DepartmentList({
  departments,
  readOnly: _readOnly = false,
}: {
  departments: Department[];
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {departments.map((department) => {
        const leader = users.find((user) => user.id === department.leaderId);
        return (
          <Link
            key={department.id}
            to={`/department/detail/${department.id}`}
            className="block h-full rounded-[24px] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <CardSpotlight className="h-full cursor-pointer rounded-[24px] transition-all duration-300 hover:-translate-y-1">
              <CardContent className="flex h-full min-h-[17rem] flex-col gap-5 p-6">
                <div className="grid min-h-[6.75rem] grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-muted/40 text-muted-foreground transition-colors group-hover/card-spotlight:border-primary/30 group-hover/card-spotlight:bg-primary/8 group-hover/card-spotlight:text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base font-semibold text-foreground transition-colors group-hover/card-spotlight:text-primary">
                      {department.name}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2 h-12 text-sm leading-6">
                      {department.description || "부서 설명이 없습니다."}
                    </CardDescription>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Info label="사업부장" value={leader?.name ?? "미지정"} />
                  <Info label="생성일" value={formatDate(department.createdAt)} />
                </div>
              </CardContent>
            </CardSpotlight>
          </Link>
        );
      })}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 transition-colors group-hover/card-spotlight:border-primary/20 group-hover/card-spotlight:bg-muted/45">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
