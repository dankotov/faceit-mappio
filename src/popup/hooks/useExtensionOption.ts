import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MappioFeature } from "../../shared/settings";

const useExtensionOption = (
  key: MappioFeature
): [boolean | null, Dispatch<SetStateAction<boolean | null>>] => {
  const [option, setOption] = useState<boolean | null>(null);
  const storageFetchResolved = useRef(false);

  useEffect(() => {
    chrome.storage.local.get(key).then((optionSetting) => {
      storageFetchResolved.current = true;

      const optionValue = optionSetting[key];
      setOption(optionValue);
    });
  }, []);

  useEffect(() => {
    if (!storageFetchResolved.current) return;
    chrome.storage.local.set({ [key]: option });
  }, [option]);

  useEffect(() => {
    const onChange = (changes: any) => {
      if (key in changes) {
        setOption(changes[key].newValue);
      }
    };
    chrome.storage.local.onChanged.addListener(onChange);

    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, [key]);

  return [option, setOption];
};

export default useExtensionOption;
