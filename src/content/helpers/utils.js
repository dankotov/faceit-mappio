import { activeMapPool } from "./consts";

export const elementExistsIn = (selectorString, parent) => {
  if (parent === null) return false;

  return parent.querySelector(selectorString) === null ? false : true;
};

export const isRelevantMapStat = (mapStat) => {
  return (
    mapStat.type === "Map" &&
    mapStat.mode === "5v5" &&
    mapStat.label in activeMapPool
  );
};
