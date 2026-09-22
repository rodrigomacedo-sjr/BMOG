import { expect, test } from "bun:test";
import { mergeRecords, recordKey, type GameRecords } from "./storage";
import type { GameOptions } from "./types";

const options: GameOptions = {
  gridSize: 8,
  base: 10,
  startingBoard: "random",
};

test("records use every game option and retain each mode", () => {
  expect(recordKey(options)).toBe("8:10:random");
  expect(
    mergeRecords(
      {
        "4:10:zeroed": { bestTime: 90, bestScore: 500, highestCombo: 2 },
        "8:10:random": { bestTime: 80, bestScore: 600, highestCombo: 3 },
      } satisfies GameRecords,
      options,
      { time: 100, score: 700, highestCombo: 2 },
    ),
  ).toEqual({
    "4:10:zeroed": { bestTime: 90, bestScore: 500, highestCombo: 2 },
    "8:10:random": { bestTime: 80, bestScore: 700, highestCombo: 3 },
  });
});
