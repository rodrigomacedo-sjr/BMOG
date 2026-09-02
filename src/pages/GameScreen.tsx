import GameBoardComponent from "@/components/GameBoardComponent";
import InGameMenu from "@/components/InGameMenu";
import createBoard from "@/game/createBoard";
import type { GameBoard, GameOptions } from "@/types";

type GameScreenProps = {
  gameOptions: GameOptions;
};

function GameScreen({ gameOptions }: GameScreenProps) {
  // TODO this should be state ofc
  let gameBoard = createBoard(gameOptions);
  return (
    // TODO handle click
    // TODO handle give up
    // TODO handle win
    // TODO time??
    // TODO combo??
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">Game Screen</h1>
      <GameBoardComponent gameBoard={gameBoard} />
      <InGameMenu onGiveUp={() => console.log("gu")} />
    </div>
  );
}

export default GameScreen;
