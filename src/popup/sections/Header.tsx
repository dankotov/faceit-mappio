import { colors } from "../../shared/theme";

const Header = () => (
  <>
    <header>
      <img src="./assets/icons/icon.svg" alt="FACEIT Mappio Logo" />
      <h1>FACEIT Mappio</h1>
    </header>

    <style jsx>{`
      header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px 0px;
        border-bottom: 1px solid ${colors.backgrey};
      }

      header > img {
        min-height: 48px;
        height: 48px;
      }

      header > h1 {
        margin-top: 10px;
        font-size: 1.5rem;
      }
    `}</style>
  </>
);

export default Header;
