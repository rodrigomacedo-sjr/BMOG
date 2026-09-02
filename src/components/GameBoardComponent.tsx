import logo from "@/assets/bmo.svg";
import type { GameBoard } from "@/types";
import { useEffect, useState } from "react";

type GameBoardProps = {
  gameBoard: GameBoard;
};

function getCellEffect(row: number, col: number, size: number, seed: number) {
  const cellValue = (row * 17 + col * 31 + seed) % (size * size);
  const count = 1 + (seed % Math.min(8, size));

  return cellValue < count ? ` cell--shift-${cellValue % 3}` : "";
}

export default function GameBoardComponent({ gameBoard }: GameBoardProps) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeed((current) => current + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="board"
      data-board-size={gameBoard.size}
      style={{
        gridTemplateColumns: `repeat(${gameBoard.size + 1}, minmax(0, 1fr))`,
      }}
    >
      {gameBoard.state.map((row, rowIdx) => {
        let ans = gameBoard.rowAnswerKey[rowIdx];

        return (
          <div className="board__row" key={rowIdx}>
            {row.map((cell, colIdx) => {
              return (
                <div
                  key={colIdx}
                  data-row={rowIdx}
                  data-col={colIdx}
                  className={`cell${getCellEffect(rowIdx, colIdx, gameBoard.size, seed)}`}
                >
                  {cell}
                </div>
              );
            })}

            <div
              key={rowIdx + "ansRow"}
              className={`ans ${ans?.isCorrect ? "correct" : "incorrect"}`}
            >
              {ans?.visual}
            </div>
          </div>
        );
      })}

      {gameBoard.colAnswerKey.map((ans, rowIdx) => (
        <div
          key={rowIdx + "ansCol"}
          className={`ans ${ans?.isCorrect ? "correct" : "incorrect"}`}
        >
          {ans?.visual}
        </div>
      ))}
      <div key="bmo" className="bmo">
        <img src={logo} alt="BMOG logo" className="game-screen__logo" />
      </div>
    </div>
  );
}
