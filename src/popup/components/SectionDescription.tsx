const SectionDescription = ({ description }: { description: string }) => (
  <>
    <p>{description}</p>

    <style jsx>{`
      p {
        color: #a0a0a0;
        margin-bottom: 8px;
      }
    `}</style>
  </>
);

export default SectionDescription;
