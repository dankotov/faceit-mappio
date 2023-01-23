import { debounce } from "lodash";
import createMapDropProbabilitiesTable from "../components/mapDropProbabilitiesTable";
import { getCaptains } from "../helpers/faceit-api";
import {
  getCaptainElements,
  getInfoElement,
  getNickname,
} from "../helpers/matchroom";
import generateDropProbabilities from "../helpers/probabilities";
import { hasMappio } from "../helpers/utils";

export default debounce(async (matchroomId) => {
  const info = getInfoElement();
  if (hasMappio(info)) return;

  const captainIds = await getCaptains(matchroomId);
  const captainElements = getCaptainElements();

  const dropProbabilityPromises = captainIds.map(generateDropProbabilities);
  const dropProbabilities = await Promise.all(dropProbabilityPromises);

  const captains = new Map([
    [
      captainIds[0],
      {
        el: captainElements[0],
        nickname: getNickname(captainElements[0]),
        probabilities: dropProbabilities.find((e) => e.id === captainIds[0])
          .probabilities,
      },
    ],
    [
      captainIds[1],
      {
        el: captainElements[1],
        nickname: getNickname(captainElements[1]),
        probabilities: dropProbabilities.find((e) => e.id === captainIds[1])
          .probabilities,
      },
    ],
  ]);

  const el = createMapDropProbabilitiesTable({ captainIds, captains });
  if (hasMappio(info)) return;
  info.append(el);
}, 300);
