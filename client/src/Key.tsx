import React, { useEffect, useState } from "react";
import type { KeyInterface } from "./types";
import './styles.css';


function Key({ background, border, command, label, omitEvent }: KeyInterface) {
  const [borderColor, setBorderColor] = useState(border);
  const BORDER_OK = "#00ff00";
  const BORDER_ERROR = "#ff0000";
  
  useEffect(() => {
    if ([BORDER_OK, BORDER_ERROR].includes(borderColor)) {
      setTimeout(() =>  setBorderColor(border) , 250); 
    }
  });

  const pushKey = async () => {
    if (!omitEvent) {
      const url = window.location.host;
      const res = await fetch(`http://${url}/grunt?keys=${command}`);
      if (res.status === 200) {
        setBorderColor(BORDER_OK);
      } else {
        setBorderColor(BORDER_ERROR);
      }
    }
  }

  return (
    <div 
      className="key" 
      onClick={pushKey}
      role="button"
      style={{
        background: `${background}`,
        border: `4px solid ${borderColor}`,
      }}
    >
      {label}
    </div>
  );
}

export default Key;