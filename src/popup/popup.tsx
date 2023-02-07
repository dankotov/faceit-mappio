import { createRoot } from "react-dom/client";
import "./popup.css";
import About from "./sections/About";
import Header from "./sections/Header";
import PlayerMapStats from "./sections/PlayerMapStats";

const Popup = () => (
  <>
    <div className="app">
      <Header />
      <PlayerMapStats />
      <About />
    </div>

    <style jsx>{`
      .app {
        width: 400px;
        background-color: var(--backblack);

        font-family: "Source Sans Pro", sans-serif;
        color: var(--forewhite);
      }
    `}</style>
  </>
);

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<Popup />);
