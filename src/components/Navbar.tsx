import ReturnButton from "@/components/ReturnButton";
import logo from "@/assets/bmo.svg";

type NavbarProps = {
  onBack: () => void;
};

export default function Navbar({ onBack }: NavbarProps) {
  return (
    <div className="site-nav">
      <div className="site-nav__brand">
        <img src={logo} alt="BMOG logo" className="site-nav__logo" />
        <h1 className="site-nav__title">BMOG</h1>
      </div>
      <ReturnButton onClick={onBack} />
    </div>
  );
}
