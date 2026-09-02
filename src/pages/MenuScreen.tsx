import { useState } from "react";
import type {
  GameOptions,
  StartingBoards,
  ValidBases,
  ValidSizes,
} from "@/types.ts";

const gridSizes: ValidSizes[] = [4, 6, 8, 10, 12, 14, 16];

const bases: ValidBases[] = [10, 16];

const startingBoards: StartingBoards[] = ["zeroed", "random"];

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

  function selectStartingBoard(startingBoard: StartingBoards) {
    setGameOptions((current) => ({
      ...current,
      startingBoard,
    }));
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onStart(gameOptions);
  }

  return (
    <form className="game-menu" onSubmit={handleSubmit}>
      <h1 className="game-menu__title">Select Game Mode</h1>
      <fieldset className="game-menu__group">
        <legend>Grid Size</legend>
        {gridSizes.map((gridSize) => (
          <label className="game-menu__option" key={gridSize}>
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

      <fieldset className="game-menu__group">
        <legend>Base</legend>
        {bases.map((base) => (
          <label className="game-menu__option" key={base}>
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

      <fieldset className="game-menu__group">
        <legend>Starting Board</legend>
        {startingBoards.map((startingBoard) => (
          <label className="game-menu__option" key={startingBoard}>
            <input
              type="radio"
              name="startingBoard"
              value={startingBoard}
              checked={gameOptions.startingBoard == startingBoard}
              onChange={() => selectStartingBoard(startingBoard)}
            />
            {startingBoard}
          </label>
        ))}
      </fieldset>

      <button className="game-menu__start" type="submit">
        Start
      </button>
    </form>
  );
}

export default MenuScreen;
