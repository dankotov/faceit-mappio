export const EXTENSION_NAME = "mappio";
export const ESCL = EXTENSION_NAME;

export const FACEIT_OPEN_BASE_URL = "https://open.faceit.com";
export const FACEIT_API_BASE_URL = "https://api.faceit.com";
export const FACEIT_API_BEARER_TOKEN = "e5116e15-8d53-445e-bf01-145a7f04129c";

export const CACHE_TIME = 1000 * 60 * 40; // 1000ms * 60 * 40 = 40 minutes ~ avg game length

export const ACTIVE_MAP_POOL = new Map([
  ["de_dust2", "Dust2"],
  ["de_inferno", "Inferno"],
  ["de_ancient", "Ancient"],
  ["de_overpass", "Overpass"],
  ["de_mirage", "Mirage"],
  ["de_nuke", "Nuke"],
  ["de_vertigo", "Vertigo"],
  ["de_anubis", "Anubis"],
]);

export const ACTIVE_MAP_POOL_REVERSE = new Map([
  ["Dust2", "de_dust2"],
  ["Inferno", "de_inferno"],
  ["Ancient", "de_ancient"],
  ["Overpass", "de_overpass"],
  ["Mirage", "de_mirage"],
  ["Nuke", "de_nuke"],
  ["Vertigo", "de_vertigo"],
  ["Anubis", "de_anubis"],
]);