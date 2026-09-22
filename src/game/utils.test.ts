import { expect, test } from "bun:test";
import { calcTime } from "./utils";

test("calcTime formats centiseconds", () => {
  expect(calcTime(0)).toBe("00.00");
  expect(calcTime(726)).toBe("07.26");
  expect(calcTime(6000)).toBe("01:00.00");
  expect(calcTime(360000)).toBe("60:00.00");
});
