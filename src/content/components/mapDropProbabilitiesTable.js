/** @jsx h */
import { h } from "dom-chef";
import { ACTIVE_MAP_POOL, ESCL } from "../../shared/consts";
import { colors } from "../../shared/theme";
import createMapDropProbabilitiesCell from "./mapDropProbabilitiesCell";

const mapDropProbabilitiesTable = ({ captainIds, captains }) => {
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

  const tableContainerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 12,
    color: `${colors.foregrey}`,
  };

  const el = (
    <div className={`${ESCL} mapDropProbabilities`} style={tableContainerStyle}>
      {mapDropProbabilities}
    </div>
  );
  return el;
};

export default mapDropProbabilitiesTable;
