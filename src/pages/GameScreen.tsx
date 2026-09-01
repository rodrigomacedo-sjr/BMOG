import type { GameOptions } from "@/types";

type GameScreenProps = {
  gameOptions: GameOptions;
};

function GameScreen({ gameOptions }: GameScreenProps) {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">Game Screen</h1>
      <p>{gameOptions.gridSize}</p>
      <p>{gameOptions.base}</p>
    </div>
  );
}

export default GameScreen;
