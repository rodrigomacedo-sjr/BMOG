import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import WinPanel from "@/components/WinPanel";
import createBoard from "@/game/createBoard";
import {
  calculateColAnswerKey,
  calculateRowAnswerKey,
  isGameCorrect,
  scoreMove,
} from "@/game/utils";
import type { GameOptions } from "@/types";
import { useEffect, useRef, useState } from "react";

type GameScreenProps = {
  gameOptions: GameOptions;
  onReplay: () => void;
  onMenu: () => void;
};

function GameScreen({ gameOptions, onReplay, onMenu }: GameScreenProps) {
  const [gameBoard, setGameBoard] = useState(createBoard(gameOptions));
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [scorePopup, setScorePopup] = useState<{ key: string; score: number }>();
  const [won, setWon] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const gameBoardRef = useRef(gameBoard);
  const comboRef = useRef(combo);
  const startedAtRef = useRef(Date.now());
  const lastBoardClickAtRef = useRef(startedAtRef.current);
  const rewardedCellsRef = useRef(new Set<string>());
  const rewardedRowsRef = useRef(new Set<number>());
  const rewardedColumnsRef = useRef(new Set<number>());
  const popupTimeoutRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);

  useEffect(() => {
    const startedAt = startedAtRef.current;
    const intervalId = setInterval(
      () => {
        if (!wonRef.current) {
          setTime(Math.floor((Date.now() - startedAt) / 10));
        }
      },
      10,
    );

    return () => {
      clearInterval(intervalId);
      window.clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  function handleClick(row: number, col: number) {
    if (wonRef.current) return;

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
    setHighestCombo((currentHighestCombo) =>
      Math.max(currentHighestCombo, move.combo),
    );

    const next = { ...current, state: newState, rowAnswerKey, colAnswerKey };
    gameBoardRef.current = next;
    setGameBoard(next);

    if (isGameCorrect(newState, current.correctnessMask, current.size)) {
      wonRef.current = true;
      setTime(Math.floor((now - startedAtRef.current) / 10));
      setWon(true);
    }
  }

  return (
    <div className="game-screen">
      {won ? (
        <WinPanel
          time={time}
          score={score}
          highestCombo={highestCombo}
          onReplay={onReplay}
          onMenu={onMenu}
        />
      ) : (
        <>
          <h1 className="game-screen__title">Game Screen</h1>
          <InGameMenu
            time={time}
            score={score}
            combo={combo}
            onGiveUp={() => setConfirmGiveUp(true)}
          />
          <GameBoardComponent
            gameBoard={gameBoard}
            handleClick={handleClick}
            scorePopup={scorePopup}
          />
          {confirmGiveUp && (
            <div className="game-confirm" role="dialog" aria-modal="true" aria-labelledby="give-up-title">
              <div className="game-confirm__panel">
                <h2 id="give-up-title">give up?</h2>
                <p>this run will be lost.</p>
                <div className="game-confirm__actions">
                  <button onClick={() => setConfirmGiveUp(false)}>cancel</button>
                  <button onClick={onMenu}>give up</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default GameScreen;
