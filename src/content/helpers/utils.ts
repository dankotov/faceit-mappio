import { ACTIVE_MAP_POOL, ESCL } from "../../shared/consts";
import { colors } from "../../shared/theme";
import { MapCodename } from "../../shared/types/csgo-maps";
import { SegmentStats, Stats } from "../../shared/types/stats";

/**
 * Checks whether an element identifiable by a query selector string in an HTML element.
 *
 * @param {string} [selectorString] Query selector string.
 * @param {HTMLElement} [parent] HTML element to apply the `selectorString` to.
 * @returns {boolean} Boolean that represents whether there is a querySelector match for `selectorString` element in the `parent` element
 */
export const elementExistsIn = (
  selectorString: string,
  parent: HTMLElement | ShadowRoot
) => !!parent.querySelector(selectorString);

/**
 * Checks whether a map stat is eligible to be accounted for by the extension.
 * @param {Object} [mapStat] Map stat object.
 * @returns {boolean} Boolean that represents whether the map stat is eligible to be account for by the extension.
 */
export const isRelevantMapStat = (segmentStats: SegmentStats) =>
  segmentStats.type === "Map" &&
  segmentStats.mode === "5v5" &&
  ACTIVE_MAP_POOL.has(segmentStats.label as MapCodename);

/**
 * Checks whether the provided element has any mappio extension related elements appended to it.
 * @param {HTMLElement} element The HTML element.
 * @returns {boolean} Boolean that represents whether the provided `element` has any mappio extension related elements appended to it.
 */
export const hasMappio = (element: HTMLElement) =>
  !!element.querySelector(`.${ESCL}`);

/**
 * Return a CSS color string that should be applied to the provided stat.
 * @param {Object} [stat] Stat object.
 * @returns {string} String that is a CSS color string.
 */
export const colorCodeStat = (stats: Stats) => {
  const [games, kd] = [Number(stats.games), Number(stats.kd)];

  if (games < 1 || (kd >= 1 && kd < 1.2)) return colors.foregrey;

  return kd >= 1.2 ? colors.faceitgreen : colors.faceitred;
};
