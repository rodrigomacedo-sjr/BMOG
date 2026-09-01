type MainScreenProps = {
  onStart: () => void;
};

function MainScreen({ onStart }: MainScreenProps) {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">BMOG</h1>
      <button onClick={onStart}>PLAY</button>
    </div>
  );
}

export default MainScreen;
