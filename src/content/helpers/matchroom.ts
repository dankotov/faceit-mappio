import { elementExistsIn } from "./utils";

/**
 * Gets the current page's shadow root element.
 *
 * @returns {HTMLDivElement} The matchroom's shadow root element.
 */
const getShadowRootElement = () =>
  document.querySelector("#parasite-container")?.shadowRoot;

/**
 * Checks if the current page has a main content element.
 *
 * @returns {boolean} Boolean that represents whether the current page has a main content element.
 */
export const hasMainContentElement = () => {
  const mainContentElement = document.querySelector("#main-content");
  if (!mainContentElement) return false;

  return true;
};

/**
 * Checks if current page is the matchroom page.
 *
 * @returns {boolean} Boolean that represents whether the current page is the matchroom page.
 */
export const isMatchroomPage = () => {
  const pageUrl = document.location.href;
  return pageUrl.includes("/csgo/room/") && !pageUrl.includes("/matchroom");
};

/**
 * Checks if the current page's shadow root element is loaded.
 *
 * @returns {boolean} Boolean that represents whether the current page's shadow root is loaded.
 */
export const isShadowRootLoaded = () => getShadowRootElement() !== null;

/**
 * Checks if the current page's matchroom overview element is loaded.
 *
 * @returns {boolean} Boolean that represents whether the current page's matchroom overview element is loaded.
 */
export const isMatchroomOverviewLoaded = () =>
  getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW") !== null;

/**
 * Checks if the current page's roster lists elements are loaded.
 *
 * @returns {boolean} Boolean that represents whether the current page's roster lists elements are loaded.
 */
export const rosterListsLoaded = () => {
  const sr = getShadowRootElement()!;
  return (
    elementExistsIn('[name="roster1"]', sr) &&
    elementExistsIn('[name="roster2"]', sr)
  );
};

/**
 * Gets the current matchroom's ID from the URL
 * @returns {string} The current matchroom's ID
 */
export const getMatchroomId = (): string => {
  const pageUrl = document.location.href;

  const startIndex = pageUrl.indexOf("/room/") + 6;
  const idLength = 38;

  return pageUrl.substring(startIndex, startIndex + idLength);
};

/**
 * Returns an array of individual matchroom player card HTML elements (compattible /w vanilla and faceit-enhacner layouts).
 *
 * @param {HTMLDivElement} [rosterContainer] HTML container element that holds the team member elements.
 * @returns {Array.<HTMLDivElement>} Array of indiviual player card HTML elements.
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
      roster.push(playerCard.childNodes[0] as HTMLDivElement);
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
 *
 * @return {Array.<HTMLDivElement>} Array of HTML elements that represent all players' player cards in the matchroom.
 */
export const getMatchroomPlayers = () => {
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  const rosterOne = getRosterList(
    mo?.querySelector('[name="roster1"]')?.childNodes[0] as HTMLDivElement
  );
  const rosterTwo = getRosterList(
    mo?.querySelector('[name="roster2"]')?.childNodes[0] as HTMLDivElement
  );

  return rosterOne.concat(rosterTwo);
};

/**
 * Gets the HTML player card elements that represent the captains of each team in the matchroom.
 *
 * @returns {Array.<HTMLDivElement>} Array of HTML elements that represent the captains of each team in the matchroom.
 */
export const getCaptainElements = () => {
  const players = getMatchroomPlayers();
  return [players[0], players[5]];
};

/**
 * Gets the HTML element that represents the info section of the matchroom.
 *
 * @returns {HTMLDivElement} HTML element that represents the info section of the matchroom.
 */
export const getInfoElement = () => {
  const mo = getShadowRootElement()?.querySelector("#MATCHROOM-OVERVIEW");

  return mo?.querySelector('[name="info"]');
};

/**
 * Gets a player's nickname by parsing their matchroom HTML player card element (compattible /w vanilla and faceit-enhancer layouts).
 *
 * @param {HTMLDivElement} [playerCard] The player's HTML player card element.
 * @returns {string} The player's nickame.
 */
export const getNickname = (playerCard: HTMLDivElement) =>
  (
    playerCard.querySelector("span + div") ||
    playerCard.firstChild?.childNodes[1].firstChild?.firstChild
  )?.textContent;
