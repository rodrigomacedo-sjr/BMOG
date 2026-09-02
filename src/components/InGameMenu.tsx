type InGameMenuProps = {
  onGiveUp: () => void;
};

// TODO
// this is a placeholder its ALL wrong
export default function InGameMenu({ onGiveUp }: InGameMenuProps) {
  return (
    <div className="game-hud">
      <div className="game-hud__stats">
        <p className="game-hud__stat">time: <b>7.26<small>s</small></b></p>
        <p className="game-hud__stat game-hud__stat--combo">combo: <b>3.4x</b></p>
      </div>
      <button className="game-hud__give-up" onClick={onGiveUp}>give up</button>
    </div>
  );
}
