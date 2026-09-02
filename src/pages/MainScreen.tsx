import logo from "@/assets/bmo.svg";

type MainScreenProps = {
  onStart: () => void;
};

function MainScreen({ onStart }: MainScreenProps) {
  return (
    <div className="main-menu">
      <img src={logo} alt="BMOG logo" className="main-menu__logo" />
      <h1 className="main-menu__title">BMOG</h1>
      <button className="main-menu__play" onClick={onStart}>PLAY</button>
    </div>
  );
}

export default MainScreen;
