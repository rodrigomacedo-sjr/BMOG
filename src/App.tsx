import { useState } from "react";
import MainScreen from "@/pages/MainScreen";
import MenuScreen from "@/pages/MenuScreen";
import GameScreen from "@/pages/GameScreen";
import RecordsScreen from "@/pages/RecordsScreen";
import Navbar from "@/components/Navbar";
import { useAudio } from "@/audio";
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
  const audio = useAudio();
  const navbarProps = {
    audioSettings: audio.settings,
    onTrackChange: audio.setTrack,
    onMusicVolumeChange: audio.setMusicVolume,
    onEffectsVolumeChange: audio.setEffectsVolume,
  };

  switch (screen) {
    case "main":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} {...navbarProps} />
          <MainScreen onStart={() => { audio.playEffect("confirm"); setScreen("menu"); }} onRecords={() => { audio.playEffect("confirm"); setScreen("records"); }} />;
        </>
      );
    case "menu":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} {...navbarProps} />
          <MenuScreen
            defaultGameOptions={gameOptions}
            onStart={(options: GameOptions) => {
              audio.playEffect("confirm");
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
          <Navbar gameOptions={gameOptions} showGameMode onBack={() => setScreen("main")} {...navbarProps} />
          <GameScreen
            key={gameKey}
            gameOptions={gameOptions}
            onReplay={() => { audio.playEffect("confirm"); setGameKey((key) => key + 1); }}
            onMenu={() => { audio.playEffect("confirm"); setScreen("menu"); }}
            onGiveUp={() => setScreen("menu")}
            playEffect={audio.playEffect}
          />
        </>
      );
    case "records":
      return (
        <>
          <Navbar gameOptions={gameOptions} showGameMode={false} onBack={() => setScreen("main")} {...navbarProps} />
          <RecordsScreen />
        </>
      );
  }
}

export default App;
