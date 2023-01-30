import React from "react";
import useExtensionOption from "../hooks/useExtensionOption";
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
      <ToggleSwitch isToggled={option} onToggle={() => setOption(!option)} />
    </header>
  );
};
export default SettingSectionHeader;
