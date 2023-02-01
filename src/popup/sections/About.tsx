import React from "react";
import SectionDescription from "../components/SectionDescription";
import SectionHeaderDefault from "../components/SectionHeaderDefault";

const About = () => (
  <section className="section">
    <SectionHeaderDefault title="About" />
    <SectionDescription description="Display everyone's map-related information in the matchroom to make more educated decisions during the veto process" />
  </section>
);

export default About;
