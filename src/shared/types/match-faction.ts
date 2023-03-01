import { PlayerMatchDetails, PlayerMatchOverview } from "./player";

interface BaseFaction {
  avatar: string;
  type: string;
}

export interface FactionDetails extends BaseFaction {
  faction_id: string;
  name: string;
  leader: string;
  substituted: boolean;
  roster: PlayerMatchDetails[];
}

export interface FactionOverview extends BaseFaction {
  team_id: string;
  nickname: string;
  players: PlayerMatchOverview[];
}
