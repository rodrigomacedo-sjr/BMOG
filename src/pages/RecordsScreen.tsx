import { calcTime } from "@/game/utils";
import { orderedRecords, readRecords } from "@/storage";

export default function RecordsScreen() {
  const records = orderedRecords(readRecords());

  return (
    <main className="records-screen" aria-labelledby="records-title">
      <h1 id="records-title" className="records-screen__title">Records</h1>
      {records.length ? (
        <div className="records-screen__list">
          {records.map(({ key, record }) => {
            const [gridSize, base, startingBoard] = key.split(":");

            return (
              <section className="record-card" key={key}>
                <h2>{gridSize} x {gridSize} / Base {base} / {startingBoard}</h2>
                <dl>
                  <div>
                    <dt>best time</dt>
                    <dd>{calcTime(record.bestTime)}</dd>
                  </div>
                  <div>
                    <dt>best score</dt>
                    <dd>{record.bestScore}</dd>
                  </div>
                  <div>
                    <dt>best combo</dt>
                    <dd>{record.highestCombo.toFixed(1)}x</dd>
                  </div>
                </dl>
              </section>
            );
          })}
        </div>
      ) : (
        <p className="records-screen__empty">No completed games yet.</p>
      )}
    </main>
  );
}
