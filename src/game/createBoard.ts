import type { AnswerKey, CellState, GameBoard, GameOptions } from "@/types";
import {
  calculateColAnswerKey,
  calculateRowAnswerKey,
  randomCellState,
} from "@/game/utils";

export default function createBoard({
  base,
  gridSize,
  startingBoard,
}: GameOptions): GameBoard {
  const state: CellState[][] = [];
  const correctnessMask: CellState[][] = [];

  for (let i = 0; i < gridSize; ++i) {
    let stateRow: CellState[] = [];
    let correctRow: CellState[] = [];

    for (let j = 0; j < gridSize; ++j) {
      stateRow.push(startingBoard === "zeroed" ? 0 : randomCellState());
      correctRow.push(randomCellState());
    }

    state.push(stateRow);
    correctnessMask.push(correctRow);
  }

  const rowAnswerKey = calculateRowAnswerKey(
    state,
    correctnessMask,
    gridSize,
    base,
  );

  const colAnswerKey = calculateColAnswerKey(
    state,
    correctnessMask,
    gridSize,
    base,
  );

  const newBoard = {
    base: base,
    size: gridSize,
    state: state,
    correctnessMask: correctnessMask,
    rowAnswerKey: rowAnswerKey,
    colAnswerKey: colAnswerKey,
  };

  return newBoard;
}
