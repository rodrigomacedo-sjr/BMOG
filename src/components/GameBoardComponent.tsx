import logo from "@/assets/bmo.svg";
import type { GameBoard } from "@/types";
import { Fragment, useEffect, useState } from "react";

type GameBoardProps = {
  gameBoard: GameBoard;
  handleClick: (row: number, col: number) => void;
};

function getCellEffect(row: number, col: number, size: number, seed: number) {
  const cellValue = (row * 17 + col * 31 + seed) % (size * size);
  const count = 1 + (seed % (size * 2));

  return cellValue < count ? ` cell--shift-${cellValue % 3}` : "";
}

function isGroupBoundary(index: number, size: number) {
  return index < size - 1 && (size - index - 1) % 4 === 0;
}

function getBoardColumns(size: number) {
  return `${Array.from(
    { length: size },
    (_, index) =>
      `minmax(0, 1fr)${isGroupBoundary(index, size) ? " var(--group-gap)" : ""}`,
  ).join(" ")} minmax(0, 1fr)`;
}

export default function GameBoardComponent({
  gameBoard,
  handleClick,
}: GameBoardProps) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeed((current) => current + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function handleBoardClick(event: React.MouseEvent<HTMLDivElement>) {
    const cell =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>(".cell")
        : null;

    if (!cell) return;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    handleClick(row, col);
  }

  return (
    <div
      className="board"
      onClick={handleBoardClick}
      data-board-size={gameBoard.size}
      style={{
        gridTemplateColumns: getBoardColumns(gameBoard.size),
      }}
    >
      {gameBoard.state.map((row, rowIdx) => {
        let ans = gameBoard.rowAnswerKey[rowIdx];

        return (
          <div className="board__row" key={rowIdx}>
            {row.map((cell, colIdx) => {
              return (
                <Fragment key={colIdx}>
                  <div
                    key={colIdx}
                    data-row={rowIdx}
                    data-col={colIdx}
                    className={`cell${getCellEffect(rowIdx, colIdx, gameBoard.size, seed)}`}
                  >
                    {cell}
                  </div>
                  {isGroupBoundary(colIdx, gameBoard.size) && (
                    <div className="board__column-spacer" />
                  )}
                </Fragment>
              );
            })}

            <div
              key={rowIdx + "ansRow"}
              className={`ans ${ans?.isCorrect ? "correct" : "incorrect"}`}
            >
              {ans?.visual}
            </div>
            {isGroupBoundary(rowIdx, gameBoard.size) && (
              <div className="board__row-spacer" />
            )}
          </div>
        );
      })}

      {gameBoard.colAnswerKey.map((ans, colIdx) => (
        <Fragment key={colIdx}>
          <div className={`ans ${ans?.isCorrect ? "correct" : "incorrect"}`}>
            {ans?.visual}
          </div>
          {isGroupBoundary(colIdx, gameBoard.size) && (
            <div className="board__column-spacer" />
          )}
        </Fragment>
      ))}
      <div key="bmo" className="bmo">
        <img src={logo} alt="BMOG logo" className="game-screen__logo" />
      </div>
    </div>
  );
}
