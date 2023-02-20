/** @jsx h */
import { h } from "dom-chef";
import { ESCL } from "../../../../shared/consts";

type _h = typeof h; // needed to prevent TSeslint from removing h import

export enum ProbabilityCellVariant {
  Default,
  NoMargin,
}

const ProbabilityCell = ({
  probability,
  variant,
}: {
  probability: number;
  variant: ProbabilityCellVariant;
}) => (
  <div
    className={`${ESCL} mapDropProbabilities`}
    style={{
      display: "flex",
      width: 35,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 14,
      fontWeight: "bold",
      marginRight: variant === ProbabilityCellVariant.Default ? 8 : 0,
    }}
  >
    {probability}%
  </div>
);

export default ProbabilityCell;
