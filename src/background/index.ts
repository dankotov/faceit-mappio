import { DEFAULT_SETTINGS } from "../shared/settings";

chrome.runtime.onInstalled.addListener(() => {
  DEFAULT_SETTINGS.forEach(async (value, featureName) => {
    chrome.storage.local.set({ [featureName]: value });
  });
});
