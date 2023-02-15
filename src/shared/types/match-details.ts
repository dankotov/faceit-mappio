import { MatchResults } from "./match-results";
import { MatchTeams } from "./match-teams";
import { MatchVoting } from "./match-voting";

export interface MatchDetails {
  match_id: string;
  version: number;
  game: string;
  region: string;
  competition_id: string;
  competition_type: string;
  competition_name: string;
  organizer_id: string;
  calculate_elo: boolean;
  configured_at: number;
  started_at: number;
  finished_at: number;
  chat_room_id: string;
  best_of: number;
  status: string;
  faceit_url: string;
  results: MatchResults;
  demo_url: string[];
  voting: MatchVoting;
  teams: MatchTeams;
}
