import { LifetimeGeneralStats, MapStats, SegmentStats } from "./stats";

export interface Player {
  player_id: string;
  nickname: string;
}

export interface PlayerMapStats extends Player {
  maps: MapStats;
}

interface BasePlayerMatchInfo extends Player {
  avatar: string;
  game_player_id: string;
  game_player_name: string;
}

export interface PlayerMatchDetails extends BasePlayerMatchInfo {
  membership: string;
  anticheat_required: boolean;
}

export interface PlayerMatchOverview extends BasePlayerMatchInfo {
  skill_level: number;
  faceit_url: string;
}

export interface PlayerGameStats {
  player_id: string;
  game_id: string;
  lifetime: LifetimeGeneralStats;
  segments: SegmentStats[];
}
