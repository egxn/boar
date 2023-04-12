import { useLayoutEffect, useState } from "react";
import './styles.css';

export interface KeyCapGroup {
  title: string;
  label: string;
  keycaps: KeyCapProps[];
}

export interface KeyCapProps {
  appTitle?: string;
  background?: string;
  command: string;
  label: string;
  kind: string;
  code?: string;
}

export interface KeyCapProps {
  remove?: (command: string) => void;
}

function randomHexColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

function Keycap({ background, code, command, kind, label, remove }: KeyCapProps) {
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [borderColor, setBorderColor] = useState(randomHexColor());
  const BORDER_OK = "#00ff00";
  const BORDER_ERROR = "#ff0000";
  
  useLayoutEffect(() => {
    if ([BORDER_OK, BORDER_ERROR].includes(borderColor)) {
      setTimeout(() =>  setBorderColor(randomHexColor()) , 250); 
    }
  });

  const pushKeycap = async (kind: string) => {
    const url = window.location.host;
    const res = await fetch(`http://${url}/grunt?${kind}=${command}&code=${code}`);
    if (res.status === 200) {
      setBorderColor(BORDER_OK);
    } else {
      setBorderColor(BORDER_ERROR);
    }
  }

  const handleTouchStart = () => setTouchStartTime(Date.now());
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    if (touchStartTime !== 0 && touchDuration < 500) {
      pushKeycap(kind);
    } else if (remove) {
      remove(command);
    }
    setTouchStartTime(0);
  }


  return (
    <button
      aria-label={command}
      className="keycap"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
//      onClick={() => pushKeycap(kind)}
      style={{
        background: `${background}`,
        border: `4px solid ${randomHexColor()}`,
      }}
    >
      {label}
    </button>
  );
}

export default Keycap;