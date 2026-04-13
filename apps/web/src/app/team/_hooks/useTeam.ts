import { useEffect, useState } from "react";
import { getVisibleTeams } from "@/app/_common/service/access-control";
import { useAuth } from "@/app/_common/hooks/useAuth";
import { subscribeMockDb } from "@/app/_common/service/mock-db";
import { teamService } from "@/app/team/_service/team.service";
import type { Team } from "@/app/team/_types/team.types";

export function useTeam() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const sync = async () => {
      const items = await teamService.list();
      setTeams(getVisibleTeams(user, items));
    };

    void sync();
    return subscribeMockDb(() => {
      void sync();
    });
  }, [user]);

  return {
    teams,
    refresh: async () => setTeams(getVisibleTeams(user, await teamService.list())),
  };
}
