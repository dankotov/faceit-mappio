/** @jsx h */
import { h } from "dom-chef";
import { ESCL } from "../../../../shared/consts";
import { colors } from "../../../../shared/theme";

type _h = typeof h; // needed to prevent TSeslint from removing h import

const ProbabilityLegend = ({ datasetSize }: { datasetSize: number }) => (
  <div
    className={`${ESCL} probabilityLegend`}
    style={{
      fontWeight: "bold",
      fontSize: 14,
      color: colors.faceitgrey,
      textAlign: "left",
      marginBottom: 8,
    }}
  >
    Map Drop Dataset Size: {datasetSize} matches
  </div>
);

export default ProbabilityLegend;
