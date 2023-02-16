import { PlayerMatchDetails } from "./player";

export interface Faction {
  faction_id: string;
  leader: string;
  name: string;
  avatar: string;
  substituted: boolean;
  type: string;
  roster: PlayerMatchDetails[];
}
