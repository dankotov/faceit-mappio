import { debounce } from "lodash";
import { fetchMemoizedPlayerDetails } from "../helpers/faceit-api";
import { getMatchroomPlayers, getNickname } from "../helpers/matchroom";
import createMapStatsElement from "../components/mapStats";

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
    const nickname = getNickname(playerElement);
    const stats = playerMapStats[nickname];

    const el = createMapStatsElement({ text: "Hello World" });
    playerElement.append(el);
  });
}, 200);
