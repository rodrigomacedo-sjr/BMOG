import type { GameOptions } from "./types";

const RECORDS_KEY = "records";

export type GameRecord = {
  bestTime: number;
  bestScore: number;
  highestCombo: number;
};

export type GameRecords = Record<string, GameRecord>;

export type GameResult = {
  time: number;
  score: number;
  highestCombo: number;
};

export function recordKey({ gridSize, base, startingBoard }: GameOptions) {
  return `${gridSize}:${base}:${startingBoard}`;
}

export function mergeRecords(
  records: GameRecords,
  options: GameOptions,
  result: GameResult,
): GameRecords {
  const key = recordKey(options);
  const previous = records[key];

  return {
    ...records,
    [key]: previous
      ? {
          bestTime: Math.min(previous.bestTime, result.time),
          bestScore: Math.max(previous.bestScore, result.score),
          highestCombo: Math.max(previous.highestCombo, result.highestCombo),
        }
      : {
          bestTime: result.time,
          bestScore: result.score,
          highestCombo: result.highestCombo,
        },
  };
}

export function readRecords(): GameRecords {
  try {
    const value = JSON.parse(localStorage.getItem(RECORDS_KEY) ?? "{}") as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    return Object.fromEntries(
      Object.entries(value).filter(
        ([, record]) =>
          !!record &&
          typeof record === "object" &&
          Number.isFinite((record as GameRecord).bestTime) &&
          Number.isFinite((record as GameRecord).bestScore) &&
          Number.isFinite((record as GameRecord).highestCombo),
      ),
    ) as GameRecords;
  } catch {
    return {};
  }
}

export function saveRecord(options: GameOptions, result: GameResult): void {
  try {
    localStorage.setItem(
      RECORDS_KEY,
      JSON.stringify(mergeRecords(readRecords(), options, result)),
    );
  } catch {}
}
