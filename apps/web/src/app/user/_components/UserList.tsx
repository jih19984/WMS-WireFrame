import { Link } from "react-router-dom";
import { departments, teams } from "@/app/_common/service/mock-db";
import type { UserProfile } from "@/app/user/_types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UserList({ users }: { users: UserProfile[] }) {
  return (
    <div className="grid gap-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="hidden gap-2 md:flex">
              <Badge variant="outline">{departments.find((department) => department.id === user.departmentId)?.name}</Badge>
              <Badge variant="secondary">{teams.find((team) => team.id === user.primaryTeamId)?.name}</Badge>
              <Badge>{user.role}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Link to={`/user/detail/${user.id}`}>상세</Link>
              </Button>
              <Button variant="outline">
                <Link to={`/user/edit/${user.id}`}>수정</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
