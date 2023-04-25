import { FactionDetails } from "./match-faction";

export interface MatchOverview {
  matchId: string;
  type: string;
  game: string;
  state: string;
  competition: {
    name: string;
    type: string;
  };
  organizer: {
    id: string;
  };
  teams: {
    faction1: FactionDetails;
    faction2: FactionDetails;
  };
}

export interface MatchDetails {
  teams: {
    faction1: FactionDetails;
    faction2: FactionDetails;
  };
}
