import React, { useState } from "react";

export default () => {
  let wol;

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
  const [draws, setDraws] = useState(0);

  // human
  let huPlayer = "X";
  // ai
  let aiPlayer = "O";
  // draw
  let draw = "D";
 
  function pcMove(currentState) {
    const emptyFields = currentState.reduce((acc, val, i) => {
      if (val === null) {
        acc.push(i);
      }
      return acc;
    }, []);
    const randomIndex=Math.floor(Math.random() * emptyFields.length);
    return emptyFields[randomIndex];
  }


  function boxClicked(index) {
    if (winner != null) return;

    const newGame = game.slice();
    if (!game[index]) {
      newGame[index] = huPlayer;
      setMoveX(false);
      setGame(newGame);

      let finished = true;
    
      for (let index = 0; index < game.length; index++) {
        if (newGame[index] === null) {
          finished = false;
          break;
        }
      }

      if(wol !== huPlayer) wol = gameOver(newGame, aiPlayer);
      if(wol !== aiPlayer) wol = gameOver(newGame, huPlayer);
      

      if (wol === huPlayer) {
        setWinner(huPlayer);
      } else if (wol === aiPlayer) {
        setWinner(aiPlayer);
      } else if (finished) {
        setWinner(draw);
      }
      let length = 0;
      for (let q = 0; q < game.length; q++) {
        if (game[q] === null) {
          length++;
        }
      }
      if (winner === null) {
        if (wol !== huPlayer) {
          newGame[pcMove(newGame)] = aiPlayer;
          setGame(newGame);
          setMoveX(true);
        }

        if(wol !== huPlayer)wol = gameOver(newGame, aiPlayer);
        if(wol !== aiPlayer)wol = gameOver(newGame, huPlayer);

        for (let index = 0; index < newGame.length; index++) {
          if (game[index] === null) {
            finished = false;
            break;
          }
        }

        if (wol === huPlayer) {
          setWinner(huPlayer);
        } else if (wol === aiPlayer) {
          setWinner(aiPlayer);
        } else if (finished) {
          setWinner(draw);
        }

      }
    }
  }

  function reset() {
    const newGame = game.slice().fill(null);
    if (winner === huPlayer) setXwins(xwins + 1);
    if (winner === aiPlayer) setOwins(owins + 1);
    if (winner === "D") setDraws(draws + 1);
    setGame(newGame);
    setMoveX(true);
    setWinner(null);
    setWinningLane([]);
  }

  function gameOver(newGame, player) {
    let count=0;
    for (let i = 0; i < winConditions.length; i++) {
      for (let j = 0; j < winConditions[0].length; j++) {
        if (newGame[winConditions[i][j]] === player) {
          count++;
        }
        if (count === 3) {
          setWinningLane(winConditions[i]);
          console.log(winningLane);
          wol = player;
          return wol;
        }
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
            style={{ color: winningLane.includes(index) ? "green" : "inherit" }}>
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
        X Wins = {xwins} --- Draws = {draws} --- O Wins = {owins}
      </h3>
    </div>
  );
};
