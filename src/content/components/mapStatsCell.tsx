/** @jsx h */
import { colorCodeStat } from "../helpers/utils";

const mapStatsCell = ({ label = "ERR", stat = { games: "0", kd: "0" } }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
      color: colorCodeStat(stat),
    }}
  >
    <div style={{ width: 22 }}>{label}</div>
    <div style={{ width: 26 }}>{stat.games}</div>
    <div style={{ width: 22 }}>{stat.kd}</div>
  </div>
);

export default mapStatsCell;
