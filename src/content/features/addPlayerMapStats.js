import { debounce } from "lodash";
import { fetchMemoizedPlayerDetails } from "../helpers/faceit-api";
import { getMatchroomPlayers, getNickname } from "../helpers/matchroom";

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

    const el = document.createElement("div");
    el.innerHTML = `Map: de_mirage, Games: ${stats.maps.de_mirage.games}, KD: ${stats.maps.de_mirage.kd}, WR: ${stats.maps.de_mirage.wr}`;
    playerElement.append(el);
  });
}, 200);
