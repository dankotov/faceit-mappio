import { FactionDetails, FactionOverview } from "./match-faction";
import { MatchResults } from "./match-results";
import { MatchVoting } from "./match-voting";

interface BaseMatchDetails {
  match_id: string;
  region: string;
  competition_id: string;
  competition_type: string;
  competition_name: string;
  organizer_id: string;
  started_at: number;
  finished_at: number;
  results: MatchResults;
  faceit_url: string;
  status: string;
}

export interface MatchDetails extends BaseMatchDetails {
  game: string;
  version: number;
  calculate_elo: boolean;
  configured_at: number;
  chat_room_id: string;
  best_of: number;
  demo_url: string[];
  voting: MatchVoting;
  teams: {
    faction1: FactionDetails;
    faction2: FactionDetails;
  };
}

export interface MatchOverview extends BaseMatchDetails {
  game_id: string;
  match_type: string;
  game_mode: string;
  max_players: number;
  teams_size: number;
  teams: {
    faction1: FactionOverview;
    faction2: FactionOverview;
  };
  playing_players: string[];
}
