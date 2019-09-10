import React, { useState } from "react";

export default () => {
  let wol;
  let count;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ];

  const [game, setGame] = useState(new Array(9).fill(null));
  const [isMoveX, setMoveX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLane, setWinningLane] = useState([]);
  const [xwins, setXwins] = useState(0);
  const [owins, setOwins] = useState(0);
  const [draw, setDraws] = useState(0);

  function boxClicked(index) {
    if (winner != null) return;

    const newGame = game.slice();
    if (!game[index]) {
      newGame[index] = isMoveX ? "X" : "O";
      setMoveX(!isMoveX);
      setGame(newGame);
    }
    let finished = true;
    wol = gameOver(newGame);

    for (let index = 0; index < newGame.length; index++) {
      if (newGame[index] === null) {
        finished = false;
        break;
      }
    }

    if (wol === "X") {
      setWinner("X");
    } else if (wol === "O") {
      setWinner("O");
    } else if (finished) {
      setWinner("D");
    }
  }

  function reset() {
    const newGame = game.slice().fill(null);
    if (winner === "X") setXwins(xwins + 1);
    if (winner === "O") setOwins(owins + 1);
    if (winner === "D") setDraws(draw + 1);
    setGame(newGame);
    setWinner(null);
    setWinningLane([]);
  }

  function gameOver(newGame) {
    for (let i = 0; i < winConditions.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (newGame[winConditions[i][j]] === "X") {
          count++;
        }
        if (count === 3) {
          setWinningLane(winConditions[i]);
          wol = "X";
          return wol;
        } else wol = "D";
      }
      count = 0;
    }
    for (let i = 0; i < winConditions.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (newGame[winConditions[i][j]] === "O") {
          count++;
        }
        if (count === 3) {
          setWinningLane(winConditions[i]);
          wol = "O";
          return wol;
        } else wol = "D";
      }
      count = 0;
    }
    return wol;
  }
  return (
    <div className="Game">
      <div className="Grid">
        {game.map((value, index) => (
          <div
            onClick={event => {
              boxClicked(event.target.id);
            }}
            key={index}
            className="Box"
            id={index}
            style={{color: winningLane.includes(index) ? "green" : "inherit"}}>
            {value}
          </div>
        ))}
      </div>
      <div>{isMoveX ? <div>X's Turn!</div> : <div>O's Turn!</div>}</div>
      <div>
        {winner && winner !== "D" ? <div>The Winner is {winner}!</div> : null}
        {winner && winner === "D" ? <div>Draw!</div> : null}
      </div>
      <div>
        <button onClick={reset}>New Game</button>
      </div>
      <h3>
        X Wins = {xwins} --- Draws = {draw} --- O Wins = {owins}
      </h3>
    </div>
  );
};
