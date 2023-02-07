const Link = ({
  url,
  title,
  text,
  img,
}: {
  url: string;
  title: string;
  text?: string;
  img: string;
}) => (
  <>
    <a href={url} className={text ? "lg" : "sm"} target="_blank" title={title}>
      <img src={img}></img>
      {text && <p>{text}</p>}
    </a>

    <style jsx>{`
      a {
        display: flex;
        justify-content: space-around;
        align-items: center;

        height: 25px;
        border-radius: 4px;

        text-decoration: none;
        background-color: var(--backgrey);
        color: var(--foregrey);

        cursor: pointer;
      }

      a:hover {
        background-color: #505050;
      }

      a.sm {
        padding: 2px 4px;
      }

      a.lg {
        padding: 2px 9px;
      }

      a img {
        width: 14px;
      }

      a.lg img {
        margin-right: 6px;
      }
    `}</style>
  </>
);

export default Link;
