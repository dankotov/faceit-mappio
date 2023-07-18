import { createRoot } from "react-dom/client";
import colors from "../shared/theme";
import "./popup.css";
import About from "./sections/About";
import Header from "./sections/Header";
import MapDropProbabilities from "./sections/MapDropProbabilities";
import PlayerMapStats from "./sections/PlayerMapStats";

const Popup = () => (
  <>
    <div className="app">
      <Header />
      <PlayerMapStats />
      <MapDropProbabilities />
      <About />
    </div>

    <style jsx>{`
      .app {
        width: 400px;
        background-color: ${colors.backblack};

        font-family: "Source Sans Pro", sans-serif;
        color: ${colors.forewhite};
      }
    `}</style>
  </>
);

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<Popup />);
