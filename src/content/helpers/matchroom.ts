import { elementExistsIn } from "./utils";

/**
 * Gets the current page's shadow root element.
 */
const getShadowRootElement = () =>
  document.querySelector("#parasite-container")?.shadowRoot;

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
  return pageUrl.includes("/csgo/room/") && !pageUrl.includes("/matchroom");
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
 * Returns an array of individual matchroom player card HTML elements (compattible /w vanilla and faceit-enhacner layouts).
 */
const getRosterList = (rosterContainer: HTMLDivElement) => {
  const roster: HTMLDivElement[] = [];
  if (rosterContainer.childElementCount === 5) {
    // if there are 5 children -> there are no premade parties -> get each child
    rosterContainer.childNodes.forEach((playerCard) => {
      roster.push(playerCard.childNodes[0].childNodes[0] as HTMLDivElement);
    });
  } else if (rosterContainer.childElementCount === 1) {
    // if there is only 1 child element -> there is a full stack -> get each child of that child element
    const playerCards = rosterContainer.childNodes[0].childNodes;
    playerCards.forEach((playerCard) => {
      roster.push(
        playerCard.childNodes[0].childNodes[0].childNodes[0] as HTMLDivElement
      );
    });
  } else {
    // if the team is a combination of premade parties
    rosterContainer.childNodes.forEach((premadeContainer) => {
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
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  const rosterOneContainer =
    mo?.querySelector('[name="roster1"]')?.childNodes[0];
  const rosterTwoContainer =
    mo?.querySelector('[name="roster2"]')?.childNodes[0];

  if (!rosterOneContainer || !rosterTwoContainer) return;

  const rosterOne = getRosterList(rosterOneContainer as HTMLDivElement);
  const rosterTwo = getRosterList(rosterTwoContainer as HTMLDivElement);

  return rosterOne.concat(rosterTwo);
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
  const n_of_children = wrapper?.children?.length;

  let parent;
  let container;

  if (n_of_children === 3) {
    // if wrapper contains 3 children -> room is in veto state
    parent = wrapper?.children?.[2];
    container = parent?.children?.[0];
  } else if (
    n_of_children === 6 || // room is in connecting to server state
    n_of_children === 5 || // room is in match live state
    n_of_children === 4 // room is in match ended state
  ) {
    const i = n_of_children - 4; // map card element container is always 4th from the end in these states
    parent = wrapper?.children?.[i].children?.[0];
    container = parent?.children?.[3];
  }

  return [parent, container];
};

/**
 * Gets a list of map card HTML elements.
 */
export const getMatchroomMapsElements = () => {
  const wrapper = getInfoElement()?.children?.[0].children?.[0];
  const n_of_children = wrapper?.children?.length;

  let mapElements: HTMLDivElement[] = [];

  if (n_of_children === 3) {
    // if wrapper contains 3 children -> room is in veto state
    const container = wrapper?.children?.[2].children?.[0];
    container?.childNodes.forEach((mapContainer) => {
      mapElements.push(mapContainer.childNodes[0] as HTMLDivElement);
    });
  } else if (
    n_of_children === 6 || // room is in connecting to server state
    n_of_children === 5 || // room is in match live state
    n_of_children === 4 // room is in match ended state
  ) {
    const i = n_of_children - 4; // map card element container is always 4th from the end in these states
    mapElements.push(
      wrapper?.children?.[i].children?.[0].children?.[3]
        .children?.[0] as HTMLDivElement
    );
  }

  return mapElements;
};

/**
 * Gets a map's name by parsing its matchroom HTML map card element.
 */
export const getMapName = (mapCard: HTMLDivElement) =>
  mapCard.querySelector("div > span")?.textContent;
