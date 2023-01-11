import pMemoize from "p-memoize";
import {
  CACHE_TIME,
  FACEIT_API_BASE_URL,
  FACEIT_API_BEARER_TOKEN,
} from "./consts";
import { isRelevantMapStat } from "./utils";

const fetchFaceitApi = async (requestPath) => {
  console.log("called api", requestPath);
  const response = await fetch(FACEIT_API_BASE_URL + requestPath, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${FACEIT_API_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  return json;
};

const fetchFaceitApiMemoized = pMemoize(fetchFaceitApi, { maxAge: CACHE_TIME });

const fetchMatchDetails = async (matchroomId) =>
  await fetchFaceitApiMemoized(`/data/v4/matches/${matchroomId}`);

const getPlayers = (matchDetails) => {
  const players = {};
  Object.values(matchDetails.teams).forEach((team) => {
    team.roster.forEach((player) => {
      players[player.nickname] = { id: player.player_id, maps: {} };
    });
  });

  return players;
};

const fetchPlayerDetails = async (matchroomId) => {
  const matchDetails = await fetchMatchDetails(matchroomId);
  const players = getPlayers(matchDetails);

  Object.keys(players).forEach(async (nickname) => {
    const playerStats = await fetchFaceitApiMemoized(
      `/data/v4/players/${players[nickname].id}/stats/csgo`
    );
    playerStats.segments.filter(isRelevantMapStat).forEach((map) => {
      const data = {
        games: map.stats["Matches"],
        kd: map.stats["Average K/D Ratio"],
        wr: map.stats["Win Rate %"],
      };
      players[nickname].maps[map.label] = data;
    });
  });

  // console.log(players);
  return players;
};

export const fetchMemoizedPlayerDetails = pMemoize(fetchPlayerDetails, {
  maxAge: CACHE_TIME,
});
