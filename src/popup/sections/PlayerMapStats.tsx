import React from "react";
import SectionDescription from "../components/SectionDescription";
import SettingSectionHeader from "../components/SettingSectionHeader";

const PlayerMapStats = () => (
  <section className="section">
    <SettingSectionHeader
      title="Player Map Stats"
      settingKey="showPlayerMapsStats"
    />
    <SectionDescription description="Display player statistics (number of games and average K/D) for each map in the match room player cards." />
  </section>
);

export default PlayerMapStats;
