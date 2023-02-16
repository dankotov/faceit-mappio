import { MapCodename, MapName } from "./types/csgo-maps";
import { MapStats, Stats } from "./types/stats";

export const EXTENSION_NAME = "mappio";
export const ESCL = EXTENSION_NAME;

export const FACEIT_OPEN_BASE_URL = "https://open.faceit.com";
export const FACEIT_API_BASE_URL = "https://api.faceit.com";

export const CACHE_TIME = 1000 * 60 * 40; // 1000ms * 60 * 40 = 40 minutes ~ avg game length

export const ACTIVE_MAP_POOL = new Map<MapCodename, MapName>([
  ["de_dust2", "Dust2"],
  ["de_inferno", "Inferno"],
  ["de_ancient", "Ancient"],
  ["de_overpass", "Overpass"],
  ["de_mirage", "Mirage"],
  ["de_nuke", "Nuke"],
  ["de_vertigo", "Vertigo"],
  ["de_anubis", "Anubis"],
]);

export const ACTIVE_MAP_POOL_REVERSE = new Map<MapName, MapCodename>([
  ["Dust2", "de_dust2"],
  ["Inferno", "de_inferno"],
  ["Ancient", "de_ancient"],
  ["Overpass", "de_overpass"],
  ["Mirage", "de_mirage"],
  ["Nuke", "de_nuke"],
  ["Vertigo", "de_vertigo"],
  ["Anubis", "de_anubis"],
]);

export const EMPTY_STATS: Stats = {
  games: "0",
  kd: "0",
  kr: "0",
  wr: "0",
};

export const EMPTY_MAP_STATS: MapStats = new Map([
  ["de_dust2", EMPTY_STATS],
  ["de_inferno", EMPTY_STATS],
  ["de_ancient", EMPTY_STATS],
  ["de_overpass", EMPTY_STATS],
  ["de_mirage", EMPTY_STATS],
  ["de_nuke", EMPTY_STATS],
  ["de_vertigo", EMPTY_STATS],
  ["de_anubis", EMPTY_STATS],
]);
