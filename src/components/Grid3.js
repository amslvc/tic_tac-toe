import React, { useState } from "react";
import { exportDefaultSpecifier } from "@babel/types";

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
    function evaluateMove(currentState, emptyFields) {
        let nulls = 0;
        let count = 0;
        let tempmove = {
            move: 0,
            grade: 0
        };
        let grade = 0;
        for (let k = 0; k < emptyFields.length; k++) {
            let tempGame = currentState.slice();
            tempGame[emptyFields[k]] = aiPlayer;
            for (let i = 0; i < winConditions.length; i++) {
                for (let j = 0; j < winConditions[0].length; j++) {
                    if (tempGame[winConditions[i][j]] === aiPlayer) {
                        count++;
                    }
                    else if (tempGame[winConditions[i][j]] === null) nulls++;
                }
                if (count === 3) grade += 100;
                else if (count === 2 && nulls === 1) grade += 10;
                else if (count === 1 && nulls === 2) grade += 1;
                else if (nulls === 2 && count === 0) grade -= 10;
                else if (nulls === 1 && count === 0) grade -= 100;
                else if (nulls === 0 && count === 1) grade += 100;
                count = 0;
                nulls = 0;
            }
            if (tempmove.grade<grade){
                tempmove.move=k;
                tempmove.grade=grade;
        }
        grade=0;
    }
    return tempmove.move;
}

function pcMove(currentState) {
    const emptyFields = currentState.reduce((acc, val, i) => {
        if (val === null) {
            acc.push(i);
        }
        return acc;
    }, []);

    return evaluateMove(currentState, emptyFields);
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

        if (wol !== huPlayer) wol = gameOver(newGame, aiPlayer);
        if (wol !== aiPlayer) wol = gameOver(newGame, huPlayer);


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

            if (wol !== huPlayer) wol = gameOver(newGame, aiPlayer);
            if (wol !== aiPlayer) wol = gameOver(newGame, huPlayer);

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
    if (winner === "D") setDraws(draw + 1);
    setGame(newGame);
    setMoveX(true);
    setWinner(null);
    setWinningLane([]);
}

function gameOver(newGame, player) {
    let count = 0;
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
