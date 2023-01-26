import React from "react";
import { createRoot } from "react-dom/client";

const Popup = () => (
  <div>
    <h1>Hello World!</h1>
  </div>
);

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<Popup />);
