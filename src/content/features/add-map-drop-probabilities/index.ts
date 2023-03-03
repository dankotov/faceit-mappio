import { debounce } from "lodash";
import { ACTIVE_MAP_POOL_REVERSE } from "../../../shared/consts";
import { MapName } from "../../../shared/types/csgo-maps";
import {
  fetchMe,
  getMatchPlayersFromMatchId,
  getOpponentCaptainIdFromMatchId,
} from "../../helpers/faceit-api";
import {
  getInfoElement,
  getMapName,
  getMatchroomMapsElements,
  getMatchroomMapsElementsParentAndContainer,
} from "../../helpers/matchroom";
import { memGetPlayerMapDropProbabilities } from "../../helpers/probabilities";
import { elementExistsIn, hasMappio } from "../../helpers/utils";
import createProbabilityCell from "./components/ProbabilityCell";
import createProbabilityLegend from "./components/ProbabilityLegend";

export default debounce(async (matchId) => {
  const matchPlayers = await getMatchPlayersFromMatchId(matchId);
  const currentUserId = await fetchMe().then((me) => me.id);
  const currentUserIsInMatch = matchPlayers.some(
    (player) => player.player_id === currentUserId
  );
  if (!currentUserIsInMatch) return;

  const opponentCaptainId = await getOpponentCaptainIdFromMatchId(
    matchId,
    currentUserId
  );
  const [datasetSize, mapDropProbabilities] =
    await memGetPlayerMapDropProbabilities(opponentCaptainId);

  const matchMapsElements = getMatchroomMapsElements();

  let probabilitiesAppended = false;

  matchMapsElements?.forEach((mapElement) => {
    if (!mapElement || hasMappio(mapElement) || mapElement.tagName !== "DIV")
      return;

    const mapName = getMapName(mapElement);
    if (!mapName) return;
    const mapCodename = ACTIVE_MAP_POOL_REVERSE.get(mapName as MapName);
    if (!mapCodename) return;

    const probability = mapDropProbabilities.find(
      (map) => map.mapCodename === mapCodename
    )?.probability;
    if (!probability) return;

    const probabilityCell = createProbabilityCell({ probability });
    mapElement.append(probabilityCell);
    probabilitiesAppended = true;
  });

  const infoElement = getInfoElement();

  if (
    probabilitiesAppended &&
    infoElement &&
    !elementExistsIn(".probabilityLegend", infoElement)
  ) {
    const probabilityLegend = createProbabilityLegend({ datasetSize });
    const [parent, container] = getMatchroomMapsElementsParentAndContainer();
    if (parent && container) parent.insertBefore(probabilityLegend, container);
  }
}, 300);
