import React from "react";
import SectionTitle from "./SectionTitle";
import ToggleSwitch from "./ToggleSwitch";

const SectionHeader = ({ title }: { title: string }) => (
  <header className="section-header">
    <SectionTitle title={title} />
    <ToggleSwitch />
  </header>
);

export default SectionHeader;
