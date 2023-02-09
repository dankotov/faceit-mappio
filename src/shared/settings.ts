export const DEFAULT_SETTINGS = new Map<string, boolean>([
  ["showPlayerMapsStats", true],
]);

export const isFeatureEnabled = (featureName: string) => {
  const featureEnabled = chrome.storage.local
    .get(featureName)
    .then((featureSettingsObject) => featureSettingsObject[featureName]);
  return featureEnabled;
};
