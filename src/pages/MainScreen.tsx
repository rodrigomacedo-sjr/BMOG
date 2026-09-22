import logo from "@/assets/bmo.svg";

type MainScreenProps = {
  onStart: () => void;
  onRecords: () => void;
};

function MainScreen({ onStart, onRecords }: MainScreenProps) {
  return (
    <div className="main-menu">
      <img src={logo} alt="BMOG logo" className="main-menu__logo" />
      <h1 className="main-menu__title">BMOG</h1>
      <div className="main-menu__actions">
        <button className="main-menu__play" onClick={onStart}>PLAY</button>
        <button className="main-menu__records" onClick={onRecords} aria-label="View records">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MainScreen;
