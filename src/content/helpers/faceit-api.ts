// eslint-disable-next-line import/no-unresolved
import mem from "mem";
import { CACHE_TIME, FACEIT_OPEN_BASE_URL } from "../../shared/consts";
import { FACEIT_API_BEARER_TOKEN } from "../../shared/secrets";
import { MapCodename } from "../../shared/types/csgo-maps";
import { MatchDetails } from "../../shared/types/match-details";
import { Faction } from "../../shared/types/match-faction";
import {
  Player,
  PlayerGameStats,
  PlayerMapStats,
} from "../../shared/types/player";
import { MapStats, Stats } from "../../shared/types/stats";
import { isRelevantMapStat } from "./utils";

/**
 * Returns response from `baseUrl` + `requestPath`.
 */
const fetchFaceitApi = async (baseUrl: string, requestPath: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FACEIT_API_BEARER_TOKEN}`,
  };
  const response = await fetch(baseUrl + requestPath, {
    method: "GET",
    headers,
  });
  const json = await response.json();
  return json;
};

/**
 * Returns a memoized response from `baseUrl` + `requestPath`.
 */
const memFetchFaceitApi = mem(fetchFaceitApi, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

/**
 * Fetches match details by `matchId`.
 */
export const fetchMatchDetails = async (
  matchId: string
): Promise<MatchDetails> =>
  memFetchFaceitApi(FACEIT_OPEN_BASE_URL, `/data/v4/matches/${matchId}`);

/**
 * Fetches player details by `playerId`
 */
export const fetchPlayerStats = async (
  playerId: string
): Promise<PlayerGameStats> =>
  memFetchFaceitApi(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/stats/csgo`
  );

/**
 * Extracts a list of the match players' nicknames and ids from the match details object.
 */
const getMatchPlayersFromMatchDetails = (matchDetails: MatchDetails) => {
  const matchFactions: Faction[] = Object.values(matchDetails.teams);

  const players: Player[] = [];

  matchFactions.forEach((faction) => {
    faction.roster.forEach((playerDetails) => {
      const player: Player = {
        player_id: playerDetails.player_id,
        nickname: playerDetails.nickname,
      };
      players.push(player);
    });
  });

  return players;
};

/**
 * Extracts a list of the match captain players ids from the match details object.
 */
const getCaptainsIdsFromMatchDetails = (matchDetails: MatchDetails) => [
  matchDetails.teams.faction1.leader,
  matchDetails.teams.faction2.leader,
];

/**
 * Gets a list of the match captain players ids by the FACEIT match id.
 */
export const getCaptainsIdsFromMatchId = async (matchId: string) => {
  const md = await fetchMatchDetails(matchId);
  return getCaptainsIdsFromMatchDetails(md);
};

/**
 * Fetches and organizes player stat data fetched from the FACEIT API.
 */
const fetchPlayerMapStats = async (playerId: string): Promise<MapStats> => {
  const playerRawStats = await fetchPlayerStats(playerId);
  // extract stats of intereset for each map of active map pool from fetched player details
  const playerMapStats: MapStats = new Map([]);
  playerRawStats.segments.filter(isRelevantMapStat).forEach((map) => {
    const mapData: Stats = {
      games: map.stats.Matches,
      kd: map.stats["Average K/D Ratio"],
      kr: map.stats["Average K/R Ratio"],
      wr: map.stats["Win Rate %"],
    };
    playerMapStats.set(map.label as MapCodename, mapData);
  });

  return playerMapStats;
};

/**
 * Takes a player object and adds map stats to it.
 */
const addPlayerMapStats = async (player: Player): Promise<PlayerMapStats> => {
  const playerMapStats = await fetchPlayerMapStats(player.player_id);
  return { ...player, maps: playerMapStats };
};

/**
 * Fetches a list of all match players' nicknames, ids and map stats.
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
