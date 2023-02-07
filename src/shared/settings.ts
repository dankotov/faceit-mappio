export const DEFAULT_SETTINGS = new Map<string, boolean>([
  ["showPlayerMapsStats", true],
]);

export const isFeatureEnabled = async (featureName: string) => {
  const featureSettingsObject = await chrome.storage.local.get(featureName);
  return featureSettingsObject[featureName];
};
