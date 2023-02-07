import useExtensionOption from "../hooks/useExtensionOption";
import Loading from "./Loading";
import SectionHeader from "./SectionHeader";
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
    <SectionHeader>
      <h2>{title}</h2>
      {option === null ? (
        <Loading />
      ) : (
        <ToggleSwitch isToggled={option} onToggle={() => setOption(!option)} />
      )}
    </SectionHeader>
  );
};
export default SettingSectionHeader;
