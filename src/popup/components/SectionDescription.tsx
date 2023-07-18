/* eslint react/react-in-jsx-scope: 0 */
import colors from "../../shared/theme";

const SectionDescription = ({ description }: { description: string }) => (
  <>
    <p>{description}</p>

    <style jsx>{`
      p {
        color: ${colors.foregrey};
        margin-bottom: 8px;
        font-size: 0.75rem;
      }
    `}</style>
  </>
);

export default SectionDescription;
