import logo from "@/assets/bmo.svg";
import type { GameBoard } from "@/types";
import InGameMenu from "./InGameMenu";

type GameBoardProps = {
  gameBoard: GameBoard;
};

export default function GameBoardComponent({ gameBoard }: GameBoardProps) {
  return (
    <div className="board">
      {gameBoard.state.map((row, rowIdx) => {
        let ans = gameBoard.rowAnswerKey[rowIdx];

        return (
          <div key={rowIdx}>
            {row.map((cell, colIdx) => (
              <div
                key={colIdx}
                data-row={rowIdx}
                data-col={colIdx}
                className="cell"
              >
                {cell}
              </div>
            ))}

            <div
              key={rowIdx + "ansRow"}
              className={"ans " + ans?.isCorrect ? "correct" : "incorrect"}
            >
              {ans?.visual}
            </div>
          </div>
        );
      })}

      {gameBoard.colAnswerKey.map((ans, rowIdx) => (
        <div
          key={rowIdx + "ansCol"}
          className={"ans " + ans?.isCorrect ? "correct" : "incorrect"}
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
