import ReturnButton from "@/components/ReturnButton";
import logo from "@/assets/bmo.svg";
import type { AudioSettings, AudioTrack } from "@/audio";
import type { GameOptions } from "@/types";
import { useEffect, useRef, useState } from "react";

type NavbarProps = {
  onBack: () => void;
  gameOptions: GameOptions;
  showGameMode: boolean;
  audioSettings: AudioSettings;
  onTrackChange: (track: AudioTrack) => void;
  onMusicVolumeChange: (volume: number) => void;
  onEffectsVolumeChange: (volume: number) => void;
  onClickSound: () => void;
};

export default function Navbar({
  onBack,
  gameOptions,
  showGameMode,
  audioSettings,
  onTrackChange,
  onMusicVolumeChange,
  onEffectsVolumeChange,
  onClickSound,
}: NavbarProps) {
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const audioSettingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!audioSettingsRef.current?.contains(event.target as Node)) {
        setShowAudioSettings(false);
      }
    }

    if (showAudioSettings) {
      document.addEventListener("pointerdown", closeOnOutsideClick);
      return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
    }
  }, [showAudioSettings]);

  return (
    <div className="site-nav">
      <div className="site-nav__brand">
        <img src={logo} alt="BMOG logo" className="site-nav__logo" />
        <h1 className="site-nav__title">BMOG</h1>
      </div>
      {showGameMode && (
        <p className="site-nav__mode">
          {gameOptions.gridSize}×{gameOptions.gridSize} / {gameOptions.base === 16 ? "HEX" : "DEC"} / {gameOptions.startingBoard === "random" ? "⤨" : "0"}
        </p>
      )}
      <div className="site-nav__actions" ref={audioSettingsRef}>
        <button
          className="audio-settings__toggle"
          aria-label="Sound settings"
          aria-expanded={showAudioSettings}
          onClick={() => {
            onClickSound();
            setShowAudioSettings((show) => !show);
          }}
        >
          ♫
        </button>
        {showAudioSettings && (
          <div className="audio-settings" role="dialog" aria-label="Sound settings">
            <fieldset>
              <legend>Music</legend>
              <label><input type="radio" name="music-track" checked={audioSettings.track === "1"} onChange={() => onTrackChange("1")} />Track 1</label>
              <label><input type="radio" name="music-track" checked={audioSettings.track === "2"} onChange={() => onTrackChange("2")} />Track 2</label>
              <label><input type="radio" name="music-track" checked={audioSettings.track === "off"} onChange={() => onTrackChange("off")} />Off</label>
            </fieldset>
            <label>Music volume <input aria-label="Music volume" type="range" min="0" max="1" step="0.05" value={audioSettings.musicVolume} onChange={(event) => onMusicVolumeChange(Number(event.target.value))} /></label>
            <label>Effects volume <input aria-label="Effects volume" type="range" min="0" max="1" step="0.05" value={audioSettings.effectsVolume} onChange={(event) => onEffectsVolumeChange(Number(event.target.value))} /></label>
          </div>
        )}
        <ReturnButton onClick={() => {
          onClickSound();
          onBack();
        }} />
      </div>
    </div>
  );
}
