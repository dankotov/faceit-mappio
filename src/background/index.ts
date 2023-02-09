import { DEFAULT_SETTINGS } from "../shared/settings";

chrome.runtime.onInstalled.addListener(() => {
  DEFAULT_SETTINGS.forEach((value, key) => {
    chrome.storage.local.set({ [key]: value });
  });
});