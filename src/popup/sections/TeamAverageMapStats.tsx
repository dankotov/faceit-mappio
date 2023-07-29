/* eslint react/react-in-jsx-scope: 0 */
import { MappioFeature } from "../../shared/settings";
import Section from "../components/Section";
import SectionDescription from "../components/SectionDescription";
import SettingHeader from "../components/SettingHeader";

const TeamAverageMapStats = () => (
  <Section>
    <SettingHeader
      title="Team Average Map Stats"
      settingKey={MappioFeature.TeamAverageMapStats}
    />
    <SectionDescription description="Display team average statistics (number of games and average K/D) for each map in the match room." />
  </Section>
);

export default TeamAverageMapStats;
