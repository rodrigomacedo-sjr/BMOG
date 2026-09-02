export type ValidSizes = 4 | 6 | 8 | 10 | 12 | 14 | 16;

export type ValidBases = 10 | 16;

export type StartingBoards = "zeroed" | "random";

export type GameOptions = {
  base: ValidBases;
  gridSize: ValidSizes;
  startingBoard: StartingBoards;
};

export type CellState = 0 | 1;

export type AnswerKey = {
  value: number;
  visual: string;
  isCorrect: boolean;
};

export type GameBoard = {
  base: ValidBases;
  size: ValidSizes;
  state: CellState[][];
  correctnessMask: CellState[][];
  // top to bottom, 0 - n
  rowAnswerKey: AnswerKey[];
  // left to right, 0 - n
  colAnswerKey: AnswerKey[];
};
