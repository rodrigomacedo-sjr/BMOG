import ReturnButton from "@/components/ReturnButton";
import logo from "@/assets/bmo.svg";
import type { GameOptions } from "@/types";

type NavbarProps = {
  onBack: () => void;
  gameOptions: GameOptions;
  showGameMode: boolean;
};

export default function Navbar({ onBack, gameOptions, showGameMode }: NavbarProps) {
  return (
    <div className="site-nav">
      <div className="site-nav__brand">
        <img src={logo} alt="BMOG logo" className="site-nav__logo" />
        <h1 className="site-nav__title">BMOG</h1>
      </div>
      {showGameMode && (
        <p className="site-nav__mode">
          {gameOptions.gridSize} x {gameOptions.gridSize} / Base {gameOptions.base} / {gameOptions.startingBoard}
        </p>
      )}
      <ReturnButton onClick={onBack} />
    </div>
  );
}
