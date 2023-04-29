import { MapCodename } from "./csgo-maps";

export interface Stats {
  games: string;
  kd: string;
}

export type MapStats = Map<MapCodename, Stats>;

export interface DropStats {
  drop: number;
  opportunities: number;
}

export type MapDropStats = Map<MapCodename, DropStats>;

interface SegmentId {
  game: string;
  gameMode: string;
  segmentId: string;
  playerId: string;
}

interface SegmentStats {
  [key: string]: {
    m1: string; // matches
    k5: string; // avg kd
  };
}
export interface Segment {
  segments: SegmentStats;
  _id: SegmentId;
}
