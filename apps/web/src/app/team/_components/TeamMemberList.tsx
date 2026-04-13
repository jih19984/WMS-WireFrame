import { users } from "@/app/_common/service/mock-db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TeamMemberList({ memberIds }: { memberIds: number[] }) {
  const members = users.filter((user) => memberIds.includes(user.id));

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.profileImage} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.title}</p>
            </div>
          </div>
          <Badge variant="outline">{member.position}</Badge>
        </div>
      ))}
    </div>
  );
}
