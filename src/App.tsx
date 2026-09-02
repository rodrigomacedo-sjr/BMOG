import { useState } from "react";
import MainScreen from "@/pages/MainScreen";
import MenuScreen from "@/pages/MenuScreen";
import GameScreen from "@/pages/GameScreen";
import Navbar from "@/components/Navbar";
import type { GameOptions } from "@/types.ts";

type Screen = "main" | "menu" | "game";

const defaultGameOptions: GameOptions = {
  gridSize: 8,
  base: 10,
  startingBoard: "random",
};

export function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [gameOptions, setGameOptions] =
    useState<GameOptions>(defaultGameOptions);

  switch (screen) {
    case "main":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} />
          <MainScreen onStart={() => setScreen("menu")} />;
        </>
      );
    case "menu":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} />
          <MenuScreen
            defaultGameOptions={gameOptions}
            onStart={(options: GameOptions) => {
              setGameOptions(options);
              setScreen("game");
            }}
          />
        </>
      );
    case "game":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode onBack={() => setScreen("main")} />
          <GameScreen gameOptions={gameOptions} />
        </>
      );
  }
}

export default App;
