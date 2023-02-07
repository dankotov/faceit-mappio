import { ReactNode } from "react";
import Link from "../components/Link";
import Section from "../components/Section";
import SectionDescription from "../components/SectionDescription";
import SectionHeader from "../components/SectionHeader";

const AboutColumn = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode | ReactNode[];
}) => (
  <>
    <div className="about-column-container">
      <h3>{title}</h3>
      {children}
    </div>

    <style jsx>{`
      .about-column-container {
        width: 90px;
      }
      .about-column-container h3 {
        margin-bottom: 5px;
      }
    `}</style>
  </>
);

const About = () => (
  <Section>
    <SectionHeader title="About" />
    <SectionDescription description="Display everyone's map-related information in the matchroom to make more educated decisions during the veto process" />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <AboutColumn title="Donate To">
        <Link
          url="https://childrenheroes.org/en/donations/"
          title="This extension's creator is Ukrainian. If you want to say thanks, please donate to Ukraine. The linked charity helps kids who have lost their parent(s) in the war."
          text="Ukraine"
          img="./assets/ukraine.svg"
        />
      </AboutColumn>
      <AboutColumn title="Reach Out">
        <Link
          url="https://www.reddit.com/r/FACEITmappio/"
          title="FACEIT Mappio Reddit"
          text="Reddit"
          img="./assets/reddit.svg"
        />
      </AboutColumn>
      <AboutColumn title="Creator">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link
            url="https://www.faceit.com/en/players/-koto"
            title="Creator's FACEIT"
            text="-koto"
            img="./assets/faceit.svg"
          />
          <Link
            url="https://github.com/dankotov"
            title="Creator's GitHub"
            img="./assets/github.svg"
          />
        </div>
      </AboutColumn>
    </div>
  </Section>
);

export default About;
