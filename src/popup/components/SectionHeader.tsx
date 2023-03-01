import { ReactNode } from "react";

const SectionHeader = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode | ReactNode[];
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
        font-size: 1.7em;
      }
    `}</style>
  </>
);

export default SectionHeader;
