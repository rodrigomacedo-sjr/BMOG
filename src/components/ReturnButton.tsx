type ReturnButtonProps = {
  onClick: () => void;
};

export default function ReturnButton({ onClick }: ReturnButtonProps) {
  return <button onClick={onClick}>back to main screen</button>;
}
