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
    <div className="game-screen">
      <h1 className="game-screen__title">Game Screen</h1>
      <InGameMenu onGiveUp={() => console.log("gu")} />
      <GameBoardComponent gameBoard={gameBoard} />
    </div>
  );
}

export default GameScreen;
