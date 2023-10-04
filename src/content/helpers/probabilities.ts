import { Beta } from "@stdlib/stats-base-dists-beta";
import mem from "mem";
import {
  ACTIVE_MAP_POOL,
  CACHE_TIME,
  EMPTY_MAP_DROP_STATS,
} from "../../shared/consts";
import { MapCodename } from "../../shared/types/csgo-maps";
import { MatchOverview } from "../../shared/types/match-details";
import { MapDropProbability } from "../../shared/types/probabilities";
import { MapDropStats } from "../../shared/types/stats";
import { VetoHistory } from "../../shared/types/veto";
import {
  fetchPlayerCaptainMatchList,
  getPlayerMatchVetoDetails,
} from "./faceit-api";

/**
 * Gets a player's map drop statistics - how many times did the player had the opportunity to drop a map
 * and how many times did they actually drop it.
 */
const getPlayerMapDropStats = (
  vetos: {
    playerFaction: string | null;
    veto: VetoHistory | null;
  }[]
) => {
  const mapDropStats: MapDropStats = new Map();
  vetos.forEach(({ playerFaction, veto }) => {
    // if veto fetch was corrupt -> dont process this match
    if (!playerFaction || !veto) return;

    let opportunityCount = 0;
    const mapVeto = veto.tickets.find((ticket) => ticket.entity_type === "map");
    mapVeto?.entities.forEach((action) => {
      // if opponent had the first move -> dont change anything
      if (action.selected_by !== playerFaction && action.round === 1) return;

      // increase opportunity to drop count each veto round
      opportunityCount += 1;

      const currMapCodename = action.guid as MapCodename;
      const currMapDropStats =
        mapDropStats.get(currMapCodename) || EMPTY_MAP_DROP_STATS;

      // assume player dropped the current map -> add 1 to the map drop count
      let dropIncrement = 1;
      if (
        action.selected_by !== playerFaction || // opponent move
        action.random || // timeout random drop
        action.status !== "drop" // the action is not drop (i.e. 'pick' or other unknown)
      ) {
        // player did not drop the map -> set drop increment to 0 to leave drop count the same
        dropIncrement = 0;
      }

      // update map drop stats
      mapDropStats.set(currMapCodename, {
        drop: currMapDropStats.drop + dropIncrement,
        opportunities: currMapDropStats.opportunities + opportunityCount,
      });
    });
  });

  return mapDropStats;
};

/**
 * Calculates a player's map drop probabilities from their map drop statistics.
 */
const calculateMapDropProbabilities = (mapDropStats: MapDropStats) => {
  const alpha = 2; // alpha offset
  const beta = 2; // beta offset
  const probabilities: MapDropProbability[] = [];
  mapDropStats.forEach(({ drop, opportunities }, mapCodename) => {
    // if map is not in active map pool -> discard it
    if (!ACTIVE_MAP_POOL.has(mapCodename)) return;
    // calc probability with beta distribution
    const p = new Beta(drop + alpha, opportunities - drop + beta);
    probabilities.push({ mapCodename, probability: p.mean });
  });
  const sumOfProbabilities = probabilities.reduce(
    (acc, mapInfo) => acc + mapInfo.probability,
    0
  );
  // normalize probabilities so sum = 100
  const normalizedProbabilities = probabilities.map(
    ({ mapCodename, probability }) => {
      const normalizedProbability = Math.round(
        ((probability / sumOfProbabilities) * 1000) / 10
      );
      return { mapCodename, probability: normalizedProbability };
    }
  );
  return normalizedProbabilities;
};

/**
 * Gets a `playerId`'s active map pool map drop probabilities.
 */
const getPlayerMapDropProbabilties = async (
  playerId: string
): Promise<[number, MapDropProbability[]]> => {
  const captainMatches = await fetchPlayerCaptainMatchList(playerId);
  const vetoPromises = captainMatches.map(async (match: MatchOverview) =>
    getPlayerMatchVetoDetails(match, playerId)
  );
  const vetos = await Promise.all(vetoPromises);
  const mapDropStats = getPlayerMapDropStats(vetos);

  const probabilities = calculateMapDropProbabilities(mapDropStats);

  return [captainMatches.length, probabilities];
};

const memGetPlayerMapDropProbabilities = mem(getPlayerMapDropProbabilties, {
  maxAge: CACHE_TIME,
});

export default memGetPlayerMapDropProbabilities;
