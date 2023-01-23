import { h } from "dom-chef";
import createMapDropProbabilitiesCell from "./mapDropProbabilitiesCell";
import { ACTIVE_MAP_POOL, ESCL } from "../helpers/consts";

export default ({ captainIds, captains }) => {
  const mapDropProbabilities = [];

  ACTIVE_MAP_POOL.forEach((mapName, codeName) => {
    const probabilityLeft =
      captains
        .get(captainIds[0])
        .probabilities.find((el) => el.mapName === codeName).probability || "-";
    const probabilityRight =
      captains
        .get(captainIds[1])
        .probabilities.find((el) => el.mapName === codeName).probability || "-";
    const mapDropProbabilitiesCell = createMapDropProbabilitiesCell({
      probabilityLeft,
      probabilityRight,
      mapName,
    });
    mapDropProbabilities.push(mapDropProbabilitiesCell);
  });

  const el = (
    <div
      class={ESCL + " mapDropProbabilities"}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: 12,
        color: "rgba(255, 255, 255, 0.6)",
      }}
    >
      {mapDropProbabilities}
    </div>
  );
  return el;
};
