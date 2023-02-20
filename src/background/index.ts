import { DEFAULT_SETTINGS } from "../shared/settings";

chrome.runtime.onInstalled.addListener(() => {
  DEFAULT_SETTINGS.forEach(async (value, featureName) => {
    // get current feature setting
    const featureOldSetting = (await chrome.storage.local.get(featureName))[
      featureName
    ];
    // if feature setting exists -> do nothing
    if (featureOldSetting !== undefined) return;

    // feature setting doesnt exist -> set default
    chrome.storage.local.set({ [featureName]: value });
  });
});
