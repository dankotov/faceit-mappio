import { ESCL } from "./consts";
import { elementExistsIn } from "./utils";

export const isMatchroomPage = () => {
  const pageUrl = document.location.href;
  return pageUrl.includes("/csgo/room/") && !pageUrl.includes("/matchroom");
};

export const isShadowRootLoaded = () => {
  return getShadowRootElement() !== null;
};

export const isMatchroomOverviewLoaded = () => {
  return getShadowRootElement().querySelector("#MATCHROOM-OVERVIEW") !== null;
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

const getShadowRootElement = () => {
  return document.querySelector("#parasite-container").shadowRoot;
};

const getRosterList = (rosterContainer) => {
  let roster = [];
  if (rosterContainer.childElementCount === 5) {
    rosterContainer.childNodes.forEach((playerCard) => {
      roster.push(playerCard.childNodes[0]);
    });
  } else if (roster.childElementCount === 1) {
    rosterContainer.childNodes[0].forEach((playerCard) => {
      roster.push(playerCard);
    });
  } else {
    rosterContainer.childNodes.forEach((premadeContainer) => {
      if (premadeContainer.childElementCount === 1) {
        roster.push(premadeContainer.childNodes[0]);
      } else {
        premadeContainer.childNodes.forEach((playerCard) => {
          roster.push(playerCard.childNodes[0].childNodes[0]);
        });
      }
    });
  }

  return roster;
};

export const getMatchroomPlayers = () => {
  const mo = getShadowRootElement().querySelector("#MATCHROOM-OVERVIEW");

  const rosterOne = getRosterList(
    mo.querySelector('[name="roster1"]').childNodes[0]
  );
  const rosterTwo = getRosterList(
    mo.querySelector('[name="roster2"]').childNodes[0]
  );

  return rosterOne.concat(rosterTwo);
};

export const getCaptainElements = () => {
  const players = getMatchroomPlayers();
  return [players[0], players[5]];
};

export const getInfoElement = () => {
  const mo = getShadowRootElement().querySelector("#MATCHROOM-OVERVIEW");

  return mo.querySelector('[name="info"]');
};

export const getMapVetoOptions = () => {
  const info = getInfoElement();

  const mapVetoOptionElements = [
    ...info.firstChild.firstChild.childNodes[2].firstChild.childNodes,
  ];
  return mapVetoOptionElements;
};

export const getMapName = (mapCard) => {
  return mapCard.querySelector("div > span").textContent;
};

export const getNickname = (playerCard) =>
  (
    playerCard.querySelector("span + div") ||
    playerCard.firstChild.firstChild.childNodes[1].firstChild.firstChild
  ).textContent;
