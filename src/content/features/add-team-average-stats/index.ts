import { debounce } from "lodash";
import { memFetchAllMatchPlayersMapStats } from "../../helpers/faceit-api";
import { getNickname, getRosters } from "../../helpers/matchroom";
import { EMPTY_MAP_STATS } from "../../../shared/consts";
import { MapStats } from "../../../shared/types/stats";

export default debounce(async (matchroomId) => {
  const rosters = getRosters();
  if (!rosters) return;

  const playerMapStats = await memFetchAllMatchPlayersMapStats(matchroomId);
  if (!playerMapStats) return;

  rosters.forEach((roster) => {
    const rosterSummedStats = roster.reduce((acc: MapStats, rosterPlayer) => {
      const nickname = getNickname(rosterPlayer);
      const playerStats = playerMapStats.find(
        (playerMapStat) => playerMapStat.nickname === nickname
      );
      playerStats?.maps.forEach((mapStats, mapCodename) => {
        const currentMapStats = acc.get(mapCodename);
        const currentTotalGamesCount = currentMapStats?.games;
        const currentTotalKDCount = currentMapStats?.kd;

        acc.set(mapCodename, {
          games: currentTotalGamesCount + mapStats.games,
          kd: currentTotalKDCount + mapStats.kd,
        });
      });

      return acc;
    }, EMPTY_MAP_STATS);

    // TODO: roster average stats
  });
}, 300);
