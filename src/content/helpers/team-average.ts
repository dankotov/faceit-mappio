import { EMPTY_STATS } from "../../shared/consts";
import { PlayerMapStats } from "../../shared/types/player";
import { MapStats } from "../../shared/types/stats";
import { getNickname } from "./matchroom";

// eslint-disable-next-line import/prefer-default-export
export const getTeamAverageStats = (
  rosterPlayers: HTMLDivElement[],
  matchPlayersMapStats: PlayerMapStats[]
) => {
  const accumulatorStats: MapStats = new Map([
    ["de_dust2", EMPTY_STATS],
    ["de_inferno", EMPTY_STATS],
    ["de_ancient", EMPTY_STATS],
    ["de_overpass", EMPTY_STATS],
    ["de_mirage", EMPTY_STATS],
    ["de_nuke", EMPTY_STATS],
    ["de_vertigo", EMPTY_STATS],
    ["de_anubis", EMPTY_STATS],
  ]);

  const nonZeroStatsCount = {
    de_dust2: 0,
    de_inferno: 0,
    de_ancient: 0,
    de_overpass: 0,
    de_mirage: 0,
    de_nuke: 0,
    de_vertigo: 0,
    de_anubis: 0,
  };

  rosterPlayers.forEach((rosterPlayer) => {
    const playerNickname = getNickname(rosterPlayer);
    const playerStats = matchPlayersMapStats.find(
      (playerMapStats) => playerMapStats.nickname === playerNickname
    );

    if (!playerStats) return;

    playerStats.maps.forEach((mapStats, mapCodename) => {
      const currentMapStats = accumulatorStats.get(mapCodename);

      if (!currentMapStats) return;

      const currentTotalGamesCount = Number(currentMapStats.games);
      const currentTotalKDCount = Number(currentMapStats.kd);
      const currentTotalNonZeroStatsCount = nonZeroStatsCount[mapCodename];
      const playerGames = Number(mapStats.games);
      const playerKD = Number(mapStats.kd);

      if (playerGames < 1) return;

      accumulatorStats.set(mapCodename, {
        games: (currentTotalGamesCount + playerGames).toString(),
        kd: (currentTotalKDCount + playerKD).toString(),
      });
      nonZeroStatsCount[mapCodename] = currentTotalNonZeroStatsCount + 1;
    });
  });

  accumulatorStats.forEach((mapStats, mapCodename) => {
    const totalNonZeroStatsCount = nonZeroStatsCount[mapCodename];
    if (!totalNonZeroStatsCount) {
      accumulatorStats.set(mapCodename, { games: "0", kd: "0" });
      return;
    }

    const avgGames = (Number(mapStats.games) / totalNonZeroStatsCount).toFixed(
      0
    );
    const avgKd = (Number(mapStats.kd) / totalNonZeroStatsCount).toFixed(2);

    accumulatorStats.set(mapCodename, { games: avgGames, kd: avgKd });
  });

  return accumulatorStats;
};
