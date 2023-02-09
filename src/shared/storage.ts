const storage = {
  get: (key: string, defaultValue: any) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (res) => {
        const err = chrome.runtime.lastError;
        if (err) return reject(err);
        resolve(res[key]);
      });
    });
  },
  set: (key: string, value: any) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        const err = chrome.runtime.lastError;
        if (err) return reject(err);
        else resolve();
      });
    });
  },
};

export default storage;
