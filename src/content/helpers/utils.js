import { ACTIVE_MAP_POOL } from "./consts";

export const elementExistsIn = (selectorString, parent) => {
  if (parent === null) return false;

  return parent.querySelector(selectorString) === null ? false : true;
};

export const isRelevantMapStat = (mapStat) => {
  return (
    mapStat.type === "Map" &&
    mapStat.mode === "5v5" &&
    ACTIVE_MAP_POOL.has(mapStat.label)
  );
};

export const colorCodeStat = (stat) => {
  const colors = {
    red: "#d94949",
    grey: "rgba(255, 255, 255, 0.6)",
    green: "#32d35a",
  };
  const [games, kd] = [Number(stat.games), Number(stat.kd)];

  if (games < 1 || (kd >= 1 && kd < 1.2)) return colors.grey;

  return kd >= 1.2 ? colors.green : colors.red;
};
