import pMemoize from "p-memoize";
import { faceitApiBaseURL, faceitApiBearerToken } from "./consts";
import { isRelevantMapStat } from "./utils";

const fetchFaceitApi = async (requestPath) => {
  console.log("called api", requestPath);
  const response = await fetch(faceitApiBaseURL + requestPath, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${faceitApiBearerToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  return json;
};

const fetchFaceitApiMemoized = pMemoize(fetchFaceitApi);

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

  console.log(players);
  return players;
};

export const fetchMemoizedPlayerDetails = pMemoize(fetchPlayerDetails);
