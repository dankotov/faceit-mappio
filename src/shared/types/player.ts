import { LifetimeGeneralStats, MapStats, SegmentStats } from "./stats";

export interface Player {
  player_id: string;
  nickname: string;
}

export interface PlayerMapStats extends Player {
  maps: MapStats;
}

export interface PlayerMatchDetails extends Player {
  avatar: string;
  membership: string;
  game_player_id: string;
  game_player_name: string;
  anticheat_required: boolean;
}

export interface PlayerGameStats {
  player_id: string;
  game_id: string;
  lifetime: LifetimeGeneralStats;
  segments: SegmentStats[];
}
