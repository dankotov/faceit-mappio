import { DEFAULT_SETTINGS } from "../shared/settings";

chrome.runtime.onInstalled.addListener(() => {
  DEFAULT_SETTINGS.forEach((value, key) => {
    console.log("setting here", key, value);
    chrome.storage.local.set({ [key]: value }).then(() => {
      chrome.storage.local.get(key).then((result) => {
        console.log("getting here: ", result[key]);
      });
    });
  });
});
