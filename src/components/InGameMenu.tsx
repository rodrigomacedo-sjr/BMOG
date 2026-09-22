import { calcTime } from "@/game/utils";

type InGameMenuProps = {
  time: number;
  score: number;
  combo: number;
  onGiveUp: () => void;
};

export default function InGameMenu({
  time,
  score,
  combo,
  onGiveUp,
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
          combo: <b>{combo.toFixed(1)}x</b>
        </p>
      </div>
      <button className="game-hud__give-up" onClick={onGiveUp}>
        give up
      </button>
    </div>
  );
}
