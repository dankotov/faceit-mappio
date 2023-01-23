// eslint-disable-next-line import/no-unresolved
import pMemoize from "p-memoize";
import {
  CACHE_TIME,
  FACEIT_API_BASE_URL,
  FACEIT_API_BEARER_TOKEN,
  FACEIT_OPEN_BASE_URL,
} from "./consts";
import { isRelevantMapStat } from "./utils";

const fetchFaceitApi = async (baseUrl, requestPath, auth = true) => {
  console.log("API call:", baseUrl + requestPath);
  const headers = {
    "Content-Type": "application/json",
  };
  if (auth) headers.Authorization = `Bearer ${FACEIT_API_BEARER_TOKEN}`;
  const response = await fetch(baseUrl + requestPath, {
    method: "GET",
    headers,
  });
  const json = await response.json();
  return json;
};

const fetchFaceitApiMemoized = pMemoize(fetchFaceitApi, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

export const fetchMatchDetails = async (matchroomId) =>
  fetchFaceitApiMemoized(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/matches/${matchroomId}`
  );

const getPlayers = (matchDetails) => {
  const players = {};
  Object.values(matchDetails.teams).forEach((team) => {
    team.roster.forEach((player) => {
      players[player.nickname] = { id: player.player_id, maps: new Map([]) };
    });
  });

  return players;
};

const getCaptainsIds = (matchDetails) => [
  matchDetails.teams.faction1.leader,
  matchDetails.teams.faction2.leader,
];

const aggregatePlayerStats = async (nickname, playerId) => {
  const playerStats = await fetchFaceitApiMemoized(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/stats/csgo`
  );
  const stats = { nickname, id: playerId, maps: new Map([]) };
  playerStats.segments.filter(isRelevantMapStat).forEach((map) => {
    const data = {
      games: map.stats.Matches,
      kd: map.stats["Average K/D Ratio"],
      wr: map.stats["Win Rate %"],
    };
    stats.maps.set(map.label, data);
  });
  return stats;
};

const fetchPlayerDetails = async (matchroomId) => {
  const matchDetails = await fetchMatchDetails(matchroomId);
  const players = getPlayers(matchDetails);

  const playerStatsPromises = Object.keys(players).map(async (nickname) =>
    aggregatePlayerStats(nickname, players[nickname].id)
  );
  const playerStats = await Promise.all(playerStatsPromises);
  playerStats.forEach((playerStat) => {
    players[playerStat.nickname].maps = playerStat.maps;
  });

  return players;
};

export const fetchMemoizedPlayerDetails = pMemoize(fetchPlayerDetails, {
  maxAge: CACHE_TIME,
});

const getPlayerMatches = async (playerId, i) => {
  const m = await fetchFaceitApiMemoized(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/history?game=csgo&limit=100&offset=${i * 100}`
  );
  return m;
};

export const fetchPlayerMatchList = async (playerId) => {
  const increments = [...Array(3).keys()];
  const matchPromises = increments.map(async (increment) =>
    getPlayerMatches(playerId, increment)
  );
  const matches = (await Promise.all(matchPromises)).reduce(
    (acc, curr) => acc.concat(curr.items),
    []
  );
  return matches;
};

export const fetchMatchVetoDetails = async (matchroomId) =>
  fetchFaceitApiMemoized(
    FACEIT_API_BASE_URL,
    `/democracy/v1/match/${matchroomId}/history`,
    false
  );

export const getCaptains = async (matchroomId) => {
  const md = await fetchMatchDetails(matchroomId);
  const captains = getCaptainsIds(md);

  return captains;
};
