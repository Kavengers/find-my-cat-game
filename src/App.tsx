import { useEffect, useState, useRef } from 'react';
import './App.css';
import { Tile } from './components';
import winSound from './assets/sounds/win.mp3';
import failSound from './assets/sounds/fail.mp3';
import failLateSound from './assets/sounds/timeout.mp3';
import correctSound from './assets/sounds/click.mp3';

function App() {
  const [correctValues, setCorrectValues] = useState<Record<number, boolean>>({});
  const [tiles, setTiles] = useState<number[]>([]);
  const [values, setValues] = useState<Record<number, boolean>>({});
  const [current, setCurrent] = useState(1);
  const [passed, setPassed] = useState(false);
  const [failed, setFailed] = useState<boolean | null>(null);
  const [clicks,setClicks] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create refs for each audio element
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const failAudioRef = useRef<HTMLAudioElement | null>(null);
  const failLateAudioRef = useRef<HTMLAudioElement | null>(null);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);

  const generateNewGrid = () => {
      const grid = [];
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let cell = nums.length; cell > 0; cell--) {
        const random = Math.floor(Math.random() * nums.length);
        const val = nums[random];
        grid.push(val);
        nums.splice(random, 1);
      }
      setTiles(grid);
      console.log(grid);
  }
  useEffect(() => {
    generateNewGrid();
  }, []);

  const handleClick = (tile: number) => {
  
    if(isPlaying) return;
    setClicks((click)=>click+1);
    setFailed(null);
    if (passed || correctValues[tile]) return false;
    setValues((prev) => ({ ...prev, [tile]: true }));
    setTimeout(() => handleCheck(tile), 500);
  };

  const handleCheck = (tile: number) => {
    if (tile !== current) {
      handleFail();
    } else {
      if (current === 9) {
        handlePass();
      } else {
        setCorrectValues((correctValues) => ({ ...correctValues, [tile]: true }));
        correctAudioRef.current?.play();
      }
      setCurrent((current) => current + 1);
    }
  };

  const handleFail = () => {
    if (current >= 5) {
      setFailed(true);
      failLateAudioRef.current?.play();
    } else {
      failAudioRef.current?.play();
    }
    reset();
  };

  const handlePass = () => {
      setClicks(0);
      setPassed(true);
      winAudioRef.current?.play();
  }

  const reset = () => {
    setValues(() => ({}));
    setCurrent(()=>1);
    setCorrectValues(() => ({}));
  };

  const restart = () => {
    console.log("Running");
    reset();
    setClicks(0);
    setPassed(false);
    setFailed(null);
    generateNewGrid();
    
    console.log("Running still" );

  }

  return (
    <>
    <div className='moves-count'>
      <a href='#' className='shuffle' onClick={restart}>Reshuffle Grid</a>
      {clicks > 0 && <h1>Moves Played: {clicks}</h1>}
    </div>
    <div className="container">
      <div className="tiles">
        {tiles.map((tile) => (
          <Tile
            key={tile}
            value={tile}
            onClick={handleClick}
            failed={failed}
            passed={passed}
            flipped={values[tile]}
          />
        ))}
      </div>
    </div>
    <div className='audio-section'>
      <audio
        ref={winAudioRef}
        src={winSound}
        onPlay={()=>setIsPlaying(true)}
        onEnded={()=>{
          setIsPlaying(false);
          reset();
          restart();
        }}
        preload="auto"
      />
      <audio
        ref={failAudioRef}
        src={failSound}
        preload="auto"
      />
      <audio
        ref={failLateAudioRef}
        src={failLateSound}
        onPlay={()=>setIsPlaying(true)}
        preload="auto"
        onEnded={()=> { 
          setIsPlaying(false);
          restart();
        }}
      />
      <audio
        ref={correctAudioRef}
        src={correctSound}
        preload="auto"
      />
    </div>
    </>
  );
}

export default App;
