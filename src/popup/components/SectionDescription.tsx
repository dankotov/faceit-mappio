const SectionDescription = ({ description }: { description: string }) => (
  <>
    <p>{description}</p>

    <style jsx>{`
      p {
        color: var(--foregrey);
        margin-bottom: 8px;
      }
    `}</style>
  </>
);

export default SectionDescription;
