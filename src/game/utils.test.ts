import { expect, test } from "bun:test";
import {
  calcTime,
  isGameCorrect,
  scoreMove,
  type CellScoreMove,
} from "./utils";

test("calcTime formats centiseconds", () => {
  expect(calcTime(0)).toBe("00:00.00");
  expect(calcTime(726)).toBe("00:07.26");
  expect(calcTime(6000)).toBe("01:00.00");
  expect(calcTime(360000)).toBe("60:00.00");
});

test("scoreMove rewards new correct cells and applies combo changes", () => {
  const firstCorrect: CellScoreMove = {
    combo: 1,
    secondsSincePreviousBoardClick: 0.4,
    rewardedCell: true,
    completedRow: false,
    completedColumn: false,
    resetCombo: false,
  };

  expect(scoreMove(firstCorrect)).toEqual({ score: 250, combo: 1.3 });
  expect(
    scoreMove({
      ...firstCorrect,
      combo: 1.3,
      secondsSincePreviousBoardClick: 0.01,
      completedRow: true,
      completedColumn: true,
    }),
  ).toEqual({ score: 1300, combo: 2.8 });
  expect(
    scoreMove({ ...firstCorrect, combo: 1.3, rewardedCell: false }),
  ).toEqual({ score: 0, combo: 1.3 });
  expect(scoreMove({ ...firstCorrect, combo: 1.3, resetCombo: true })).toEqual({
    score: 0,
    combo: 1,
  });
});

test("isGameCorrect requires every row to match", () => {
  expect(
    isGameCorrect(
      [
        [1, 0],
        [0, 0],
      ],
      [
        [1, 0],
        [1, 1],
      ],
      4,
    ),
  ).toBeFalse();
});
