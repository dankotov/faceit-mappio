import { ReactNode } from "react";

const SectionHeader = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <>
    <header>{children}</header>

    <style jsx>{`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      header > h2 {
        font-size: 1.8em;
      }
    `}</style>
  </>
);

export default SectionHeader;
