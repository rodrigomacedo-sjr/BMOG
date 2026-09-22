import type { AnswerKey, CellState, ValidBases, ValidSizes } from "@/types";

export function randomCellState(): CellState {
  return Math.random() < 0.5 ? 0 : 1;
}

export function colToString(
  matrix: CellState[][],
  size: ValidSizes,
  col: number,
): string {
  const out: number[] = [];
  for (let i = 0; i < size; ++i) {
    let value = matrix[i]?.[col] ?? 0;
    out.push(value);
  }
  return out.join("");
}

export function rowToString(matrix: CellState[][], row: number): string {
  return matrix[row]?.join("") ?? "0";
}

export function isRowCorrect(
  matrix: CellState[][],
  answer: CellState[][],
  row: number,
): boolean {
  return rowToString(matrix, row) === rowToString(answer, row);
}

export function isColCorrect(
  matrix: CellState[][],
  answer: CellState[][],
  size: ValidSizes,
  col: number,
): boolean {
  return colToString(matrix, size, col) === colToString(answer, size, col);
}

export function isGameCorrect(
  matrix: CellState[][],
  answer: CellState[][],
  size: ValidSizes,
): boolean {
  let ans = true;
  for (let i = 0; i < size; ++i) {
    ans ||= isRowCorrect(matrix, answer, i);
  }
  return ans;
}

export function calculateRowAnswerKey(
  state: CellState[][],
  answer: CellState[][],
  size: ValidSizes,
  base: ValidBases,
) {
  const ans: AnswerKey[] = [];

  for (let i = 0; i < size; ++i) {
    let row = rowToString(answer, i);
    let rowValue = parseInt(row, 2);

    let key = {
      value: rowValue,
      visual: base === 10 ? intToDecimal(rowValue) : intToHex(rowValue),
      isCorrect: isRowCorrect(state, answer, i),
    };

    ans.push(key);
  }

  return ans;
}

export function calculateColAnswerKey(
  state: CellState[][],
  answer: CellState[][],
  size: ValidSizes,
  base: ValidBases,
) {
  const ans: AnswerKey[] = [];

  for (let i = 0; i < size; ++i) {
    let row = colToString(answer, size, i);
    let rowValue = parseInt(row, 2);

    let key = {
      value: rowValue,
      visual: base === 10 ? intToDecimal(rowValue) : intToHex(rowValue),
      isCorrect: isColCorrect(state, answer, size, i),
    };

    ans.push(key);
  }

  return ans;
}

export function intToDecimal(n: number): string {
  return n.toString();
}

export function intToHex(n: number): string {
  return n.toString(16).toUpperCase();
}

function padZero(num: number): string {
  if (num < 10) {
    return "0" + num;
  }
  return num.toString();
}

export function calcTime(time: number) {
  const min = padZero(Math.floor(time / 6000));

  const sec = padZero(Math.floor((time % 6000) / 100));

  const mili = padZero(time % 100);

  if (min != "00") {
    return `${min}:${sec}.${mili}`;
  } else {
    return `${sec}.${mili}`;
  }
}
