import type { CellState } from "@/types";

export function randomCellState(): CellState {
  return Math.floor(Math.random()) ? 0 : 1;
}

export function colToString(
  matrix: CellState[][],
  size: number,
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
  size: number,
  col: number,
): boolean {
  return colToString(matrix, size, col) === colToString(answer, size, col);
}

export function isGameCorrect(
  matrix: CellState[][],
  answer: CellState[][],
  size: number,
): boolean {
  let ans = true;
  for (let i = 0; i < size; ++i) {
    ans ||= isRowCorrect(matrix, answer, i);
  }
  return ans;
}

export function intToDecimal(n: number): string {
  return n.toString();
}

export function intToHex(n: number): string {
  return n.toString(16).toUpperCase();
}
