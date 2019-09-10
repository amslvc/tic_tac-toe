import React from "react";
import ReactDOM from "react-dom";
import Grid from "./components/Grid";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <Grid />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
