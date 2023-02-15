import { MapCodename } from "./csgo-maps";

interface LifetimeBaseStats {
  "Total Headshots %": string;
  Wins: string;
  "Average K/D Ratio": string;
  "Average Headshots %": string;
  "K/D Ratio": string;
  "Win Rate %": string;
  Matches: string;
}

export interface LifetimeGeneralStats extends LifetimeBaseStats {
  "Current Win Streak": string;
  "Longest Win Streak": string;
  "Recent Results": string[];
}

export interface LifetimeSegmentStats extends LifetimeBaseStats {
  Rounds: string;
  Headshots: string;
  Kills: string;
  Deaths: string;
  Assists: string;
  MVPs: string;
  "Triple Kills": string;
  "Quadro Kills": string;
  "Penta Kills": string;
  "K/R Ratio": string;
  "Average Kills": string;
  "Average Deaths": string;
  "Average Assists": string;
  "Average MVPs": string;
  "Average Triple Kills": string;
  "Average Quadro Kills": string;
  "Average Penta Kills": string;
  "Average K/R Ratio": string;
  "Headshots per Match": string;
}

export interface SegmentStats {
  type: string;
  mode: string;
  label: string;
  img_small: string;
  img_regular: string;
  stats: LifetimeSegmentStats;
}

export interface Stats {
  games: string;
  kd: string;
  kr: string;
  wr: string;
}

export type MapStats = Map<MapCodename, Stats>;
