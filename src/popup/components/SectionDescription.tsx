import { colors } from "../../shared/theme";

const SectionDescription = ({ description }: { description: string }) => (
  <>
    <p>{description}</p>

    <style jsx>{`
      p {
        color: ${colors.foregrey};
        margin-bottom: 8px;
      }
    `}</style>
  </>
);

export default SectionDescription;
