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
        [2, 4, 6]
    ];

    const [game, setGame] = useState(new Array(9).fill(null));
    const [isMoveX, setMoveX] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLane, setWinningLane] = useState([]);
    const [xwins, setXwins] = useState(0);
    const [owins, setOwins] = useState(0);
    const [draws, setDraws] = useState(0);
    const [firstMove, setfirstMove] = useState(true);
    const [isForkTry, setIsForkTry] = useState(true);

    // human
    let huPlayer = "X";
    // ai
    let aiPlayer = "O";
    // draw
    let draw = "D";

    function pcMove(currentState) {
        let nulls = 0;
        let num_of_ai = 0;
        let num_of_hu = 0;
        let tempmove = {
            move: 0,
            grade: 0
        };
        let corners = [0, 2, 6, 8]
        let diagonalCorners = [
            [0, 8],
            [2, 6]]
        let sides = [1, 3, 5, 7];
        let middle = 4;

        if (firstMove) {
            setfirstMove(false);
            for (let l = 0; l < corners.length; l++) {
                if (currentState[corners[l]] === huPlayer) {
                    return middle;
                }
            }
        }
        if (isForkTry) {
            setIsForkTry(false);
            for (let q = 0; q < diagonalCorners.length; q++) {
                let cCorners=0;
                for (let p = 0; p<diagonalCorners[q].length; p++){
                    if(currentState[diagonalCorners[q][p]]===huPlayer)cCorners++;
                    if(cCorners>=2){
                        return sides[0];
                    }
                }
            }
        }

        for (let k = 0; k < currentState.length; k++) {
            let grade = 0;
            if (currentState[k] === aiPlayer || currentState[k] === huPlayer) { continue };
            let tempGame = currentState.slice();
            tempGame[k] = aiPlayer;
            for (let i = 0; i < winConditions.length; i++) {
                for (let j = 0; j < winConditions[0].length; j++) {
                    if (tempGame[winConditions[i][j]] === aiPlayer) num_of_ai++;
                    if (tempGame[winConditions[i][j]] === huPlayer) num_of_hu++;
                    if (tempGame[winConditions[i][j]] === null) nulls++;
                    if (num_of_ai === 3 && nulls === 0 && num_of_hu === 0) return k;
                }
                if (nulls === 0 && num_of_ai === 1 && num_of_hu === 2) grade += 1000;
                if (nulls === 1 && num_of_ai === 0 && num_of_hu === 2) { break; }
                if (num_of_ai === 2 && nulls === 1 && num_of_hu === 0) grade += 100;
                if (num_of_ai === 1 && nulls === 2 && num_of_hu === 0) grade += 1;
                if (num_of_ai === 1 && nulls === 1 && num_of_hu === 1) grade += 10;
                if (nulls === 2 && num_of_ai === 0 && num_of_hu === 1) grade -= 1;

                num_of_ai = 0;
                num_of_hu = 0;
                nulls = 0;
            }
            if (tempmove.grade < grade) {
                tempmove.move = k;
                tempmove.grade = grade;
            }
        }
        return tempmove.move;
    }
    /*
        //check if the human player can make a fork with his next move
        function checkFork(currentState) {
            let num_of_hu = 0;
            let forkCounter = 0;
            for (let m = 0; m < currentState.length; m++) {
                if (currentState[m] === aiPlayer || currentState[m] === huPlayer) { continue };
                let tempState = currentState.slice();
                tempState[m] = huPlayer;
                for (let n = 0; n < winConditions.length; n++) {
                    for (let o = 0; o < winConditions[0].length; o++) {
                        if (tempState[winConditions[n][o]] === huPlayer) num_of_hu++
                        if (num_of_hu === 2) forkCounter++;
                    }
                    if (forkCounter >= 2) return true;
                }
                forkCounter = 0;
    
            }
            return false;
        }
        */

    function boxClicked(index) {
        if (winner != null) return;
        const newGame = game.slice();

        //Human move
        if (!game[index]) {
            newGame[index] = huPlayer;
            setMoveX(false);
            setGame(newGame);

            checkGameState(newGame);

            //Pc Move
            if (winner === null) {
                if (wol !== huPlayer && wol !== draw && !(checkGameState(newGame))) {
                    //debugger;
                    newGame[pcMove(newGame)] = aiPlayer;
                    //debugger;
                    setGame(newGame);
                    setMoveX(true);
                }
            }
            checkGameState(newGame);
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
        setfirstMove(true);
        setIsForkTry(true);
    }

    function checkGameState(newGame) {
        let finished = true;

        if (wol !== huPlayer) wol = gameOver(newGame, aiPlayer);
        if (wol !== aiPlayer) wol = gameOver(newGame, huPlayer);

        for (let index = 0; index < newGame.length; index++) {
            if (newGame[index] === null) {
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
        return finished;
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
