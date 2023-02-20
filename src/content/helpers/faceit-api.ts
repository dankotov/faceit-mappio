// eslint-disable-next-line import/no-unresolved
import mem from "mem";
import { getCookie } from "typescript-cookie";
import {
  CACHE_TIME,
  FACEIT_API_BASE_URL,
  FACEIT_OPEN_BASE_URL,
} from "../../shared/consts";
import { FACEIT_API_BEARER_TOKEN } from "../../shared/secrets";
import { MapCodename } from "../../shared/types/csgo-maps";
import { MatchDetails, MatchOverview } from "../../shared/types/match-details";
import { FactionDetails } from "../../shared/types/match-faction";
import { Me } from "../../shared/types/me";
import {
  Player,
  PlayerGameStats,
  PlayerMapStats,
} from "../../shared/types/player";
import { MapStats, Stats } from "../../shared/types/stats";
import { VetoHistory } from "../../shared/types/veto";
import { isRelevantMapStat } from "./utils";

/**
 * Returns the user's cached FACEIT production API auth token.
 */
const getLocalApiToken = () => {
  return getCookie("t") || localStorage.getItem("token");
};

/**
 * Returns the appropriate auth token for a FACEIT API.
 */
const getApiToken = (apiUrl: string) => {
  if (apiUrl === FACEIT_OPEN_BASE_URL) return FACEIT_API_BEARER_TOKEN;
  return getLocalApiToken();
};

/**
 * Returns response from `baseUrl` + `requestPath`.
 */
const fetchFaceitApi = async (baseUrl: string, requestPath: string) => {
  const token = getApiToken(baseUrl);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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
 * Fetches currently logged in user's details
 */
export const fetchMe = async (): Promise<Me> =>
  memFetchFaceitApi(FACEIT_API_BASE_URL, "/users/v1/sessions/me").then(
    (res) => res.payload
  );

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
  const matchFactions: FactionDetails[] = Object.values(matchDetails.teams);

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
 * Gets a list of the match players' nicknames and ids by the FACEIT match id.
 */
export const getMatchPlayersFromMatchId = async (matchId: string) => {
  const md = await fetchMatchDetails(matchId);
  return getMatchPlayersFromMatchDetails(md);
};

/**
 * Extracts a list of the maps that are on the voting list of the match from the match details object.
 */
const getMatchMapsFromMatchDetails = (matchDetails: MatchDetails) =>
  matchDetails.voting.map.entities.map((mapOption) => mapOption.game_map_id);

/**
 * Gets a list of the maps that are on the voting list of the match by the FACEIT match id.
 */
export const getMatchMapsFromMatchId = async (matchId: string) => {
  const md = await fetchMatchDetails(matchId);
  return getMatchMapsFromMatchDetails(md);
};

/**
 * Gets the opponent team captain's player ID from the match details object.
 * `playerId` must be a player of this match for the method to work as intended.
 */
const getOpponentCaptainIdFromMatchDetails = (
  matchDetails: MatchDetails,
  playerId: string
) => {
  const opponentCaptainId = matchDetails.teams.faction1.roster.some(
    (player) => player.player_id === playerId
  )
    ? matchDetails.teams.faction2.leader
    : matchDetails.teams.faction1.leader;

  return opponentCaptainId;
};

/**
 * Gets the opponent team captain's player ID by FACEIT match ID.
 * `playerId` must be a player of `matchId` for the method to work as intended.
 */
export const getOpponentCaptainIdFromMatchId = async (
  matchId: string,
  playerId: string
) => {
  const md = await fetchMatchDetails(matchId);
  return getOpponentCaptainIdFromMatchDetails(md, playerId);
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

/**
 * Fetches a 100 matches of playerId offset by pageNum times 100.
 */
export const fetchPlayerMatches = async (
  playerId: string,
  pageNum: number
): Promise<MatchOverview[]> =>
  memFetchFaceitApi(
    FACEIT_OPEN_BASE_URL,
    `/data/v4/players/${playerId}/history?game=csgo&limit=100&offset=${
      pageNum * 100
    }`
  ).then((res) => res.items);

/**
 * Fetches a list of a player's last 100 matches.
 */
const fetchPlayerMatchList = async (playerId: string) => {
  const pageNums = [...Array(1).keys()];
  const matchPromises = pageNums.map(async (pageNum) =>
    fetchPlayerMatches(playerId, pageNum)
  );
  const matches = await Promise.all(matchPromises);
  const list = matches.reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);
  return list;
};

/**
 * Checks whether the player with `playerId` was a team captain in `match`.
 */
const isCaptainMatch = (match: MatchOverview, playerId: string) => {
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
};

/**
 * Gets a list of a player's captain matches.
 */
export const fetchPlayerCaptainMatchList = async (playerId: string) => {
  const matches = await fetchPlayerMatchList(playerId);
  const captainMatches = matches.filter((match) =>
    isCaptainMatch(match, playerId)
  );
  return captainMatches;
};

/**
 * Gets the veto history of a match by match id.
 */
const fetchMatchVetoHistory = async (matchId: string): Promise<VetoHistory> =>
  memFetchFaceitApi(
    FACEIT_API_BASE_URL,
    `/democracy/v1/match/${matchId}/history`
  ).then((res) => res.payload);

/**
 * Gets a match's veto history and the `playerId`'s faction in that match.
 */
export const getPlayerMatchVetoDetails = async (
  match: MatchOverview,
  playerId: string
): Promise<{ playerFaction: string; veto: VetoHistory }> => {
  const playerFaction =
    match.teams.faction1.team_id === playerId ? "faction1" : "faction2";
  const veto = await fetchMatchVetoHistory(match.match_id);

  return { playerFaction, veto };
};
