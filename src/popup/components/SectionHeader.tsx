/* eslint react/react-in-jsx-scope: 0 */
import { ReactNode } from "react";

const SectionHeader = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode | ReactNode[]; // eslint-disable-line react/require-default-props
}) => (
  <>
    <header>
      <h2>{title}</h2>
      {children}
    </header>

    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      header > h2 {
        font-size: 1.275rem;
      }
    `}</style>
  </>
);

export default SectionHeader;
