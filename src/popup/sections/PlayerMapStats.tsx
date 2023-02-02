import SectionDescription from "../components/SectionDescription";
import SectionHeaderSetting from "../components/SectionHeaderSetting";

const PlayerMapStats = () => (
  <section className="section">
    <SectionHeaderSetting
      title="Player Map Stats"
      settingKey="showPlayerMapsStats"
    />
    <SectionDescription description="Display player statistics (number of games and average K/D) for each map in the match room player cards." />
  </section>
);

export default PlayerMapStats;
