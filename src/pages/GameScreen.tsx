import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import createBoard from "@/game/createBoard";
import {
  calculateColAnswerKey,
  calculateRowAnswerKey,
  scoreMove,
} from "@/game/utils";
import type { GameOptions } from "@/types";
import { useEffect, useRef, useState } from "react";

type GameScreenProps = {
  gameOptions: GameOptions;
};

function GameScreen({ gameOptions }: GameScreenProps) {
  const [gameBoard, setGameBoard] = useState(createBoard(gameOptions));
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [scorePopup, setScorePopup] = useState<{ key: string; score: number }>();
  const gameBoardRef = useRef(gameBoard);
  const comboRef = useRef(combo);
  const startedAtRef = useRef(Date.now());
  const lastBoardClickAtRef = useRef(startedAtRef.current);
  const rewardedCellsRef = useRef(new Set<string>());
  const rewardedRowsRef = useRef(new Set<number>());
  const rewardedColumnsRef = useRef(new Set<number>());
  const popupTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const startedAt = startedAtRef.current;
    const intervalId = setInterval(
      () => setTime(Math.floor((Date.now() - startedAt) / 10)),
      10,
    );

    return () => {
      clearInterval(intervalId);
      window.clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  function handleClick(row: number, col: number) {
    const current = gameBoardRef.current;
    const clickedCellWasCorrect =
      current.state[row]?.[col] === current.correctnessMask[row]?.[col];
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
    const key = `${row}:${col}`;
    const rewardedCell =
      !clickedCellWasCorrect &&
      !rewardedCellsRef.current.has(key) &&
      newState[row]?.[col] === current.correctnessMask[row]?.[col];
    const completedRow =
      rewardedCell &&
      rowAnswerKey[row]?.isCorrect === true &&
      !rewardedRowsRef.current.has(row);
    const completedColumn =
      rewardedCell &&
      colAnswerKey[col]?.isCorrect === true &&
      !rewardedColumnsRef.current.has(col);
    const now = Date.now();
    const move = scoreMove({
      combo: comboRef.current,
      secondsSincePreviousBoardClick:
        (now - lastBoardClickAtRef.current) / 1000,
      rewardedCell,
      completedRow,
      completedColumn,
      resetCombo: clickedCellWasCorrect,
    });

    lastBoardClickAtRef.current = now;
    if (rewardedCell) rewardedCellsRef.current.add(key);
    if (completedRow) rewardedRowsRef.current.add(row);
    if (completedColumn) rewardedColumnsRef.current.add(col);
    if (move.score) {
      setScore((currentScore) => currentScore + move.score);
      setScorePopup({ key, score: move.score });
      window.clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = window.setTimeout(
        () => setScorePopup(undefined),
        600,
      );
    }
    comboRef.current = move.combo;
    setCombo(move.combo);

    const next = { ...current, state: newState, rowAnswerKey, colAnswerKey };
    gameBoardRef.current = next;
    setGameBoard(next);
  }

  return (
    // TODO handle give up
    <div className="game-screen">
      <h1 className="game-screen__title">Game Screen</h1>
      <InGameMenu
        time={time}
        score={score}
        combo={combo}
        onGiveUp={() => console.log("gu")}
      />
      <GameBoardComponent
        gameBoard={gameBoard}
        handleClick={handleClick}
        scorePopup={scorePopup}
      />
    </div>
  );
}

export default GameScreen;
