/** @jsx h */
import { h } from "dom-chef";
import { ESCL } from "../../../../shared/consts";
import colors from "../../../../shared/theme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
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
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <span>Captain Matches: {datasetSize}</span>
    <span>Drop Probability</span>
  </div>
);

export default ProbabilityLegend;
