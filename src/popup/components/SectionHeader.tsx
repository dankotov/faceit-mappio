import React, { useState } from "react";
import SectionTitle from "./SectionTitle";
import ToggleSwitch from "./ToggleSwitch";

const SectionHeader = ({ title }: { title: string }) => {
  const [isToggled, setIsToggled] = useState(true);

  return (
    <header className="section-header">
      <SectionTitle title={title} />
      <ToggleSwitch
        isToggled={isToggled}
        onToggle={() => setIsToggled(!isToggled)}
      />
    </header>
  );
};
export default SectionHeader;
