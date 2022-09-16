import { useLayoutEffect, useState } from "react";
import './styles.css';

export interface KeyInterface {
  background: string;
  command: string;
  idApp?: string;
  label: string;
  kind: string;
}

export interface KeyInterface {
  remove?: (command: string) => void;
}

function randomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

function Key({ background, command, kind, label, remove }: KeyInterface) {
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [borderColor, setBorderColor] = useState(randomHexColor());
  const BORDER_OK = "#00ff00";
  const BORDER_ERROR = "#ff0000";
  
  useLayoutEffect(() => {
    if ([BORDER_OK, BORDER_ERROR].includes(borderColor)) {
      setTimeout(() =>  setBorderColor(randomHexColor()) , 250); 
    }
  });

  const pushKey = async (kind: string) => {
    const url = window.location.host;
    console.log('pushed key')
    const res = await fetch(`http://${url}/grunt?${kind}=${command}`);
    console.log(res);
    if (res.status === 200) {
      setBorderColor(BORDER_OK);
    } else {
      setBorderColor(BORDER_ERROR);
    }
  }

  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    if (touchStartTime !== 0 && touchDuration < 500) {
      pushKey(kind);
    } else if (remove) {
      remove(command);
    }
    setTouchStartTime(0);
  }


  return (
    <button 
      className="key"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: `${background}`,
        border: `4px solid ${randomHexColor()}`,
      }}
    >
      {label}
    </button>
  );
}

export default Key;