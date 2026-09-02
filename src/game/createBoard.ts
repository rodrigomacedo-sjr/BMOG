import type {
  AnswerKey,
  CellState,
  GameBoard,
  StartingBoards,
  ValidBases,
  ValidSizes,
} from "@/types";
import {
  colToString,
  intToDecimal,
  intToHex,
  isColCorrect,
  isRowCorrect,
  randomCellState,
  rowToString,
} from "@/game/utils";

type CreateBoardProps = {
  base: ValidBases;
  size: ValidSizes;
  startingBoard: StartingBoards;
};

export default function createBoard({
  base,
  size,
  startingBoard,
}: CreateBoardProps): GameBoard {
  const state: CellState[][] = [];
  const correctnessMask: CellState[][] = [];

  for (let i = 0; i < size; ++i) {
    let stateRow: CellState[] = [];
    let correctRow: CellState[] = [];

    for (let j = 0; j < size; ++j) {
      stateRow.push(randomCellState());
      correctRow.push(startingBoard === "zeroed" ? 0 : randomCellState());
    }

    state.push(stateRow);
    correctnessMask.push(correctRow);
  }

  const rowAnswerKey: AnswerKey[] = [];
  for (let i = 0; i < size; ++i) {
    let row = rowToString(correctnessMask, i);
    let rowValue = parseInt(row, 2);

    let key = {
      value: rowValue,
      visual: base === 10 ? intToDecimal(rowValue) : intToHex(rowValue),
      isCorrect: isRowCorrect(state, correctnessMask, i),
    };

    rowAnswerKey.push(key);
  }

  const colAnswerKey: AnswerKey[] = [];
  for (let i = 0; i < size; ++i) {
    let col = colToString(correctnessMask, size, i);
    let colValue = parseInt(col, 2);

    let key = {
      value: colValue,
      visual: base === 10 ? intToDecimal(colValue) : intToHex(colValue),
      isCorrect: isColCorrect(state, correctnessMask, size, i),
    };

    rowAnswerKey.push(key);
  }

  const newBoard = {
    base: base,
    size: size,
    state: state,
    correctnessMask: correctnessMask,
    rowAnswerKey: rowAnswerKey,
    colAnswerKey: colAnswerKey,
  };

  return newBoard;
}
