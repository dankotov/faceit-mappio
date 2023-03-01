import { ACTIVE_MAP_POOL, ESCL } from "../../shared/consts";
import { colors } from "../../shared/theme";
import { MapCodename } from "../../shared/types/csgo-maps";
import { SegmentStats, Stats } from "../../shared/types/stats";

/**
 * Checks whether an element identifiable by a query selector string is in an HTML element.
 */
export const elementExistsIn = (
  selectorString: string,
  parent: HTMLElement | ShadowRoot | Element
) => !!parent.querySelector(selectorString);

/**
 * Checks whether a map stat is eligible to be accounted for by the extension.
 */
export const isRelevantMapStat = (segmentStats: SegmentStats) =>
  segmentStats.type === "Map" &&
  segmentStats.mode === "5v5" &&
  ACTIVE_MAP_POOL.has(segmentStats.label as MapCodename);

/**
 * Checks whether the provided element has any mappio extension related elements appended to it.
 */
export const hasMappio = (element: HTMLElement) =>
  !!element?.querySelector(`.${ESCL}`);

/**
 * Return a CSS color string that should be applied to the provided stat.
 */
export const colorCodeStat = (stats: Stats) => {
  const [games, kd] = [Number(stats.games), Number(stats.kd)];

  if (games < 1 || (kd >= 1 && kd < 1.2)) return colors.foregrey;

  return kd >= 1.2 ? colors.faceitgreen : colors.faceitred;
};
