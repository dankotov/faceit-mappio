type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type CSSColorCode = RGB | RGBA | HEX;

type ColorName =
  | "backblack"
  | "backgrey"
  | "backlightgrey"
  | "forewhite"
  | "foregrey"
  | "faceitgrey"
  | "faceitred"
  | "faceitorange"
  | "faceitgreen";

const colors: { [key in ColorName]: CSSColorCode } = {
  backblack: "#161616",
  backgrey: "#303030",
  backlightgrey: "#505050",
  forewhite: "#f0eff4",
  foregrey: "#a0a0a0",
  faceitgrey: "rgba(255, 255, 255, 0.6)",
  faceitred: "#d94949",
  faceitorange: "#ff550b",
  faceitgreen: "#32d35a",
};

export default colors;
