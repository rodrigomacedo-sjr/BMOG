type InGameMenuProps = {
  onGiveUp: () => void;
};

// TODO
// this is a placeholder its ALL wrong
export default function InGameMenu({ onGiveUp }: InGameMenuProps) {
  return (
    <div>
      <div>
        <p>time: 7.26s</p>
        <p>combo: 3.4x</p>
      </div>
      <button onClick={onGiveUp}>give up</button>
    </div>
  );
}
