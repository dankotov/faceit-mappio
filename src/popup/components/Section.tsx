import { ReactNode } from "react";

const Section = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <>
    <section>{children}</section>

    <style jsx>{`
      section {
        display: flex;
        flex-direction: column;
        padding: 15px 20px;
        border-bottom: 1px solid var(--backgrey);
      }

      section:last-of-type {
        border: none;
      }
    `}</style>
  </>
);

export default Section;
