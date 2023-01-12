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
  if (
    Number(stat.games) === 0 ||
    (Number(stat.kd) >= 1 && Number(stat.kd) < 1.2)
  )
    return "rgba(255, 255, 255, 0.6)";

  return Number(stat.kd) >= 1.2 ? "#32d35a" : "#d94949";
};
