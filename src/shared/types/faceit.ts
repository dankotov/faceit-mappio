import { MatchDetails, MatchOverview } from "./match-details";
import { Me } from "./me";
import { VetoHistory } from "./veto";

export type Payload = Me | MatchDetails | MatchOverview[] | VetoHistory;

export interface FaceitWrappedData {
  code?: string;
  result?: string;
  payload: Payload;
}
