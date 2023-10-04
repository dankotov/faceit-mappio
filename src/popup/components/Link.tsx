/* eslint react/react-in-jsx-scope: 0 */
import colors from "../../shared/theme";

const Link = ({
  href,
  title,
  text = "",
  img,
}: {
  href: string;
  title: string;
  text?: string; // eslint-disable-line react/require-default-props
  img: string;
}) => (
  <>
    <a
      href={href}
      className={text ? "lg" : "sm"}
      target="_blank"
      title={title}
      rel="noreferrer"
    >
      <img src={img} alt={title} />
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
        background-color: ${colors.backgrey};
        color: ${colors.foregrey};

        cursor: pointer;
      }

      a:hover {
        background-color: ${colors.backlightgrey};
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

      a p {
        font-size: 0.75rem;
      }
    `}</style>
  </>
);

export default Link;
