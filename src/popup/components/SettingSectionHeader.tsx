import React from "react";
import useExtensionOption from "../hooks/useExtensionOption";
import Loading from "./Loading";
import SectionTitle from "./SectionTitle";
import ToggleSwitch from "./ToggleSwitch";

const SettingSectionHeader = ({
  title,
  settingKey,
}: {
  title: string;
  settingKey: string;
}) => {
  const [option, setOption] = useExtensionOption(settingKey);

  return (
    <header className="section-header">
      <SectionTitle title={title} />
      {option === null ? (
        <Loading />
      ) : (
        <ToggleSwitch isToggled={option} onToggle={() => setOption(!option)} />
      )}
    </header>
  );
};
export default SettingSectionHeader;
