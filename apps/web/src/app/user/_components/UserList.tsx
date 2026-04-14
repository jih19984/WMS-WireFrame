import { Link } from "react-router-dom";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserProfile } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEmploymentStatusLabel, getRoleLabel } from "@/lib/utils";

export function UserList({ users, readOnly = false }: { users: UserProfile[]; readOnly?: boolean }) {
  return (
    <div className="workspace-list">
      {users.map((user) => (
        <Card
          key={user.id}
          className="relative overflow-hidden border-white/8 transition-all hover:-translate-y-0.5 hover:border-white/14"
        >
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 ring-1 ring-white/8">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-primary/18 text-primary font-[600]">
                  {user.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-[16px] font-[600] tracking-[-0.02em] text-foreground">{user.name}</p>
                <p className="text-[13px] text-muted-foreground">{user.email}</p>
                <p className="text-[12px] text-muted-foreground">
                  입사일 {user.joinDate} / {getEmploymentStatusLabel(user.employmentStatus)}
                </p>
              </div>
            </div>
            <div className="hidden flex-wrap items-center gap-2 md:flex">
              <Badge variant="outline" className="px-2.5">{departments.find((department) => department.id === user.departmentId)?.name}</Badge>
              <Badge variant="secondary" className="px-2.5">{teams.find((team) => team.id === user.primaryTeamId)?.name}</Badge>
              <Badge variant="default" className="px-2.5 tracking-tight">{getRoleLabel(user.role)}</Badge>
              <Badge variant={user.employmentStatus === "ACTIVE" ? "success" : user.employmentStatus === "LEAVE" ? "warning" : "outline"}>
                {getEmploymentStatusLabel(user.employmentStatus)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to={`/user/detail/${user.id}`}>상세</Link>
              </Button>
              {!readOnly && (
                <Button variant="outline" asChild>
                  <Link to={`/user/edit/${user.id}`}>수정</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
