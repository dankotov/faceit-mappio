/** @jsx h */
import { h } from "dom-chef";
import { ESCL } from "../../../../shared/consts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
type _h = typeof h; // needed to prevent TSeslint from removing h import

const ProbabilityCell = ({ probability }: { probability: number }) => (
  <div
    className={`${ESCL} mapDropProbabilities`}
    style={{
      display: "flex",
      width: 35,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 14,
      fontWeight: "bold",
    }}
  >
    {probability}%
  </div>
);

export default ProbabilityCell;
