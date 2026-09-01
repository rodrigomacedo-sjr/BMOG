export type ValidSizes = 4 | 6 | 8 | 10 | 12 | 14 | 16;

export type ValidBases = 10 | 16;

export type GameOptions = {
  gridSize: ValidSizes;
  base: ValidBases;
};
