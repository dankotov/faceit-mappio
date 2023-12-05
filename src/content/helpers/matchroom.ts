import { Maybe } from "../../shared/types/utils";
import { elementExistsIn } from "./utils";

/**
 * Gets the current page's shadow root element.
 */
const getShadowRootElement = () =>
  document.querySelector("#parasite-container");

/**
 * Checks if the current page has a main content element.
 */
export const hasMainContentElement = () =>
  !!document.querySelector("#main-content");

/**
 * Checks if current page is the matchroom page.
 */
export const isMatchroomPage = () => {
  const pageUrl = document.location.href;
  return (
    (pageUrl.includes("/csgo/room/") || pageUrl.includes("/cs2/room/")) &&
    !pageUrl.includes("/matchroom")
  );
};

/**
 * Checks if the current page's shadow root element is loaded.
 */
export const isShadowRootLoaded = () => !!getShadowRootElement();

/**
 * Checks if the current page's matchroom overview element is loaded.
 */
export const isMatchroomOverviewLoaded = () =>
  !!getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

/**
 * Checks if the current page's roster lists elements are loaded.
 */
export const rosterListsLoaded = () => {
  const sr = getShadowRootElement();
  return (
    sr &&
    elementExistsIn('[name="roster1"]', sr) &&
    elementExistsIn('[name="roster2"]', sr)
  );
};

/**
 * Gets the current matchroom's ID from the URL
 */
export const getMatchroomId = (): string => {
  const pageUrl = document.location.href;

  const startIndex = pageUrl.indexOf("/room/") + 6;
  const idLength = 38;

  return pageUrl.substring(startIndex, startIndex + idLength);
};

/**
 * Returns an object with two strings that are the team names for each roster
 */
export const getRosterNames = (): {
  rosterOneName: Maybe<string>;
  rosterTwoName: Maybe<string>;
} => {
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  const matchHeaderElement = mo?.querySelector(
    ":scope > div > div > div:nth-child(2)"
  );

  const rosterOneName = matchHeaderElement?.querySelector(
    ":scope > div:nth-child(1) h6"
  )?.textContent as Maybe<string>;
  const rosterTwoName = matchHeaderElement?.querySelector(
    ":scope > div:nth-child(3) h6"
  )?.textContent as Maybe<string>;

  return { rosterOneName, rosterTwoName };
};

/**
 * Returns an object with two HTML div elements that are containers for each roster's player cards
 */
export const getRosterContainers = (): {
  rosterOneContainer: Maybe<HTMLDivElement>;
  rosterTwoContainer: Maybe<HTMLDivElement>;
} => {
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  const rosterOneContainer = mo?.querySelector(
    'div[name="roster1"] > div'
  ) as Maybe<HTMLDivElement>;
  const rosterTwoContainer = mo?.querySelector(
    'div[name="roster2"] > div'
  ) as Maybe<HTMLDivElement>;

  return { rosterOneContainer, rosterTwoContainer };
};

/**
 * Returns an array of individual matchroom player card HTML elements from a specific roster container
 * (compattible /w vanilla and faceit-enhacner layouts).
 */
export const getRosterPlayers = (rosterContainer: HTMLDivElement) => {
  const roster: HTMLDivElement[] = [];

  // omit mappio team average player card
  const nativeRosterElements = rosterContainer.querySelectorAll(
    ":scope > div:not(.mappio.teamAvgMapStats)"
  );

  if (nativeRosterElements.length === 5) {
    // if there are 5 children -> there are no premade parties -> get each child
    nativeRosterElements.forEach((playerCard) => {
      roster.push(playerCard.childNodes[0].childNodes[0] as HTMLDivElement);
    });
  } else if (nativeRosterElements.length === 1) {
    // if there is only 1 child element -> there is a full stack -> get each child of that child element
    const playerCards = nativeRosterElements[0].childNodes;
    playerCards.forEach((playerCard) => {
      roster.push(
        playerCard.childNodes[0].childNodes[0].childNodes[0] as HTMLDivElement
      );
    });
  } else {
    // if the team is a combination of premade parties
    nativeRosterElements.forEach((premadeContainer) => {
      // if the current premade container holds only one player -> get that player's card element
      if ((premadeContainer as HTMLDivElement).childElementCount === 1) {
        roster.push(
          premadeContainer.childNodes[0].childNodes[0] as HTMLDivElement
        );
      } else {
        // if the current premade container contains multiple players -> get each player's card element
        premadeContainer.childNodes.forEach((playerCard) => {
          roster.push(
            playerCard.childNodes[0].childNodes[0]
              .childNodes[0] as HTMLDivElement
          );
        });
      }
    });
  }

  return roster;
};

