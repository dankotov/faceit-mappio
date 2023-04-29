// eslint-disable-next-line import/no-unresolved
import mem from "mem";
import pRetry, { AbortError } from "p-retry";
import { getCookie } from "typescript-cookie";
import {
  ACTIVE_MAP_POOL,
  CACHE_TIME,
  EMPTY_STATS,
  FACEIT_API_BASE_URL,
} from "../../shared/consts";
import {
  FaceitUnwrappedData,
  FaceitWrappedData,
} from "../../shared/types/faceit";
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
import { getFaceitTimestamp } from "./utils";

/**
 * Returns the user's cached FACEIT production API auth token.
 */
const getLocalApiToken = () => {
  return getCookie("t") || localStorage.getItem("token");
};

/**
 * Returns response from `baseUrl` + `requestPath`.
 */
const fetchFaceitApi = async (baseUrl: string, requestPath: string) => {
  try {
    const token = getLocalApiToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await pRetry(
      async () => {
        const r = await fetch(baseUrl + requestPath, {
          method: "GET",
          headers,
        });
        if (r.status === 404) {
          throw new AbortError(r.statusText);
        }
        return r;
      },
      { retries: 3 }
    );

    // detect network error
    if (!response.ok) return null;

    return response;
  } catch (err) {
    return null;
  }
};

/**
 * Returns a memoized response from `baseUrl` + `requestPath`.
 */
const memFetchFaceitApi = mem(fetchFaceitApi, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

const fetchFaceitUnwrappedEndpoint = async (
  baseUrl: string,
  requestPath: string
) => {
  const response = await memFetchFaceitApi(baseUrl, requestPath);
  if (!response) return null;

  const data: FaceitUnwrappedData = await response.json();

  return data;
};

const memFetchFaceitUnwrappedEndpoint = mem(fetchFaceitUnwrappedEndpoint, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

const fetchFaceitWrappedEndpoint = async (
  baseUrl: string,
  requestPath: string
) => {
  const response = await memFetchFaceitApi(baseUrl, requestPath);
  if (!response) return null;

  const data: FaceitWrappedData = await response.json();
  const { code, result, payload } = data;

  // detect faceit api error
  if (
    (code && code.toUpperCase() !== "OPERATION-OK") ||
    (result && result.toUpperCase() !== "OK")
  )
    return null;

  return payload;
};

const memFetchFaceitWrappedEndpoint = mem(fetchFaceitWrappedEndpoint, {
  maxAge: CACHE_TIME,
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

/**
 * Fetches currently logged in user's details
 */
export const fetchMe = async (): Promise<Me | null> =>
  memFetchFaceitWrappedEndpoint(
    FACEIT_API_BASE_URL,
    "/users/v1/sessions/me"
  ) as Promise<Me | null>;

/**
 * Fetches match details by `matchId`.
 */
export const fetchMatchDetails = async (
  matchId: string
): Promise<MatchDetails | null> =>
  memFetchFaceitWrappedEndpoint(
    FACEIT_API_BASE_URL,
    `/match/v2/match/${matchId}`
  ) as Promise<MatchDetails | null>;

/**
 * Fetches player details by `playerId`
 */
export const fetchPlayerStats = async (
  playerId: string
): Promise<PlayerGameStats | null> =>
  memFetchFaceitUnwrappedEndpoint(
    FACEIT_API_BASE_URL,
    `/stats/v1/stats/users/${playerId}/games/csgo`
  ) as Promise<PlayerGameStats | null>;

/**
 * Extracts a list of the match players' nicknames and ids from the match details object.
 */
const getMatchPlayersFromMatchDetails = (matchDetails: MatchDetails) => {
  const matchFactions: FactionDetails[] = Object.values(matchDetails.teams);

  const players: Player[] = [];

  matchFactions.forEach((faction) => {
    faction.roster.forEach((playerDetails) => {
      const player: Player = {
        player_id: playerDetails.id,
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
  if (!md) return null;
  return getMatchPlayersFromMatchDetails(md);
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
    (player) => player.id === playerId
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
  if (!md) return null;
  return getOpponentCaptainIdFromMatchDetails(md, playerId);
};

/**
 * Fetches and organizes player stat data fetched from the FACEIT API.
 */
const fetchPlayerMapStats = async (playerId: string): Promise<MapStats> => {
  const playerRawStats = await fetchPlayerStats(playerId);
  // extract stats of intereset for each map of active map pool from fetched player details
  const playerMapStats: MapStats = new Map([]);
  const playerCompetetiveStats = playerRawStats?.segments.find(
    (segment) =>
      segment._id.game === "csgo" &&
      segment._id.gameMode === "5v5" &&
      segment._id.segmentId === "csgo_map"
  )?.segments;

  ACTIVE_MAP_POOL.forEach((_, mapCodename) => {
    const rawMapData = playerCompetetiveStats?.[mapCodename];

    const mapData: Stats = {
      games: rawMapData?.m1 || EMPTY_STATS.games,
      kd: rawMapData?.k5 || EMPTY_STATS.kd,
    };

    playerMapStats.set(mapCodename, mapData);
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
  if (!matchDetails) return null;
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
 * Fetches a 100 matches of playerId
 */
export const fetchPlayerMatches = async (
  playerId: string
): Promise<MatchOverview[] | null> => {
  const cd = new Date();
  const to = getFaceitTimestamp(cd);
  const from = getFaceitTimestamp(cd, 2);

  return memFetchFaceitWrappedEndpoint(
    FACEIT_API_BASE_URL,
    `/match-history/v5/players/${playerId}/history/?page=0&offset=0&to=${to}&from=${from}&size=100&playerId=${playerId}`
  ) as Promise<MatchOverview[] | null>;
};

/**
 * Checks whether the player with `playerId` was a team captain in `match`.
 */
const isCaptainMatch = (match: MatchOverview, playerId: string) => {
  if (
    match.teams.faction1.leader !== playerId &&
    match.teams.faction2.leader !== playerId
  )
    return false;

  if (match.competition.name !== "5v5 RANKED") return false;
  if (match.competition.type !== "matchmaking") return false;
  if (match.organizer.id !== "faceit") return false;
  if (match.state !== "finished") return false;

  return true;
};

/**
 * Gets a list of a player's captain matches.
 */
export const fetchPlayerCaptainMatchList = async (playerId: string) => {
  const matches = await fetchPlayerMatches(playerId);
  if (!matches) return [];
  const captainMatches = matches.filter((match) =>
    isCaptainMatch(match, playerId)
  );
  return captainMatches;
};

/**
 * Gets the veto history of a match by match id.
 */
const fetchMatchVetoHistory = async (
  matchId: string
): Promise<VetoHistory | null> =>
  memFetchFaceitWrappedEndpoint(
    FACEIT_API_BASE_URL,
    `/democracy/v1/match/${matchId}/history`
  ) as Promise<VetoHistory | null>;

/**
 * Gets a match's veto history and the `playerId`'s faction in that match.
 */
export const getPlayerMatchVetoDetails = async (
  match: MatchOverview,
  playerId: string
): Promise<{ playerFaction: string | null; veto: VetoHistory | null }> => {
  const playerFaction =
    match.teams.faction1.leader === playerId ? "faction1" : "faction2";
  const veto = await fetchMatchVetoHistory(match.matchId);

  if (!veto) return { playerFaction: null, veto: null };

  return { playerFaction, veto };
};
