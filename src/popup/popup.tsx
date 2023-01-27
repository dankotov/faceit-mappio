import React from "react";
import { createRoot } from "react-dom/client";
import PopupHeader from "./components/PopupHeader";
import SectionHeader from "./components/SectionHeader";
import "./popup.css";

const Popup = () => (
  <div className="app">
    <PopupHeader />
    <SectionHeader title="Player Map Stats" />
  </div>
);

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(<Popup />);
