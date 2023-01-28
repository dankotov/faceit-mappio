import React from "react";
import { createRoot } from "react-dom/client";
import PopupHeader from "./components/PopupHeader";
import "./popup.css";
import PlayerMapStats from "./sections/PlayerMapStats";

const Popup = () => (
  <div className="app">
    <PopupHeader />
    <PlayerMapStats />
  </div>
);

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<Popup />);
