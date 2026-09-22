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

export type RecordUpdate = {
  records: GameRecords;
  newBestTime: boolean;
  newBestScore: boolean;
};

export function recordKey({ gridSize, base, startingBoard }: GameOptions) {
  return `${gridSize}:${base}:${startingBoard}`;
}

export function orderedRecords(records: GameRecords) {
  return Object.entries(records)
    .sort(([first], [second]) => {
      const firstParts = first.split(":");
      const secondParts = second.split(":");
      return Number(firstParts[0]) - Number(secondParts[0]) ||
        Number(firstParts[1]) - Number(secondParts[1]) ||
        (firstParts[2] === "zeroed" ? 0 : 1) - (secondParts[2] === "zeroed" ? 0 : 1);
    })
    .map(([key, record]) => ({ key, record }));
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

export function updateRecords(
  records: GameRecords,
  options: GameOptions,
  result: GameResult,
): RecordUpdate {
  const previous = records[recordKey(options)];

  return {
    records: mergeRecords(records, options, result),
    newBestTime: !previous || result.time < previous.bestTime,
    newBestScore: !previous || result.score > previous.bestScore,
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

export function saveRecord(
  options: GameOptions,
  result: GameResult,
): Pick<RecordUpdate, "newBestTime" | "newBestScore"> {
  try {
    const update = updateRecords(readRecords(), options, result);
    localStorage.setItem(
      RECORDS_KEY,
      JSON.stringify(update.records),
    );
    return update;
  } catch {}

  return { newBestTime: false, newBestScore: false };
}
