import { h } from "dom-chef";
import { ACTIVE_MAP_POOL, ESCL } from "../helpers/consts";

export default ({ stats }) => {
  const mapStats = [];

  Object.keys(ACTIVE_MAP_POOL).forEach((key) => {
    const mapDisplay = ACTIVE_MAP_POOL[key].substring(0, 3).toUpperCase();
    const s = stats[key] ? (
      <div>
        {mapDisplay} {stats[key].games} {stats[key].wr}% {stats[key].kd}
      </div>
    ) : (
      <div>{mapDisplay} - - -</div>
    );

    mapStats.push(s);
  });

  const el = (
    <div
      className={ESCL}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 6,
      }}
    >
      <div
        style={{
          padding: 4,
          boxSizing: "border-box",
          borderTop: "1px solid #303030",
          borderBot: "1px solid #303030",
          width: "100%",
          display: "flex",
        }}
      >
        {mapStats}
      </div>
      <div>{JSON.stringify(stats)}</div>
    </div>
  );

  return el;
};
