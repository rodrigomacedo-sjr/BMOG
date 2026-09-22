import { calcTime } from "@/game/utils";

type WinPanelProps = {
  time: number;
  score: number;
  highestCombo: number;
  onReplay: () => void;
  onMenu: () => void;
};

export default function WinPanel({
  time,
  score,
  highestCombo,
  onReplay,
  onMenu,
}: WinPanelProps) {
  return (
    <section className="win-panel" aria-labelledby="win-panel-title">
      <p className="win-panel__eyebrow">board cleared</p>
      <h1 id="win-panel-title" className="win-panel__title">
        you win
      </h1>
      <dl className="win-panel__stats">
        <div>
          <dt>time</dt>
          <dd>{calcTime(time)}</dd>
        </div>
        <div>
          <dt>score</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>highest combo</dt>
          <dd>{highestCombo.toFixed(1)}x</dd>
        </div>
      </dl>
      <div className="win-panel__actions">
        <button className="win-panel__replay" onClick={onReplay}>
          replay
        </button>
        <button className="win-panel__menu" onClick={onMenu}>
          menu
        </button>
      </div>
    </section>
  );
}
