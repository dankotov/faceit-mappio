import { MappioFeature } from "../../shared/settings";
import Section from "../components/Section";
import SectionDescription from "../components/SectionDescription";
import SettingHeader from "../components/SettingHeader";

const PlayerMapStats = () => (
  <Section>
    <SettingHeader
      title="Player Map Stats"
      settingKey={MappioFeature.PlayerMapStats}
    />
    <SectionDescription description="Display player statistics (number of games and average K/D) for each map in the match room player cards." />
  </Section>
);

export default PlayerMapStats;
