/** @jsx h */
import { h } from "dom-chef";
import { Stats } from "../../shared/types/stats";
import { colorCodeStat } from "../helpers/utils";

type _h = typeof h; // needed to prevent TSeslint from removing h import

const mapStatsCell = ({ label, stats }: { label: string; stats: Stats }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
      color: colorCodeStat(stats),
    }}
  >
    <div style={{ width: 22 }}>{label}</div>
    <div style={{ width: 30 }}>{stats.games}</div>
    <div style={{ width: 22 }}>{stats.kd}</div>
  </div>
);

export default mapStatsCell;
