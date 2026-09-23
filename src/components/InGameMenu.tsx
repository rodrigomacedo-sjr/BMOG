import { calcTime } from "@/game/utils";
import type { RefObject } from "react";

type InGameMenuProps = {
  time: number;
  score: number;
  combo: number;
  comboBump: number;
  onGiveUp: () => void;
  giveUpButtonRef: RefObject<HTMLButtonElement | null>;
};

export default function InGameMenu({
  time,
  score,
  combo,
  comboBump,
  onGiveUp,
  giveUpButtonRef,
}: InGameMenuProps) {
  return (
    <div className="game-hud">
      <div className="game-hud__stats">
        <p className="game-hud__stat">
          time: <b>{calcTime(time)}</b>
        </p>
        <p className="game-hud__stat">
          score: <b>{score}</b>
        </p>
        <p className="game-hud__stat game-hud__stat--combo">
          combo: <b key={comboBump}>{combo.toFixed(1)}x</b>
        </p>
      </div>
      <button ref={giveUpButtonRef} className="game-hud__give-up" onClick={onGiveUp}>
        give up
      </button>
    </div>
  );
}
