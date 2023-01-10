import { elementExistsIn } from "./utils";

export const isMatchroomPage = () => {
  const pageUrl = document.location.href;
  return pageUrl.includes("/csgo/room/") && !pageUrl.includes("/matchroom");
};

export const rosterListsLoaded = () => {
  const sr = getShadowRootElement();
  return (
    elementExistsIn('[name="roster1"]', sr) &&
    elementExistsIn('[name="roster2"]', sr)
  );
};

export const getMatchroomId = () => {
  const pageUrl = document.location.href;

  const startIndex = pageUrl.indexOf("/room/") + 6;
  const idLength = 38;

  return pageUrl.substring(startIndex, startIndex + idLength);
};

export const getShadowRootElement = () => {
  return document.querySelector("#parasite-container").shadowRoot;
};
