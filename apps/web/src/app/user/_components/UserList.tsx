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
    <div className="grid gap-3">
      {users.map((user) => (
        <Card key={user.id} className="relative overflow-hidden border border-[#dad4c8] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#ecabb0] hover:shadow-[var(--shadow-clay)]">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-12 border-2 border-white shadow-sm ring-1 ring-[#dad4c8]">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-[#f0cb7e]/20 text-[#6f4600] font-[600]">{user.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-[16px] font-[600] tracking-[-0.02em] text-[#101010]">{user.name}</p>
                <p className="text-[13px] text-[#9f9b93]">{user.email}</p>
                <p className="text-[12px] text-muted-foreground">
                  입사일 {user.joinDate} / {getEmploymentStatusLabel(user.employmentStatus)}
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <Badge variant="outline" className="border-[#dad4c8] text-[#55534e] px-2.5">{departments.find((department) => department.id === user.departmentId)?.name}</Badge>
              <Badge variant="secondary" className="bg-[#faf9f7] text-[#101010] hover:bg-[#f4f4f5] px-2.5">{teams.find((team) => team.id === user.primaryTeamId)?.name}</Badge>
              <Badge className="clay-swatch-ube border-[#bba7f6]/50 text-[#43089f] px-2.5 tracking-tight">{getRoleLabel(user.role)}</Badge>
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
