import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import createBoard from "@/game/createBoard";
import { calculateColAnswerKey, calculateRowAnswerKey } from "@/game/utils";
import type { GameBoard, GameOptions } from "@/types";
import { useState } from "react";

type GameScreenProps = {
  gameOptions: GameOptions;
};

function GameScreen({ gameOptions }: GameScreenProps) {
  const [gameBoard, setGameBoard] = useState(createBoard(gameOptions));

  function handleClick(row: number, col: number) {
    setGameBoard((current) => {
      const newState = current.state.map((cells, rowIndex) =>
        rowIndex === row
          ? cells.map((cell, colIndex) =>
              colIndex === col ? (cell === 0 ? 1 : 0) : cell,
            )
          : cells,
      );

      const rowAnswerKey = calculateRowAnswerKey(
        newState,
        current.correctnessMask,
        current.size,
        current.base,
      );

      const colAnswerKey = calculateColAnswerKey(
        newState,
        current.correctnessMask,
        current.size,
        current.base,
      );

      return {
        ...current,
        state: newState,
        rowAnswerKey: rowAnswerKey,
        colAnswerKey: colAnswerKey,
      };
    });
  }

  return (
    // TODO handle give up
    // TODO handle win
    // TODO time??
    // TODO combo??
    <div className="game-screen">
      <h1 className="game-screen__title">Game Screen</h1>
      <InGameMenu onGiveUp={() => console.log("gu")} />
      <GameBoardComponent gameBoard={gameBoard} handleClick={handleClick} />
    </div>
  );
}

export default GameScreen;
