interface MatchScore {
  faction1: number;
  faction2: number;
}

export interface MatchResults {
  winner: string;
  score: MatchScore;
}
