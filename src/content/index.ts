import { isFeatureEnabled } from "../shared/settings";
import debounceAddPlayerMapStats from "./features/addPlayerMapStats";
import { memFetchAllMatchPlayersMapStats } from "./helpers/faceit-api";
import {
  getMatchroomId,
  hasMainContentElement,
  isMatchroomOverviewLoaded,
  isMatchroomPage,
  isShadowRootLoaded,
} from "./helpers/matchroom";

const handleMutation = async (
  mutations: MutationRecord[],
  observer: MutationObserver
) => {
  // If not page of interest -> do nothing
  if (!hasMainContentElement() || !isMatchroomPage()) return;

  const matchroomId = getMatchroomId();
  // Start fetching and memoize player details before page fully loaded
  memFetchAllMatchPlayersMapStats(matchroomId);

  // If page is not fully loaded yet -> do nothing
  if (!isShadowRootLoaded() || !isMatchroomOverviewLoaded()) return;

  // When page fully loaded, add player statistics if the respective feature is on
  if (await isFeatureEnabled("showPlayerMapsStats"))
    debounceAddPlayerMapStats(matchroomId);

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((addedNode: any) => {
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
