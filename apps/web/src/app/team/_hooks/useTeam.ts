import { useEffect, useState } from "react";
import { teamService } from "@/app/team/_service/team.service";
import type { Team } from "@/app/team/_types/team.types";

export function useTeam() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    teamService.list().then(setTeams);
  }, []);

  return {
    teams,
    refresh: async () => setTeams(await teamService.list()),
  };
}
