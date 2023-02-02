import useExtensionOption from "../hooks/useExtensionOption";
import Loading from "./Loading";
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
      <h2>{title}</h2>
      {option === null ? (
        <Loading />
      ) : (
        <ToggleSwitch isToggled={option} onToggle={() => setOption(!option)} />
      )}
    </header>
  );
};
export default SettingSectionHeader;
