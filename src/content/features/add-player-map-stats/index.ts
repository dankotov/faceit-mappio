import { debounce } from "lodash";
import { EMPTY_MAP_STATS } from "../../../shared/consts";
import { memFetchAllMatchPlayersMapStats } from "../../helpers/faceit-api";
import { getMatchroomPlayers, getNickname } from "../../helpers/matchroom";
import { hasMappio } from "../../helpers/utils";
import createMapStatsTable from "./components/StatsTable";

export default debounce(async (matchroomId) => {
  const playerElements = getMatchroomPlayers();
  const playerMapStats = await memFetchAllMatchPlayersMapStats(matchroomId);

  playerElements?.forEach((playerElement) => {
    if (hasMappio(playerElement)) return;

    const nickname = getNickname(playerElement);
    if (!nickname) return;

    const mapStats =
      playerMapStats?.find((player) => player.nickname === nickname)?.maps ||
      EMPTY_MAP_STATS;

    const mapStatsTable = createMapStatsTable({ mapStats });
    playerElement.append(mapStatsTable);
  });
}, 300);
