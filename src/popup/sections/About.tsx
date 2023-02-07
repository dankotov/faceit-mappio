import { ReactNode } from "react";
import LinkRectangle from "../components/LinkRectangle";
import Section from "../components/Section";
import SectionDescription from "../components/SectionDescription";
import SectionHeaderDefault from "../components/SectionHeaderDefault";

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
    <SectionHeaderDefault title="About" />
    <SectionDescription description="Display everyone's map-related information in the matchroom to make more educated decisions during the veto process" />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <AboutColumn title="Donate To">
        <LinkRectangle
          link="https://childrenheroes.org/en/donations/"
          title="This extension's creator is Ukrainian. If you want to say thanks, please donate to Ukraine. The linked charity helps kids who have lost their parent(s) in the war."
          text="Ukraine"
          img="./assets/ukraine.svg"
        />
      </AboutColumn>
      <AboutColumn title="Reach Out">
        <LinkRectangle
          link="https://www.reddit.com/r/FACEITmappio/"
          title="FACEIT Mappio Reddit"
          text="Reddit"
          img="./assets/reddit.svg"
        />
      </AboutColumn>
      <AboutColumn title="Creator">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <LinkRectangle
            link="https://www.faceit.com/en/players/-koto"
            title="Creator's FACEIT"
            text="-koto"
            img="./assets/faceit.svg"
          />
          <LinkRectangle
            link="https://github.com/dankotov"
            title="Creator's GitHub"
            img="./assets/github.svg"
          />
        </div>
      </AboutColumn>
    </div>
  </Section>
);

export default About;
