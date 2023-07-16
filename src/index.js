import React from "react";
import ReactDOM from "react-dom";

import CountApp from "./countupdown";

function App() {
  return <CountApp />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
