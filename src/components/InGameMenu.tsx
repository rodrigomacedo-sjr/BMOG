import { calcTime } from "@/game/utils";

type InGameMenuProps = {
  time: number;
  onGiveUp: () => void;
};

// TODO
// this is a placeholder its ALL wrong
export default function InGameMenu({ time, onGiveUp }: InGameMenuProps) {
  return (
    <div className="game-hud">
      <div className="game-hud__stats">
        <p className="game-hud__stat">
          time: <b>{calcTime(time)}</b>
        </p>
        <p className="game-hud__stat game-hud__stat--combo">
          combo: <b>3.4x</b>
        </p>
      </div>
      <button className="game-hud__give-up" onClick={onGiveUp}>
        give up
      </button>
    </div>
  );
}
