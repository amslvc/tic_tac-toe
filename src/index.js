import React from "react";
import ReactDOM from "react-dom";
import Grid from "./components/Grid";
import Grid2 from "./components/Grid2";
import Grid3 from "./components/Grid3";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Tic-Tac-Toe Player vs. Player</h1>
      <Grid/>
    
      <h1>Tic-Tac-Toe Random Computer vs. Player</h1>
      <Grid2/>

      <h1>Tic-Tac-Toe Player (X) vs. AI Computer (O)</h1>
      <Grid3/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
