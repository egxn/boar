import emojisFaces from './presets/emojis-faces.json';
import emojisNature from './presets/emojis-nature.json';
import cutCopyPaste from './presets/cut-copy-paste.json';
import terminal from './presets/terminal.json';
import ubuntu from './presets/ubuntu.json';

import Keycap, { KeyCapProps, KeyCapGroup } from './Keycap';
import ModalNewKeycap from './ModalNewKeycap';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const [code, setCode] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [groupTitle, setGroupTitle] = useState<string>('boar');
  const [groups, setGroups] = useState<KeyCapGroup[]>([]);

  const [showModalNewKeycap, setShowModalNewKeycap] = useState(false);

  useEffect(() => {
    const storedKeycaps = JSON.parse(localStorage.getItem('keycaps') || '[]');
    const userKeycapsGroup = {
      title: 'boar',
      label: '🐗',
      keycaps: storedKeycaps
    };
    setGroups([userKeycapsGroup, cutCopyPaste, terminal, emojisFaces, emojisNature, ubuntu]);
  }, []);

  useEffect(() => {
    const url = window.location.host;
    ws.current = new WebSocket(`ws://${url}/`);
    ws.current.onopen = (e) => console.log('WS Connection established');
    ws.current.onclose = (e) => console.log('WS Connection closed');
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (event) => {
      const appName = String(event.data).toLowerCase().trim();
      if (groups.some(({ title }) => appName.includes(title))) {
        setGroupTitle(appName);
      } else {
        setGroupTitle('boar');
      }
    };
  }, [groupTitle, groups]);

  const openModalNewKeycap = () => setShowModalNewKeycap(true);
  const closeModalNewKeycap = () => setShowModalNewKeycap(false);

  const saveKeycap = (newKeycap: KeyCapProps) => {
    const [boarGroup, ...restGroups] = groups;
    const newKeycaps: KeyCapProps[] = [...boarGroup.keycaps, newKeycap];
    setGroups([{...boarGroup, keycaps: newKeycaps}, ...restGroups]);
    localStorage.setItem('keycaps', JSON.stringify(newKeycaps));
    setShowModalNewKeycap(false);
  };

  const removeKeycap = (command: string) => {
    const [boarGroup, ...restGroups] = groups;
    const newKeycaps: KeyCapProps[] = boarGroup.keycaps.filter(keycap => keycap.command !== command);
    setGroups([{...boarGroup, keycaps: newKeycaps}, ...restGroups]);
    localStorage.setItem('keycaps', JSON.stringify(newKeycaps));
  };

  const toFullscreen = () => {
    if (document?.fullscreenElement) {
      document?.exitFullscreen();
    } else if (appRef?.current?.requestFullscreen) {
      appRef.current.requestFullscreen();
    }
  };

  const getKeycaps = () => {
    const mapButtons = (keycaps: KeyCapProps[]) => keycaps
      .map((keycap, i) => <Keycap code={code} key={`${i}-${keycap.label}`} {...keycap} remove={removeKeycap} />);
    
    const appKeyCaps = groups
      .filter(group => group.title === groupTitle)

    return appKeyCaps.length ? 
      mapButtons(appKeyCaps[0]?.keycaps || []) :
      mapButtons(groups[0]?.keycaps || []);
  };

  return (
    <div className='boar' ref={appRef}>
      {!code &&
        <div className='row'>
          🔓
          <input
            onChange={(e) => setCodeInput(e.target.value)} 
            value={codeInput}
          />
          <button className='btn-sm' onClick={() => setCode(codeInput)}>💾</button>
        </div>
      }
      {!showModalNewKeycap && code &&
        <div className='btn-bar'>
          <button className='btn-sm'onClick={openModalNewKeycap}> + </button>
          <button 
            aria-label='fullscreen'
            className='btn-sm'
            onClick={toFullscreen}
          > 
            📺
          </button>
          {groups.map(({ label, title }) => (
            <button
              arial-label={title}
              className={`btn-sm ${groupTitle === title ? 'btn-active' : ''}`}
              key={title}
              onClick={() => setGroupTitle(title)}
            >
              {label}
            </button>
          ))}
        </div>
      }
      { code &&
        <div className='btns'>
          {getKeycaps()}
        </div>
      }
      {showModalNewKeycap && <ModalNewKeycap onClose={closeModalNewKeycap} onSave={saveKeycap} />}
    </div>
  );
}

const root = createRoot( document.getElementById('root') as Element); 
root.render(<App />);