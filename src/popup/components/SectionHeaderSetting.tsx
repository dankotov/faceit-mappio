import useExtensionOption from "../hooks/useExtensionOption";
import Loading from "./Loading";
import SectionHeader from "./SectionHeader";
import Toggle from "./Toggle";

const SettingSectionHeader = ({
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
export default SettingSectionHeader;
