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

// human
var huPlayer = "X";
// ai
var aiPlayer = "O";
/*
//keeps count of function calls
var fc = 0;

// finding the ultimate play on the game that favors the computer
var bestSpot = minimax(game, aiPlayer);

//loging the results
console.log("index: " + bestSpot.index);
console.log("function calls: " + fc);

// the main minimax function
function minimax(game, player){
  //add one to function calls
  fc++;
  
  //available spots
  var availSpots = emptyIndexies(game);

  // checks for the terminal states such as win, lose, and tie and returning a value accordingly
  if (winning(game, huPlayer)){
     return {score:-10};
  }
	else if (winning(game, aiPlayer)){
    return {score:10};
	}
  else if (availSpots.length === 0){
  	return {score:0};
  }

// an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++){
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    var move = {};
  	move.index = game[availSpots[i]];

    // set the empty spot to the current player
    game[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player === aiPlayer){
      var result = minimax(game, huPlayer);
      move.score = result.score;
    }
    else{
      var result = minimax(game, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    game[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

// if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if(player === aiPlayer){
    var bestScore = -10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

// else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for(var i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

// return the chosen move (object) from the array to the higher depth
  return moves[bestMove];
}

// returns the available spots on the game
function emptyIndexies(game){
  return  game.filter(s => s !== "O" && s !== "X");
}

// winning combinations using the game indexies for instace the first win could be 3 xes in a row
function winning(game, player){
 if (
        (game[0] === player && game[1] === player && game[2] === player) ||
        (game[3] === player && game[4] === player && game[5] === player) ||
        (game[6] === player && game[7] === player && game[8] === player) ||
        (game[0] === player && game[3] === player && game[6] === player) ||
        (game[1] === player && game[4] === player && game[7] === player) ||
        (game[2] === player && game[5] === player && game[8] === player) ||
        (game[0] === player && game[4] === player && game[8] === player) ||
        (game[2] === player && game[4] === player && game[6] === player)
        ) {
        return true;
    } else {
        return false;
    }
}
*/

  function pcMove(game, length){
    var emptyFields = new Array(length).fill(0);
    for (var z=0,u=0; z<=length;z++){
      if (game[z]===null) {
        emptyFields[u]=z;
        u++;
       }
    }

    emptyFields=shuffle(emptyFields);
    var id=emptyFields[0];
    return id;
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

  function boxClicked(index) {
    if (winner != null) return;

    const newGame = game.slice();
    if (!game[index]) {
      if(isMoveX){
      newGame[index] = huPlayer;
      }
      setMoveX(false);
      setGame(newGame);
    
    let finished = true;
    wol = gameOver(newGame);

    for (let index = 0; index < game.length; index++) {
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
    var length=0;
    for (let q=0;q<game.length;q++) {
      if(game[q]===null){
      length++;
      }
    }

    if (!isMoveX) {
      newGame[pcMove(newGame,length)] = aiPlayer;
      setGame(newGame);
      setMoveX(true);
      }

    wol = gameOver(game);
    for (let index = 0; index < newGame.length; index++) {
      if (game[index] === null) {
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
  }

  function reset() {
    const newGame = game.slice().fill(null);
    if (winner === "X") setXwins(xwins + 1);
    if (winner === "O") setOwins(owins + 1);
    if (winner === "D") setDraws(draw + 1);
    setGame(newGame);
    setMoveX(true);
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
