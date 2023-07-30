/** @jsx h */
import { h } from "dom-chef";
import { ESCL } from "../../../../shared/consts";
import { MapStats } from "../../../../shared/types/stats";
import createMapStatsTable from "../../add-player-map-stats/components/StatsTable";
import createPlayerSVG from "./PlayerSVG";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
type _h = typeof h; // needed to prevent TSeslint from removing h import

const teamAvgPlayerCard = ({
  mapStats,
  rosterName,
  rosterIndex,
}: {
  mapStats: MapStats;
  rosterName: string;
  rosterIndex: number;
}) => {
  const mapStatsTable = createMapStatsTable({ mapStats });

  const avgPlayerCard = (
    <div
      className={`${ESCL} teamAvgMapStats`}
      style={{
        border: "1px solid #303030",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 8,
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            minWidth: 40,
            height: 40,
            minHeight: 40,
            borderRadius: "50%",
            backgroundColor: "#303030",
            backgroundImage: "linear-gradient(to bottom,#484848,#161616)",
            boxShadow: "0 0 0 1px #303030",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "rgba(255,255,255,0.38)",
            filter: rosterIndex
              ? "invert(0%) sepia(56%) saturate(2204%) hue-rotate(231deg) brightness(86%) contrast(105%)"
              : "invert(0%) sepia(56%) saturate(2204%) hue-rotate(354deg) brightness(86%) contrast(105%)",
            marginRight: 8,
          }}
        >
          {createPlayerSVG({ size: 24 })}
        </div>
        <div
          style={{
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: 14,
              lineHeight: "20px",
            }}
          >
            {rosterName}
          </div>
          <div
            style={{
              fontWeight: "normal",
              fontSize: 12,
              lineHeight: "16px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Team Avg.
          </div>
        </div>
      </div>
      <div>{mapStatsTable}</div>
    </div>
  );

  return avgPlayerCard;
};

export default teamAvgPlayerCard;
