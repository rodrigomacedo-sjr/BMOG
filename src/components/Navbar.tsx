import ReturnButton from "@/components/ReturnButton";
import logo from "@/assets/bmo.svg";

type NavbarProps = {
  onBack: () => void;
};

export default function Navbar({ onBack }: NavbarProps) {
  return (
    <div>
      <div>
        <img src={logo} alt="BMOG logo" className="w-20" />
        <h1>BMOG</h1>
      </div>
      <ReturnButton onClick={onBack} />
    </div>
  );
}
