import { fetchMatchDetails } from "./helpers/faceit-api";
import {
  isMatchroomPage,
  rosterListsLoaded,
  getMatchroomId,
} from "./helpers/matchroom";

const handleMutation = (mutations, observer) => {
  const mainContentElement = document.querySelector("#main-content");

  if (!mainContentElement) {
    console.log("No main content element");
    return;
  }

  if (!isMatchroomPage()) {
    return;
  }

  const matchroomId = getMatchroomId();
  fetchMatchDetails(matchroomId);

  if (!rosterListsLoaded) {
    return;
  }

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode) => {
      if (addedNode.shadowRoot) {
        observer.observe(addedNode.shadowRoot, {
          childList: true,
          subtree: true,
        });
      }
    });
  });
};

const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
