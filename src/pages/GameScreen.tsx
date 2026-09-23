import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import WinPanel from "@/components/WinPanel";
import createBoard from "@/game/createBoard";
import { saveRecord } from "@/storage";
import {
  calculateColAnswerKey,
  calculateRowAnswerKey,
  isGameCorrect,
  scoreMove,
} from "@/game/utils";
import type { GameOptions } from "@/types";
import type { AudioEffect } from "@/audio";
import { useEffect, useRef, useState } from "react";

type GameScreenProps = {
  gameOptions: GameOptions;
  onReplay: () => void;
  onMenu: () => void;
  onGiveUp: () => void;
  playEffect: (effect: AudioEffect) => void;
};

function GameScreen({ gameOptions, onReplay, onMenu, onGiveUp, playEffect }: GameScreenProps) {
  const [gameBoard, setGameBoard] = useState(createBoard(gameOptions));
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [comboBump, setComboBump] = useState(0);
  const [highestCombo, setHighestCombo] = useState(1);
  const [newRecords, setNewRecords] = useState({
    newBestTime: false,
    newBestScore: false,
  });
  const [scorePopup, setScorePopup] = useState<{ key: string; score: number }>();
  const [won, setWon] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const gameBoardRef = useRef(gameBoard);
  const comboRef = useRef(combo);
  const scoreRef = useRef(score);
  const highestComboRef = useRef(highestCombo);
  const startedAtRef = useRef(Date.now());
  const lastBoardClickAtRef = useRef(startedAtRef.current);
  const rewardedCellsRef = useRef(new Set<string>());
  const rewardedRowsRef = useRef(new Set<number>());
  const rewardedColumnsRef = useRef(new Set<number>());
  const popupTimeoutRef = useRef<number | undefined>(undefined);
  const wonRef = useRef(false);
  const giveUpButtonRef = useRef<HTMLButtonElement>(null);
  const cancelGiveUpButtonRef = useRef<HTMLButtonElement>(null);
  const confirmGiveUpButtonRef = useRef<HTMLButtonElement>(null);
  const wasConfirmGiveUpRef = useRef(false);

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

  useEffect(() => {
    if (confirmGiveUp) {
      cancelGiveUpButtonRef.current?.focus();
    } else if (wasConfirmGiveUpRef.current) {
      giveUpButtonRef.current?.focus();
    }

    wasConfirmGiveUpRef.current = confirmGiveUp;
  }, [confirmGiveUp]);

  function handleGiveUpDialogKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      setConfirmGiveUp(false);
      return;
    }

    if (event.key !== "Tab") return;

    event.preventDefault();
    const activeElement = document.activeElement;
    const nextButton = event.shiftKey
      ? activeElement === cancelGiveUpButtonRef.current
        ? confirmGiveUpButtonRef.current
        : cancelGiveUpButtonRef.current
      : activeElement === confirmGiveUpButtonRef.current
        ? cancelGiveUpButtonRef.current
        : confirmGiveUpButtonRef.current;
    nextButton?.focus();
  }

  function handleClick(row: number, col: number) {
    if (wonRef.current) return;

    playEffect("click");

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
    if (clickedCellWasCorrect) playEffect("fail");
    else if (rewardedCell) playEffect("correct");
    if (completedRow && completedColumn) playEffect("doubleLine");
    else if (completedRow || completedColumn) playEffect("line");
    if (move.score) {
      scoreRef.current += move.score;
      setScore(scoreRef.current);
      setScorePopup({ key, score: move.score });
      window.clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = window.setTimeout(
        () => setScorePopup(undefined),
        600,
      );
    }
    if (move.combo > comboRef.current) setComboBump((current) => current + 1);
    comboRef.current = move.combo;
    setCombo(move.combo);
    highestComboRef.current = Math.max(highestComboRef.current, move.combo);
    setHighestCombo(highestComboRef.current);

    const next = { ...current, state: newState, rowAnswerKey, colAnswerKey };
    gameBoardRef.current = next;
    setGameBoard(next);

    if (isGameCorrect(newState, current.correctnessMask, current.size)) {
      wonRef.current = true;
      const winTime = Math.floor((now - startedAtRef.current) / 10);
      setTime(winTime);
      const records = saveRecord(gameOptions, {
        time: winTime,
        score: scoreRef.current,
        highestCombo: highestComboRef.current,
      });
      setNewRecords(records);
      playEffect("win");
      if (records.newBestTime || records.newBestScore) playEffect("record");
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
          {...newRecords}
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
            comboBump={comboBump}
            onGiveUp={() => setConfirmGiveUp(true)}
            giveUpButtonRef={giveUpButtonRef}
          />
          <GameBoardComponent
            gameBoard={gameBoard}
            handleClick={handleClick}
            scorePopup={scorePopup}
            onBmogClick={() => playEffect("bmog")}
          />
          {confirmGiveUp && (
            <div
              className="game-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="give-up-title"
              onKeyDown={handleGiveUpDialogKeyDown}
            >
              <div className="game-confirm__panel">
                <h2 id="give-up-title">give up?</h2>
                <p>this run will be lost.</p>
                <div className="game-confirm__actions">
                  <button ref={cancelGiveUpButtonRef} onClick={() => setConfirmGiveUp(false)}>
                    cancel
                  </button>
                  <button ref={confirmGiveUpButtonRef} onClick={() => { playEffect("giveUp"); onGiveUp(); }}>
                    give up
                  </button>
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
