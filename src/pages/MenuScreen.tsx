import { useState } from "react";
import type { GameOptions, ValidBases, ValidSizes } from "@/types.ts";

const gridSizes: ValidSizes[] = [4, 6, 8, 10, 12, 14, 16];

const bases: ValidBases[] = [10, 16];

type MenuScreenProps = {
  defaultGameOptions: GameOptions;
  onStart: (options: GameOptions) => void;
};

function MenuScreen({ defaultGameOptions, onStart }: MenuScreenProps) {
  const [gameOptions, setGameOptions] =
    useState<GameOptions>(defaultGameOptions);

  function selectSize(gridSize: ValidSizes) {
    setGameOptions((current) => ({
      ...current,
      gridSize,
    }));
  }

  function selectBase(base: ValidBases) {
    setGameOptions((current) => ({
      ...current,
      base,
    }));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onStart(gameOptions);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Select Game Mode</h1>
      <fieldset>
        <legend>Grid Size</legend>
        {gridSizes.map((gridSize) => (
          <label key={gridSize}>
            <input
              type="radio"
              name="gridSize"
              value={gridSize}
              checked={gameOptions.gridSize == gridSize}
              onChange={() => selectSize(gridSize)}
            />
            {gridSize}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Base</legend>
        {bases.map((base) => (
          <label key={base}>
            <input
              type="radio"
              name="base"
              value={base}
              checked={gameOptions.base == base}
              onChange={() => selectBase(base)}
            />
            {base}
          </label>
        ))}
      </fieldset>

      <button type="submit">Start</button>
    </form>
  );
}

export default MenuScreen;