/**
 * Gets the HTML player card elements taht represent all players in the matchroom.
 */
export const getMatchroomPlayers = () => {
  const { rosterOneContainer, rosterTwoContainer } = getRosterContainers();

  if (!rosterOneContainer || !rosterTwoContainer) return [];

  const mathcroomPlayers = [
    getRosterPlayers(rosterOneContainer),
    getRosterPlayers(rosterTwoContainer),
  ].flat();

  return mathcroomPlayers;
};

/**
 * Gets the HTML element that represents the info section of the matchroom.
 */
export const getInfoElement = () => {
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  return mo?.querySelector('[name="info"]') as HTMLElement | null | undefined;
};

/**
 * Gets a player's nickname by parsing their matchroom HTML player card element (compatible /w vanilla and faceit-enhancer layouts).
 */
export const getNickname = (playerCard: HTMLDivElement) =>
  (
    playerCard.querySelector("span + div") ||
    playerCard.firstChild?.childNodes[1].firstChild?.firstChild
  )?.textContent;

/**
 * Gets the element that contains matchroom maps list and its parent element.
 */
export const getMatchroomMapsElementsParentAndContainer = () => {
  const wrapper = getInfoElement()?.children?.[0].children?.[0];
  const N_OF_CHILDREN = wrapper?.children?.length;

  let parent;
  let container;

  if (N_OF_CHILDREN === 3) {
    // if wrapper contains 3 children -> room is in veto state
    parent = wrapper?.children?.[2];
    container = parent?.children?.[0];
  } else if (N_OF_CHILDREN === 6) {
    // room is in connecting to server state
    const i = N_OF_CHILDREN - 4; // map card element container is always 4th from the end in these states
    parent = wrapper?.children?.[i].children?.[0];
    container = parent?.children?.[3];
  } else if (N_OF_CHILDREN === 5) {
    // room is in match live or match ended state
    const INDEX_LIVE = 1; // map card element container is the second child in live state
    const INDEX_ENDED = 0; // map card elemenet container is the first child in ended state
    // try getting elements for the live case
    parent = wrapper?.children?.[INDEX_LIVE].children?.[0];
    container = parent?.children?.[3];
    if (!parent || !container) {
      // if getting either of the elements was unseccusfull try the other case
      parent = wrapper?.children?.[INDEX_ENDED].children?.[0];
      container = parent?.children?.[3];
    }
  } else if (N_OF_CHILDREN === 4) {
    // room is in match ended long ago (no demo available)
    parent = wrapper?.children?.[0]?.children?.[0];
    container = wrapper?.children?.[0]?.children?.[0]?.children?.[3];
  }

  return [parent, container];
};

/**
 * Gets a list of map card HTML elements.
 */
export const getMatchroomMapsElements = () => {
  const info = getInfoElement();
  const wrapper = info?.children?.[0].children?.[0];
  const N_OF_CHILDREN = wrapper?.children?.length;

  const mapElements: HTMLDivElement[] = [];

  if (N_OF_CHILDREN === 3) {
    // if wrapper contains 3 children -> room is in veto state
    const container = wrapper?.children?.[2].children?.[0];
    container?.childNodes.forEach((mapContainer) => {
      mapElements.push(mapContainer.childNodes[0] as HTMLDivElement);
    });
  } else if (N_OF_CHILDREN === 6) {
    // room is in connecting to server state
    const i = N_OF_CHILDREN - 4; // map card element container is always 4th from the end in this state
    mapElements.push(
      wrapper?.children?.[i]?.children?.[0]?.children?.[3]
        ?.children?.[0] as HTMLDivElement
    );
  } else if (N_OF_CHILDREN === 5) {
    // room is in match live or match ended state
    const INDEX_LIVE = 1; // map card element container is the second child in this state
    const INDEX_ENDED = 0; // map card elemenet container is the first child in this state
    const mapCardElement =
      wrapper?.children?.[INDEX_LIVE]?.children?.[0]?.children?.[3]
        ?.children?.[0] ||
      wrapper?.children?.[INDEX_ENDED]?.children?.[0]?.children?.[3]
        ?.children?.[0];
    if (mapCardElement) mapElements.push(mapCardElement as HTMLDivElement);
  } else if (N_OF_CHILDREN === 4) {
    // room is in match ended long ago (no demo available) state
    const mapCardElement = wrapper?.children?.[0]?.children?.[0]?.children?.[3];
    if (mapCardElement) mapElements.push(mapCardElement as HTMLDivElement);
  }

  return mapElements;
};

/**
 * Gets a map's name by parsing its matchroom HTML map card element.
 */
export const getMapName = (mapCard: HTMLDivElement) =>
  mapCard?.querySelector("div > span")?.textContent;
