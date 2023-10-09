/** @jsx h */
import { h } from "dom-chef";
import { ReactNode } from "react";
import { ACTIVE_MAP_POOL, EMPTY_STATS, ESCL } from "../../../../shared/consts";
import colors from "../../../../shared/theme";
import { MapStats } from "../../../../shared/types/stats";
import createMapStatsCell from "./StatsCell";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
type _h = typeof h; // needed to prevent TSeslint from removing h import

const mapStatsTable = ({ mapStats }: { mapStats: MapStats }) => {
  const mapStatsElements: ReactNode[] = [];

  ACTIVE_MAP_POOL.forEach((mapName, mapCodename) => {
    const label = mapName.substring(0, 3).toUpperCase();
    const stats = mapStats.get(mapCodename) || EMPTY_STATS;

    const statElement = createMapStatsCell({ label, stats });

    mapStatsElements.push(statElement);
  });

  const table = (
    <div
      className={`${ESCL} mapStats`}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: `1px solid ${colors.backgrey}`,
        color: `${colors.foregrey}`,
        fontSize: 11,
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", paddingTop: 4 }}>
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
        {mapStatsElements}
      </div>
      <div
        title="FACEIT Mappio now shows separate stats for CS:GO and CS2. Some players haven't tried all CS2 maps yet, so there might be missing stats for them on certain maps. Don't worry, the stats will show up as these players play more CS2 games on FACEIT."
        style={{
          position: "absolute",
          right: 5,
          top: 4,
          width: 15,
          height: 15,
          padding: 0,
          border: "1px solid rgb(100, 100, 100)",
          color: "rgb(100, 100, 100)",
          background: "transparent",
          borderRadius: "50%",
          fontWeight: "bold",
          fontStyle: "italic",
          paddingRight: 2,
          lineHeight: "14px",
          transition: "background 0.1s ease-in-out",
          textAlign: "center",
          cursor: "help",
        }}
      >
        i
      </div>
    </div>
  );

  return table;
};

export default mapStatsTable;
