// eslint-disable-next-line import/no-unresolved
import mem from "mem";
import {
  CACHE_TIME,
  FACEIT_API_BASE_URL,
  FACEIT_API_BEARER_TOKEN,
  FACEIT_OPEN_BASE_URL,
} from "../../shared/consts";
import { isRelevantMapStat } from "./utils";

type Player = {
  id: string;
  nickname: string;
};

/**
 * Checks whether an authentication header is required for a request to a given API
 */
const isAuthRequired = (apiBaseUrl: string): boolean =>
  apiBaseUrl === FACEIT_OPEN_BASE_URL;

/**
 * Returns response from `baseUrl` + `requestPath`.
 */
const fetchFaceitApi = async (baseUrl: string, requestPath: string) => {
  const authRequired = isAuthRequired(baseUrl);
  const headers = {
    "Content-Type": "application/json",
    ...(authRequired && { Authorization: `Bearer ${FACEIT_API_BEARER_TOKEN}` }), // conditional auth header
  };
  const response = await fetch(baseUrl + requestPath, {
    method: "GET",
    headers,
  });
  const json = await response.json();
  return json;
};

// Memoized base fetch method
const memFetchFaceitApi = mem(fetchFaceitApi, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

/**
 * Fetches match details for the match by the `matchId`.
 *
 * @param {string} [matchId] The match's FACEIT ID.
 * @returns {Object} Match details of matchId.
 */
export const fetchMatchDetails = async (matchId: string) =>
  memFetchFaceitApi(FACEIT_OPEN_BASE_URL, `/data/v4/matches/${matchId}`);

/**
 * Fetches a player's details by the `playerId`
 *
 * @param {string} [playerId] A player's FACEIT ID.
 * @returns {Object} Player details of `playerId`.
 */
export const fetchPlayerStats = async (playerId: string) =>
  memFetchFaceitApi(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/stats/csgo`
  );

/**
 * Fetches a 100 matches of `playerId` offset by `pageNum` times 100.
 *
 * @param {string} [playerId] A player's FACEIT ID.
 * @param {number} [pageNum] Request page offset.
 * @returns {Object} Object containing information of a 100 matches of `playerId` offset by `pageNum` times 100.
 */
const fetchPlayerMatches = async (playerId: string, pageNum: number) =>
  memFetchFaceitApi(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/history?game=csgo&limit=100&offset=${
      pageNum * 100
    }`
  );

/**
 * Fetches a match's veto details by `matchId`.
 *
 * @param {string} [matchId] The match's FACEIT ID.
 * @returns {Object} Object containing information of the veto process of `matchId`.
 */
export const fetchMatchVetoDetails = async (matchId: string) =>
  memFetchFaceitApi(
    FACEIT_API_BASE_URL,
    `/democracy/v1/match/${matchId}/history`,
    false
  );

/**
 * Extracts the match players nicknames and ids from the match details object.
 *
 * @param {Object} [matchDetails] The match details object.
 * @returns {Array.<{nickname: string, id: string}>} Array of objects containing each players nickname and id.s
 */
const getMatchPlayersFromMatchDetails = (matchDetails: any) => {
  const matchTeams: any[] = Object.values(matchDetails.teams);
  const players: Player[] = [];
  matchTeams.forEach((team) => {
    team.roster.forEach((player: any) => {
      players.push({
        nickname: player.nickname,
        id: player.player_id,
      });
    });
  });

  return players;
};

/**
 * Extracts the match captain players ids from the match details object.
 *
 * @param {Object} [matchDetails] The match details object.
 * @returns {Array.<string>} Array of 2 elements where each element is a string id of a captain player.
 */
const getCaptainsIdsFromMatchDetails = (matchDetails: any) => [
  matchDetails.teams.faction1.leader,
  matchDetails.teams.faction2.leader,
];

/**
 * Gets the match captain players ids by the FACEIT match id.
 *
 * @param {string} matchId. The match's FACEIT ID.
 * @returns {Array.<string>} Array of 2 elements where each element is a string id of a captain player.
 */
export const getCaptainsIdsFromMatchId = async (matchId: string) => {
  const md = await fetchMatchDetails(matchId);
  return getCaptainsIdsFromMatchDetails(md);
};

/**
 * Map where keys are CSGO map codenames and values are a player's stats for those maps.
 * @typedef {Map.<string,{ games:string, kd:string, kr:string, wr:string }>} playerMapStats
 */

/**
 * Fetches and organizes player stat data fetched from the FACEIT API.
 *
 * @param {string} [playerId] Player's ID.
 * @returns {playerMapStats} Map where keys are CSGO map codenames and values are objects with player's stats for those maps.
 */
const fetchPlayerMapStats = async (playerId: string) => {
  const playerRawStats = await fetchPlayerStats(playerId);
  // extract stats of intereset for each map of active map pool from fetched player details
  const playerMapStats = new Map([]);
  playerRawStats.segments.filter(isRelevantMapStat).forEach((map: any) => {
    const mapData = {
      games: map.stats.Matches,
      kd: map.stats["Average K/D Ratio"],
      kr: map.stats["Average K/R Ratio"],
      wr: map.stats["Win Rate %"],
    };
    playerMapStats.set(map.label, mapData);
  });

  return playerMapStats;
};

/**
 * Takes a player object and adds map stats to it.
 *
 * @param {{nickname: string, id: string}} [player] Object with player information.
 * @returns {{nickname: string, id: string, maps: playerMapStats}} Object with player nickname, id and map stats.
 */
const addPlayerMapStats = async (player: Player) => {
  const playerMapStats = await fetchPlayerMapStats(player.id);
  return { ...player, maps: playerMapStats };
};

/**
 * Fetches all matchroom's players' nickname, id and map stats.
 *
 * @param {string} [matchId] The match's FACEIT ID.
 * @returns {Array.<{nickname: string, id: string, maps: playerMapStats}>} Array of player objects containing each player's nickname, id and maps/
 */
const fetchAllMatchPlayersMapStats = async (matchId: string) => {
  const matchDetails = await fetchMatchDetails(matchId);
  const players = getMatchPlayersFromMatchDetails(matchDetails);

  const playersMapStatsPromises = players.map(async (player) =>
    addPlayerMapStats(player)
  );
  const allMatchPlayersMapStats = await Promise.all(playersMapStatsPromises);

  return allMatchPlayersMapStats;
};

// Memoized fetch all players' details method
export const memFetchAllMatchPlayersMapStats = mem(
  fetchAllMatchPlayersMapStats,
  {
    maxAge: CACHE_TIME,
  }
);

/**
 * Fetches and organizes a list of a player's last 300 matches.
 *
 * @param {string} [playerId] The player's FACEIT ID.
 * @returns {Array.<Object>} Array of objects with information about the player's last 300 matches.
 */
export const fetchPlayerMatchList = async (playerId: string) => {
  const pageNums = [...Array(3).keys()];
  const matchPromises = pageNums.map(async (pageNum) =>
    fetchPlayerMatches(playerId, pageNum)
  );
  const matches = (await Promise.all(matchPromises)).reduce(
    (acc, curr) => acc.concat(curr.items),
    []
  );
  return matches;
};
