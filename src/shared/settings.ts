export enum MappioFeature {
  PlayerMapStats = "showPlayerMapsStats",
}

export const DEFAULT_SETTINGS = new Map<MappioFeature, boolean>([
  [MappioFeature.PlayerMapStats, true],
]);

export const isFeatureEnabled = async (featureName: MappioFeature) => {
  const featureSettingsObject = await chrome.storage.local.get(featureName);
  return featureSettingsObject[featureName];
};
