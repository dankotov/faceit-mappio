import { PlayerMatchDetails } from "./player";

export interface FactionDetails {
  id: string;
  name: string;
  leader: string;
  roster: PlayerMatchDetails[];
}
