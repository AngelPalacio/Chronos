import { useState, useEffect, useRef } from "react";
import beep from "./sounds/softBeep.wav";
import click from "./sounds/click.wav";
import clack from "./sounds/clack.wav";
import "./App.css";

const beepSound = new Audio(beep);
const clickSound = new Audio(click);
const clackSound = new Audio(clack);

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Cronometro = (props) => {
  const [startTime, setStartTime] = useState();
  const [isBeeping, setIsBeeping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => setProgress(0), [startTime]);

  const getCurrentValue = () => {
    if (!startTime) {
      return "00:00:00";
    }

    const diffMiliseconds = new Date().getTime() - startTime;
    const diffSeconds = diffMiliseconds / 1000;
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    const fiveSecondValue = (Math.round(diffSeconds) % 60) % 5;
    setProgress(((diffMiliseconds % 5000) * 100) / 5000 + 10);

    if (fiveSecondValue === 0) {
      if (!isBeeping) {
        setIsBeeping(true);
        if (fiveSecondValue === 0) makeBeepSound();
        else makeClickClackSound(fiveSecondValue % 2 === 0);
      }
    } else {
      setIsBeeping(false);
    }

    const strSeconds = format(diffSeconds % 60);
    const strMinutes = format(diffMinutes % 60);
    const strHours = format(diffHours % 60);

    return `${strHours}:${strMinutes}:${strSeconds}`;
  };

  useInterval(() => {
    setCurrentValue(getCurrentValue());
  }, 100);

  const start = () => {
    if (startTime) {
      setStartTime(0);
    } else {
      setStartTime(new Date().getTime());
    }
  };

  const format = (num) => num.toFixed(0).padStart(2, "0");

  return (
    <div className="cronometro">
      <div id="buttons">
        <a id="startButton" onClick={start}>
          {startTime ? "Pause" : "Start"}
        </a>
      </div>
      <div id="value">
        <h1>{currentValue}</h1>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
};

const makeBeepSound = () => {
  beepSound.play();
};

const makeClickClackSound = (makeClick) => {
  if (makeClickClackSound) clickSound.play();
  else clackSound.play();
};

const ProgressBar = ({ value }) => {
  return (
    <div className="fiveSecondsProgressBar">
      <div style={{ width: `${value}%` }}></div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Cronometro />
    </div>
  );
}

export default App;
