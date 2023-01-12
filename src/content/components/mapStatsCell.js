import { h } from "dom-chef";
import { colorCodeStat } from "../helpers/utils";

export default ({
  mapDisplayLabel = "ERR",
  stat = { games: "0", kd: "0" },
}) => (
  <div
    style={{
      fontSize: 11,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
      color: colorCodeStat(stat),
    }}
  >
    <div style={{ width: 22 }}>{mapDisplayLabel}</div>
    <div style={{ width: 26 }}>{stat.games}</div>
    <div style={{ width: 22 }}>{stat.kd}</div>
  </div>
);
