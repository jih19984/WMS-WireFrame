import { useState } from "react";
import { worklogs } from "@/app/_common/service/mock-db";
import type { Team } from "@/app/team/_types/team.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMemberList } from "@/app/team/_components/TeamMemberList";

export function TeamDetail({ team }: { team: Team }) {
  const [tab, setTab] = useState("members");
  const teamWorklogs = worklogs.filter((worklog) => worklog.teamId === team.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.description}</CardDescription>
          </div>
          <Badge variant={team.status === "ACTIVE" ? "success" : "outline"}>{team.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">시작일</p>
            <p className="mt-1 font-medium">{team.startDate}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">종료 예정일</p>
            <p className="mt-1 font-medium">{team.endDate}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p className="text-muted-foreground">업무 수</p>
            <p className="mt-1 font-medium">{teamWorklogs.length}건</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="members">멤버</TabsTrigger>
            <TabsTrigger value="worklogs">업무</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="pt-4">
            <TeamMemberList memberIds={team.members} />
          </TabsContent>
          <TabsContent value="worklogs" className="space-y-3 pt-4">
            {teamWorklogs.map((worklog) => (
              <div key={worklog.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{worklog.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{worklog.aiSummary}</p>
                  </div>
                  <Badge>{worklog.status}</Badge>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
