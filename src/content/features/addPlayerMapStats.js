import { debounce } from "lodash";
import { fetchMemoizedPlayerDetails } from "../helpers/faceit-api";
import { getMatchroomPlayers, getNickname } from "../helpers/matchroom";
import createMapStatsElement from "../components/mapStats";
import { hasMappio } from "../helpers/utils";

export const addPlayerMapStats = async (matchroomId) => {
  const playerElements = getMatchroomPlayers();
  const playerMapStats = await fetchMemoizedPlayerDetails(matchroomId);

  playerElements.forEach((playerElement) => {
    const nickname = getNickname(playerElement);
    console.log(nickname);
  });
};

export const debounceAddPlayerMapStats = debounce(async (matchroomId) => {
  const playerElements = getMatchroomPlayers();
  const playerMapStats = await fetchMemoizedPlayerDetails(matchroomId);

  playerElements.forEach((playerElement) => {
    if (hasMappio(playerElement)) return;

    const nickname = getNickname(playerElement);
    const stats = playerMapStats[nickname].maps;

    const el = createMapStatsElement({ stats });
    playerElement.append(el);
  });
}, 200);
