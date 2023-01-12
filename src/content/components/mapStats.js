import { h } from "dom-chef";

import { ACTIVE_MAP_POOL, ESCL } from "../helpers/consts";
import createMapStatsCell from "./mapStatsCell";

export default ({ stats }) => {
  const mapStats = [];

  ACTIVE_MAP_POOL.forEach((mapName, mapCodename) => {
    const label = mapName.substring(0, 3).toUpperCase();
    const stat = stats.get(mapCodename) || { games: "0", kd: "0" };

    const statElement = createMapStatsCell({ label, stat });

    mapStats.push(statElement);
  });

  const el = (
    <div
      className={ESCL}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid #303030",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 6,
      }}
    >
      <div style={{ textAlign: "center", paddingTop: 4, fontSize: 11 }}>
        Map / Games / K/D
      </div>
      <div
        style={{
          padding: "2px 4px 4px 4px",
          minHeight: 50,
          boxSizing: "border-box",
          width: "100%",
          display: "grid",
          gap: "0px 26px",
          gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        }}
      >
        {mapStats}
      </div>
      {/* <div>{JSON.stringify(stats)}</div> */}
    </div>
  );

  return el;
};
