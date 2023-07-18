/* eslint react/react-in-jsx-scope: 0 */
import { MappioFeature } from "../../shared/settings";
import Section from "../components/Section";
import SectionDescription from "../components/SectionDescription";
import SettingHeader from "../components/SettingHeader";

const PlayerMapStats = () => (
  <Section>
    <SettingHeader
      title="Map Drop Probabilities"
      settingKey={MappioFeature.MapDropProbabilities}
    />
    <SectionDescription description="Display percentage probability of the opposing team captain dropping each map during the veto process." />
  </Section>
);

export default PlayerMapStats;
