// eslint-disable-next-line import/no-unresolved
import pMemoize from "p-memoize";
import {
  CACHE_TIME,
  FACEIT_API_BASE_URL,
  FACEIT_API_BEARER_TOKEN,
  FACEIT_OPEN_BASE_URL,
} from "./consts";
import { isRelevantMapStat } from "./utils";

/**
 * Returns response from `baseUrl` + `requestPath`.
 *
 * @param {string} [baseUrl] The API's base url.
 * @param {string} [requestPath] The path of the desired resource.
 * @param {boolean} [authRequired] Whether an authorization header is required.
 * @returns {Object} Response from baseUrl + requestPath.
 */
const fetchFaceitApi = async (baseUrl, requestPath, authRequired = true) => {
  console.log("API call:", baseUrl + requestPath);
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
const fetchFaceitApiMemoized = pMemoize(fetchFaceitApi, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

/**
 * Fetches match details for the match by the `matchroomId`.
 *
 * @param {string} [matchroomId] The match's FACEIT ID.
 * @returns {Object} Match details of matchroomId.
 */
export const fetchMatchDetails = async (matchroomId) =>
  fetchFaceitApiMemoized(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/matches/${matchroomId}`
  );

/**
 * Fetches a player's details by the `playerId`
 *
 * @param {string} [playerId] A player's FACEIT ID.
 * @returns {Object} Player details of `playerId`.
 */
export const fetchPlayerStats = async (playerId) =>
  fetchFaceitApiMemoized(
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
const fetchPlayerMatches = async (playerId, pageNum) =>
  fetchFaceitApiMemoized(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/history?game=csgo&limit=100&offset=${
      pageNum * 100
    }`
  );

/**
 * Fetches a match's veto details by `matchroomId`.
 *
 * @param {string} [matchroomId] The match's FACEIT ID.
 * @returns {Object} Object containing information of the veto process of `matchroomId`.
 */
export const fetchMatchVetoDetails = async (matchroomId) =>
  fetchFaceitApiMemoized(
    FACEIT_API_BASE_URL,
    `/democracy/v1/match/${matchroomId}/history`,
    false
  );

/**
 * Returns an object with player nickname as a key and an object containing the player's id and an empty Map for map stats.
 *
 * @param {Object} [matchDetails] The match details object.
 * @returns {{nickname:{id:string,maps:Map.<string,{games:string,kd:string,wr:string}}}} Object with player nickname as a key and an object containing the player's id and an empty Map for map stats.
 */
const getMatchPlayersIdsFromMatchDetails = (matchDetails) => {
  const players = {};
  Object.values(matchDetails.teams).forEach((team) => {
    team.roster.forEach((player) => {
      players[player.nickname] = { id: player.player_id, maps: new Map([]) };
    });
  });

  return players;
};

/**
 * Returns an array of 2 elements where each element is a string id of a captain player.
 *
 * @param {Object} [matchDetails] The match details object.
 * @returns {Array.<string>} Array of 2 elements where each element is a string id of a captain player.
 */
const getCaptainsIdsFromMatchDetails = (matchDetails) => [
  matchDetails.teams.faction1.leader,
  matchDetails.teams.faction2.leader,
];

/**
 * Returns an array of 2 elements where each element is a string id of a captain player
 *
 * @param {string} matchroomId. The match's FACEIT ID.
 * @returns {Array.<string>} Array of 2 elements where each element is a string id of a captain player.
 */
export const getCaptainsIdsFromMatchroomId = async (matchroomId) => {
  const md = await fetchMatchDetails(matchroomId);
  return getCaptainsIdsFromMatchDetails(md);
};

/**
 * Fetches and organizes player stat data fetched from the FACEIT API.
 *
 * @param {string} [nickname] Player's nickname.
 * @param {string} [playerId] Player's ID.
 * @returns {{nickname:string, id:string, maps:Map.<string,{games:string,kd:string,wr:string}}} Object containing player nickname, id and map stats.
 */
const fetchPlayerMapStats = async (nickname, playerId) => {
  const playerDetails = await fetchPlayerStats(playerId);
  // extract stats of intereset for each map of active map pool from fetched player details
  const playerMapStats = new Map([]);
  playerDetails.segments.filter(isRelevantMapStat).forEach((map) => {
    const mapData = {
      games: map.stats.Matches,
      kd: map.stats["Average K/D Ratio"],
      wr: map.stats["Win Rate %"],
    };
    playerMapStats.set(map.label, mapData);
  });

  return { nickname, id: playerId, maps: playerMapStats };
};

/**
 * Fetches and organizes all matchroom's players' nickname, id and map stats
 *
 * @param {string} [matchroomId] The match's FACEIT ID.
 * @returns {{nickname:{id:string,maps:Map.<string,{games:string,kd:string,wr:string}}}} Object with player nicknames as keys and an object containing the player's id and map stats.
 */
const fetchAllMatchPlayersMapStats = async (matchroomId) => {
  const matchDetails = await fetchMatchDetails(matchroomId);
  const players = getMatchPlayersIdsFromMatchDetails(matchDetails);

  const playerStatsPromises = Object.keys(players).map(async (nickname) =>
    fetchPlayerMapStats(nickname, players[nickname].id)
  );
  const playerStats = await Promise.all(playerStatsPromises);
  playerStats.forEach((playerStat) => {
    players[playerStat.nickname].maps = playerStat.maps;
  });

  return players;
};

// Memoized fetch all players' details method
export const fetchMemoizedAllMatchPlayersMapStats = pMemoize(
  fetchAllMatchPlayersMapStats,
  {
    maxAge: CACHE_TIME,
  }
);

/**
 * Fetches and organizes a list of a player's last 300 matches
 *
 * @param {string} [playerId] The player's FACEIT ID.
 * @returns {Array.<Object>} Array of objects with information about the player's last 300 matches.
 */
export const aggregatePlayerMatchList = async (playerId) => {
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
