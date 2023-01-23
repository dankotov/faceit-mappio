import { debounceAddMapDropProbabilities } from "./features/addMapDropProbabilities";
import { debounceAddPlayerMapStats } from "./features/addPlayerMapStats";
import { fetchMemoizedPlayerDetails } from "./helpers/faceit-api";
import {
  isMatchroomPage,
  getMatchroomId,
  isShadowRootLoaded,
  isMatchroomOverviewLoaded,
} from "./helpers/matchroom";

const handleMutation = (mutations, observer) => {
  const mainContentElement = document.querySelector("#main-content");

  if (!mainContentElement || !isMatchroomPage()) {
    return;
  }

  const matchroomId = getMatchroomId();
  fetchMemoizedPlayerDetails(matchroomId);

  if (!isShadowRootLoaded()) {
    return;
  }

  if (!isMatchroomOverviewLoaded()) {
    return;
  }

  debounceAddPlayerMapStats(matchroomId);

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
