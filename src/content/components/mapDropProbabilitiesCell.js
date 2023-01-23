import { h } from "dom-chef";

export default ({ probabilityLeft, probabilityRight, mapName }) => {
  const el = (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        margin: "4px 0",
      }}
    >
      <div style={{ textAlign: "left", width: 70 }}>{probabilityLeft}%</div>
      <div style={{ textAlign: "center", width: 100 }}>{mapName}</div>
      <div style={{ textAlign: "right", width: 70 }}>{probabilityRight}%</div>
    </div>
  );
  return el;
};
