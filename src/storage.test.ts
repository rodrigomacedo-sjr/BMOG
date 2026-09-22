import { expect, test } from "bun:test";
import {
  mergeRecords,
  orderedRecords,
  readRecords,
  recordKey,
  saveRecord,
  updateRecords,
  type GameRecords,
} from "./storage";
import type { GameOptions } from "./types";

const options: GameOptions = {
  gridSize: 8,
  base: 10,
  startingBoard: "random",
};

function stubLocalStorage(values = new Map<string, string>()) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });

  return () => {
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete (globalThis as { localStorage?: Storage }).localStorage;
  };
}

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

test("updateRecords reports time and score PBs for the exact mode", () => {
  const update = updateRecords(
    {
      "8:10:random": { bestTime: 80, bestScore: 600, highestCombo: 3 },
      "8:10:zeroed": { bestTime: 70, bestScore: 700, highestCombo: 4 },
    },
    options,
    { time: 70, score: 700, highestCombo: 2 },
  );

  expect(update).toEqual({
    newBestTime: true,
    newBestScore: true,
    records: {
      "8:10:random": { bestTime: 70, bestScore: 700, highestCombo: 3 },
      "8:10:zeroed": { bestTime: 70, bestScore: 700, highestCombo: 4 },
    },
  });
});

test("orderedRecords lists modes by size, base, then starting board", () => {
  expect(
    orderedRecords({
      "16:16:random": { bestTime: 60, bestScore: 1600, highestCombo: 6 },
      "4:16:zeroed": { bestTime: 90, bestScore: 400, highestCombo: 2 },
      "4:10:random": { bestTime: 80, bestScore: 500, highestCombo: 3 },
      "4:10:zeroed": { bestTime: 100, bestScore: 300, highestCombo: 1 },
      "16:10:zeroed": { bestTime: 70, bestScore: 900, highestCombo: 4 },
    } satisfies GameRecords).map(({ key }) => key),
  ).toEqual([
    "4:10:zeroed",
    "4:10:random",
    "4:16:zeroed",
    "16:10:zeroed",
    "16:16:random",
  ]);
});

test("saveRecord merges with records in localStorage", () => {
  const values = new Map([
    ["records", JSON.stringify({ "4:10:zeroed": { bestTime: 90, bestScore: 500, highestCombo: 2 } })],
  ]);
  const restore = stubLocalStorage(values);

  try {
    saveRecord(options, { time: 80, score: 600, highestCombo: 3 });
    expect(readRecords()).toEqual({
      "4:10:zeroed": { bestTime: 90, bestScore: 500, highestCombo: 2 },
      "8:10:random": { bestTime: 80, bestScore: 600, highestCombo: 3 },
    });
  } finally {
    restore();
  }
});

test("readRecords recovers from malformed localStorage JSON", () => {
  const restore = stubLocalStorage(new Map([["records", "{"]]));

  try {
    expect(readRecords()).toEqual({});
  } finally {
    restore();
  }
});
