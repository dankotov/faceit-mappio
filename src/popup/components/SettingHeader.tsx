import useExtensionOption from "../hooks/useExtensionOption";
import Loading from "./Loading";
import SectionHeader from "./SectionHeader";
import Toggle from "./Toggle";

const SettingHeader = ({
  title,
  settingKey,
}: {
  title: string;
  settingKey: string;
}) => {
  const [option, setOption] = useExtensionOption(settingKey);

  return (
    <SectionHeader title={title}>
      {option === null ? (
        <Loading />
      ) : (
        <Toggle isToggled={option} onToggle={() => setOption(!option)} />
      )}
    </SectionHeader>
  );
};
export default SettingHeader;
