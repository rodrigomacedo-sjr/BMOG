import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import createBoard from "@/game/createBoard";
import { calculateColAnswerKey, calculateRowAnswerKey } from "@/game/utils";
import type { GameOptions } from "@/types";
import { useEffect, useState } from "react";

type GameScreenProps = {
  gameOptions: GameOptions;
};

function GameScreen({ gameOptions }: GameScreenProps) {
  const [gameBoard, setGameBoard] = useState(createBoard(gameOptions));
  const [time, setTime] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const intervalId = setInterval(
      () => setTime(Math.floor((Date.now() - startedAt) / 10)),
      10,
    );

    return () => clearInterval(intervalId);
  }, []);

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
    // TODO combo??
    <div className="game-screen">
      <h1 className="game-screen__title">Game Screen</h1>
      <InGameMenu time={time} onGiveUp={() => console.log("gu")} />
      <GameBoardComponent gameBoard={gameBoard} handleClick={handleClick} />
    </div>
  );
}

export default GameScreen;
