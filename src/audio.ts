import { useEffect, useRef, useState } from "react";
import clickSound from "@/assets/sound-click.mp3";
import correctSound from "@/assets/sound-correct.mp3";
import lineSound from "@/assets/sound-line.mp3";
import doubleLineSound from "@/assets/sound-double-line.mp3";
import failSound from "@/assets/sound-fail.mp3";
import winSound from "@/assets/sound-win.mp3";
import giveUpSound from "@/assets/sound-give-up.mp3";
import recordSound from "@/assets/sound-record.mp3";
import confirmSound from "@/assets/sound-confirm.mp3";
import bmogSound from "@/assets/sound-bmog.mp3";
import track2 from "@/assets/music-track-2.mp3";
import track01 from "@/assets/music-track-01.mp3";
import track02 from "@/assets/music-track-02.mp3";
import track03 from "@/assets/music-track-03.mp3";
import track04 from "@/assets/music-track-04.mp3";
import track05 from "@/assets/music-track-05.mp3";
import track06 from "@/assets/music-track-06.mp3";
import track07 from "@/assets/music-track-07.mp3";
import track08 from "@/assets/music-track-08.mp3";
import track09 from "@/assets/music-track-09.mp3";
import track10 from "@/assets/music-track-10.mp3";
import track11 from "@/assets/music-track-11.mp3";
import track12 from "@/assets/music-track-12.mp3";

const SETTINGS_KEY = "audio-settings";
const playlist = [track01, track02, track03, track04, track05, track06, track07, track08, track09, track10, track11, track12];
const effects = {
  click: clickSound,
  correct: correctSound,
  line: lineSound,
  doubleLine: doubleLineSound,
  fail: failSound,
  win: winSound,
  giveUp: giveUpSound,
  record: recordSound,
  confirm: confirmSound,
  bmog: bmogSound,
};

export type AudioTrack = "1" | "2" | "off";
export type AudioSettings = {
  track: AudioTrack;
  musicVolume: number;
  effectsVolume: number;
};
export type AudioEffect = keyof typeof effects;

const defaultSettings: AudioSettings = {
  track: "1",
  musicVolume: 0.5,
  effectsVolume: 0.7,
};

function clampVolume(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

export function parseAudioSettings(value: string | null): AudioSettings {
  try {
    const settings = JSON.parse(value ?? "{}") as Partial<AudioSettings>;
    return {
      track: settings.track === "1" || settings.track === "2" || settings.track === "off"
        ? settings.track
        : defaultSettings.track,
      musicVolume: clampVolume(settings.musicVolume, defaultSettings.musicVolume),
      effectsVolume: clampVolume(settings.effectsVolume, defaultSettings.effectsVolume),
    };
  } catch {
    return defaultSettings;
  }
}

function readAudioSettings() {
  if (typeof window === "undefined") return defaultSettings;

  try {
    return parseAudioSettings(window.localStorage.getItem(SETTINGS_KEY));
  } catch {
    return defaultSettings;
  }
}

export function useAudio() {
  const [settings, setSettings] = useState(readAudioSettings);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    if (typeof Audio === "undefined" || settings.track === "off") {
      musicRef.current?.pause();
      return;
    }

    const music = musicRef.current ?? new Audio();
    musicRef.current = music;
    music.src = settings.track === "1" ? playlist[playlistIndex]! : track2;
    music.loop = settings.track === "2";
    music.volume = settings.musicVolume;
    const advancePlaylist = () => setPlaylistIndex((index) => (index + 1) % playlist.length);
    music.addEventListener("ended", advancePlaylist);
    void music.play().catch(() => {});

    return () => {
      music.removeEventListener("ended", advancePlaylist);
      music.pause();
    };
  }, [playlistIndex, settings.track]);

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = settings.musicVolume;
  }, [settings.musicVolume]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const startMusic = () => {
      if (settings.track !== "off") void musicRef.current?.play().catch(() => {});
    };
    document.addEventListener("pointerdown", startMusic, { once: true });
    document.addEventListener("keydown", startMusic, { once: true });
    return () => {
      document.removeEventListener("pointerdown", startMusic);
      document.removeEventListener("keydown", startMusic);
    };
  }, [settings.track]);

  function setTrack(track: AudioTrack) {
    if (track === "1") setPlaylistIndex(0);
    setSettings((current) => ({ ...current, track }));
  }

  function setMusicVolume(musicVolume: number) {
    setSettings((current) => ({ ...current, musicVolume }));
  }

  function setEffectsVolume(effectsVolume: number) {
    setSettings((current) => ({ ...current, effectsVolume }));
  }

  function playEffect(effect: AudioEffect) {
    if (typeof Audio === "undefined") return;

    const sound = new Audio(effects[effect]);
    sound.volume = settings.effectsVolume;
    void sound.play().catch(() => {});
  }

  return { settings, setTrack, setMusicVolume, setEffectsVolume, playEffect };
}
