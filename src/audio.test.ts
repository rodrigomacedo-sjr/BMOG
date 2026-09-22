import { expect, test } from "bun:test";
import { parseAudioSettings } from "./audio";

test("audio settings retain a valid track and clamp volumes", () => {
  expect(
    parseAudioSettings('{"track":"2","musicVolume":2,"effectsVolume":-1}'),
  ).toEqual({ track: "2", musicVolume: 1, effectsVolume: 0 });
});
