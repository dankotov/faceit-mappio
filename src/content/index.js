import {
  isMatchroomPage,
  rosterListsLoaded,
  getMatchroomId,
} from "./helpers/matchroom";

const observeBody = () => {
  const observer = new MutationObserver((mutations) => {
    const mainContentElement = document.querySelector("#main-content");

    if (mainContentElement) {
      if (isMatchroomPage()) {
        console.log("THIS IS MATCHROOM OVERVIEW PAGE");
        console.log(getMatchroomId());
        if (rosterListsLoaded()) {
          console.log("ROSTER LISTS LOADED");
        } else {
          console.log("ROSTER LISTS NOT YET LOADED");
        }
      }
    } else {
      console.log("THIS PAGE DOESNT HAVE A mainContentElement");
    }

    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.shadowRoot) {
          observer.observe(addedNode.shadowRoot, {
            childList: true,
            subtree: true,
          });
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

observeBody();
