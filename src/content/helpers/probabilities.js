import Beta from "@stdlib/stats-base-dists-beta-ctor";
import { ACTIVE_MAP_POOL } from "./consts";
import { fetchMatchVetoDetails, fetchPlayerMatchList } from "./faceit-api";

const getMatchVetoDetails = async (match, playerId) => {
  const faction =
    match.teams.faction1.team_id === playerId ? "faction1" : "faction2";
  const veto = await fetchMatchVetoDetails(match.match_id);

  return { faction, veto };
};

export default async (playerId) => {
  console.time(`Fetching matches ${playerId}`);
  const matches = await fetchPlayerMatchList(playerId);
  console.timeEnd(`Fetching matches ${playerId}`);
  const captainMatches = matches.filter((match) => {
    if (
      match.teams.faction1.team_id !== playerId &&
      match.teams.faction2.team_id !== playerId
    )
      return false;

    if (match.game_mode !== "5v5") return false;
    if (match.competition_name !== "5v5 RANKED") return false;
    if (match.competition_type !== "matchmaking") return false;
    if (match.status !== "finished") return false;

    return true;
  });

  const vetoPromises = captainMatches.map(async (match) =>
    getMatchVetoDetails(match, playerId)
  );
  const vetos = await Promise.all(vetoPromises);

  const dropMap = new Map();
  vetos.forEach(({ faction, veto }) => {
    if ("errors" in veto) return;

    let vetoOrder = 0;
    veto.payload.tickets[1].entities.forEach((action) => {
      // if opponent had the first move -> dont change anything
      if (action.selected_by !== faction && vetoOrder === 1) return;

      vetoOrder += 1;

      const current = dropMap.get(action.guid) || {
        drop: 0,
        opportunities: 0,
      };

      if (
        action.selected_by !== faction || // opponent move
        action.random || // timeout random drop
        action.status !== "drop" // the action is not drop (i.e. 'pick' or other unknown)
      ) {
        dropMap.set(action.guid, {
          drop: current.drop,
          opportunities: current.opportunities + vetoOrder,
        });
      } else {
        // player dropped the map
        dropMap.set(action.guid, {
          drop: current.drop + 1,
          opportunities: current.opportunities + vetoOrder,
        });
      }
    });
  });

  const alpha = 2;
  const beta = 2;
  const probabilities = [];
  dropMap.forEach(({ drop, opportunities }, mapName) => {
    if (!ACTIVE_MAP_POOL.has(mapName)) return;

    const pBayes = new Beta(drop + alpha, opportunities - drop + beta);
    probabilities.push({ mapName, probability: pBayes.mean });
  });
  const sumOfProbabilities = probabilities.reduce(
    (acc, mapInfo) => acc + mapInfo.probability,
    0
  );
  const normalizedProbabilities = probabilities.map(
    ({ mapName, probability }) => {
      const normalizedProbability =
        Math.round((probability / sumOfProbabilities) * 1000) / 10;
      return { mapName, probability: normalizedProbability };
    }
  );

  return { id: playerId, probabilities: normalizedProbabilities };
};
