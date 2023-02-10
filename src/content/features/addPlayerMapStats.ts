import { debounce } from "lodash";
import createMapStatsElement from "../components/mapStatsTable";
import { memFetchAllMatchPlayersMapStats } from "../helpers/faceit-api";
import { getMatchroomPlayers, getNickname } from "../helpers/matchroom";
import { hasMappio } from "../helpers/utils";

export default debounce(async (matchroomId) => {
  const playerElements = getMatchroomPlayers();
  const playerMapStats = await memFetchAllMatchPlayersMapStats(matchroomId);

  playerElements.forEach((playerElement) => {
    if (hasMappio(playerElement)) return;

    const nickname = getNickname(playerElement);
    const playerStats = playerMapStats.find(
      (player) => player.nickname === nickname
    );
    const stats = playerStats?.maps;
    if (!stats) return;
    const el = createMapStatsElement({ stats });
    playerElement.append(el);
  });
}, 300);
