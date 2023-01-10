import { activeMapPool } from "./consts";

export const debounce = (cb, delay = 200) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

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
