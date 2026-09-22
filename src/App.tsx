import { useState } from "react";
import MainScreen from "@/pages/MainScreen";
import MenuScreen from "@/pages/MenuScreen";
import GameScreen from "@/pages/GameScreen";
import RecordsScreen from "@/pages/RecordsScreen";
import Navbar from "@/components/Navbar";
import type { GameOptions } from "@/types.ts";

type Screen = "main" | "menu" | "game" | "records";

const defaultGameOptions: GameOptions = {
  gridSize: 8,
  base: 10,
  startingBoard: "random",
};

export function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [gameOptions, setGameOptions] =
    useState<GameOptions>(defaultGameOptions);
  const [gameKey, setGameKey] = useState(0);

  switch (screen) {
    case "main":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} />
          <MainScreen onStart={() => setScreen("menu")} onRecords={() => setScreen("records")} />;
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
              setGameKey((key) => key + 1);
              setScreen("game");
            }}
          />
        </>
      );
    case "game":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode onBack={() => setScreen("main")} />
          <GameScreen
            key={gameKey}
            gameOptions={gameOptions}
            onReplay={() => setGameKey((key) => key + 1)}
            onMenu={() => setScreen("menu")}
          />
        </>
      );
    case "records":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} />
          <RecordsScreen />
        </>
      );
  }
}

export default App;
