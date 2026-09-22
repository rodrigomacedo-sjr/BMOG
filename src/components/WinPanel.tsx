import { calcTime } from "@/game/utils";

type WinPanelProps = {
  time: number;
  score: number;
  highestCombo: number;
  newBestTime: boolean;
  newBestScore: boolean;
  onReplay: () => void;
  onMenu: () => void;
};

export default function WinPanel({
  time,
  score,
  highestCombo,
  newBestTime,
  newBestScore,
  onReplay,
  onMenu,
}: WinPanelProps) {
  return (
    <section className="win-panel" aria-labelledby="win-panel-title">
      <h1 id="win-panel-title" className="win-panel__title">
        you win
      </h1>
      {(newBestTime || newBestScore) && (
        <p className="win-panel__record" role="status">
          <span>new best</span>
          {newBestTime && <b>time</b>}
          {newBestScore && <b>score</b>}
        </p>
      )}
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
