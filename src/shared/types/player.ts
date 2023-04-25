import { MapStats, Segment } from "./stats";

export interface Player {
  player_id: string;
  nickname: string;
}

export interface PlayerMapStats extends Player {
  maps: MapStats;
}

export interface PlayerMatchDetails {
  id: string;
  nickname: string;
}

export interface PlayerGameStats {
  segments: Segment[];
}
