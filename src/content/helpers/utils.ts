import { ESCL } from "../../shared/consts";
import colors from "../../shared/theme";
import { Stats } from "../../shared/types/stats";

/**
 * Checks whether an element identifiable by a query selector string is in an HTML element.
 */
export const elementExistsIn = (
  selectorString: string,
  parent: HTMLElement | ShadowRoot | Element
) => !!parent?.querySelector(selectorString);

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

export const padZero = (toBePadded: number) => {
  return toBePadded.toString().padStart(2, "0");
};

export const getFaceitTimestamp = (date: Date, yearOffset: number = 0) => {
  const year = date.getFullYear() - yearOffset;
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const offsetHours = Math.floor(date.getTimezoneOffset() / 60);
  const offsetDirection = encodeURIComponent(offsetHours < 0 ? "+" : "-");
  const offset = Math.abs(offsetHours)
    .toString()
    .padStart(2, "0")
    .padEnd(4, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetDirection}${offset}`;
};
