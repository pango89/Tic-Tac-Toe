import React, { useState } from "react";
import "./index.css";
import Board from "./Board";

const Game: React.FC<{}> = () => {
  const boardArray: string[][] = [Array(9).fill(null)];
  const [history, setHistory] = useState(boardArray);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move ? "Move #" + move : "Game Start";
    return (
      <li key={move}>
        <button className="button" onClick={() => jumpTo(move)}>
          {desc}
        </button>
      </li>
    );
  });

  const getWinner = (squares: string[]): string | null => {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let line of winningLines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const isMatchTied = (squares: string[]): boolean => {
    for (let square of squares) {
      if (square === null) {
        return false;
      }
    }
    return true;
  };

  const handleClick = (i: number): void => {
    const boardSequence = history.slice(0, stepNumber + 1);
    const board = boardSequence[boardSequence.length - 1];
    const boardCopy = board.slice();
    if (boardCopy[i] || getWinner(boardCopy)) {
      return;
    }

    boardCopy[i] = xIsNext ? "X" : "O";
    const updatedHistory = boardSequence.concat([boardCopy]);

    setHistory(updatedHistory);
    setStepNumber(boardSequence.length);
    setXIsNext(!xIsNext);
  };

  const board = history[stepNumber];

  const winner = getWinner(board);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    const isTied = isMatchTied(board);
    if (isTied) {
      status = "No Winner. Match Tied!";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={board} handleClick={i => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
