import { ACTIVE_MAP_POOL, ESCL } from "../../shared/consts";

/**
 * Checks whether an element identifiable by a query selector string in an HTML element.
 *
 * @param {string} [selectorString] Query selector string.
 * @param {HTMLElement} [parent] HTML element to apply the `selectorString` to.
 * @returns {boolean} Boolean that represents whether there is a querySelector match for `selectorString` element in the `parent` element
 */
export const elementExistsIn = (selectorString, parent) => {
  if (parent === null) return false;

  return parent.querySelector(selectorString) !== null;
};

/**
 * Checks whether a map stat is eligible to be accounted for by the extension.
 * @param {Object} [mapStat] Map stat object.
 * @returns {boolean} Boolean that represents whether the map stat is eligible to be account for by the extension.
 */
export const isRelevantMapStat = (mapStat) =>
  mapStat.type === "Map" &&
  mapStat.mode === "5v5" &&
  ACTIVE_MAP_POOL.has(mapStat.label);

/**
 * Checks whether the provided element has any mappio extension related elements appended to it.
 * @param {HTMLElement} element The HTML element.
 * @returns {boolean} Boolean that represents whether the provided `element` has any mappio extension related elements appended to it.
 */
export const hasMappio = (element) =>
  element.querySelector(`.${ESCL}`) !== null;

/**
 * Return a CSS color string that should be applied to the provided stat.
 * @param {Object} [stat] Stat object.
 * @returns {string} String that is a CSS color string.
 */
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
