"use client";
import { Chess } from "chess.js";
import React, { useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Engine } from "./Engine";

const buttonStyle = {
  padding: "10px 20px",
  margin: "10px",
  border: "none",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const boardWrapper = {
  height: "100vh",
  backgroundColor: "#f0d9b5",
};

const HomePage = () => {
  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 18,
  };
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }: { bestMove: string }) => {
      if (bestMove) {
        // In latest chess.js versions you can just write ```game.move(bestMove)```
        // game.move({
        //   from: bestMove.substring(0, 2),
        //   to: bestMove.substring(2, 4),
        //   promotion: bestMove.substring(4, 5),
        // });
        game.move(bestMove);
        // console.log("bestMove", bestMove);
        setGamePosition(game.fen());
      }
    });
  }

  function onDrop(sourceSquare: any, targetSquare: any, piece: any) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.isGameOver() || game.isDraw()) return false;

    findBestMove();

    return true;
  }

  return (
    <div style={boardWrapper} className="flex flex-col items-center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(levels).map(([level, depth]) => (
          <button
            key={depth}
            style={{
              ...buttonStyle,
              backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
            }}
            onClick={() => setStockfishLevel(depth)}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="w-2/3">
        <Chessboard
          id="PlayVsStockfish"
          position={gamePosition}
          onPieceDrop={onDrop}
        />
      </div>
      <div>
        <button
          style={{ ...buttonStyle, backgroundColor: "#B58863" }}
          onClick={() => {
            game.reset();
            setGamePosition(game.fen());
          }}
        >
          New game
        </button>
        <button
          style={{ ...buttonStyle, backgroundColor: "#B58863" }}
          onClick={() => {
            game.undo();
            setGamePosition(game.fen());
          }}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default HomePage;
