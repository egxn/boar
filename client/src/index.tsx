import emojis from './presets/emojis.json';
import cutCopyPaste from './presets/cut-copy-paste.json';
import terminal from './presets/terminal.json';

import Keycap, { KeycapProps } from './Keycap';
import ModalNewKeycap from './ModalNewKeycap';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRESETS = [cutCopyPaste, terminal ,emojis];

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [keycaps, setKeycaps] = useState<KeycapProps[]>([]);
  const [showModalNewKeycap, setShowModalNewKeycap] = useState(false);
  const [presets, setPresets] = useState<string[]>([]);
  const [windowApp, setWindowApp] = useState<string>('');

  useEffect(() => {
    const storedKeycaps = JSON.parse(localStorage.getItem('keys') || '[]');
    setKeycaps([...storedKeycaps, ...keycaps]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = window.location.host;
    let socket: WebSocket = new WebSocket(`ws://${url}/`);
    socket.onopen = (e) => console.log("WS Connection established");
    socket.onmessage = (event) => setWindowApp(String(event.data).toLowerCase());
  }, []);

  const openModalNewKeycap = () => setShowModalNewKeycap(true);
  const closeModalNewKeycap = () => setShowModalNewKeycap(false);

  const saveKeycap = (newKeycap: KeycapProps) => {
    const newKeycaps: KeycapProps[] = [...keycaps, newKeycap];
    setKeycaps(newKeycaps);
    localStorage.setItem('keys', JSON.stringify(newKeycaps));
    setShowModalNewKeycap(false);
  };

  const removeKeycap = (command: string) => {
    const newKeycaps: KeycapProps[] = keycaps.filter(key => key.command !== command);
    setKeycaps(newKeycaps);
    localStorage.setItem('keys', JSON.stringify(newKeycaps));
  }

  const toFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (appRef?.current?.requestFullscreen) {
      appRef.current.requestFullscreen();
    } 
  }

  const deleteButtonScreen = () => setKeycaps([]);

  const addPreset = (preset: {
    title: string;
    keys: KeycapProps[];
    label: string;
  }) => {
    const { title, keys: presetKeys } = preset;
    if (!presets.includes(title)) {
      const newKeys: KeycapProps[] = [...keycaps, ...presetKeys];
      setKeycaps(newKeys);
      setPresets(presets => [...presets, title]);
    } else {
      setKeycaps(currentKeycaps => currentKeycaps.filter(keycap => !presetKeys.includes(keycap)));
      setPresets(presets => presets.filter(preset => preset !== title));
    }
  }

  const getSelectedKeycaps = (keycaps: KeycapProps[]) => {
    const keysWindowApp = keycaps.filter(keycap => windowApp.includes(keycap.appTitle?.toLowerCase() || ''));
    return keysWindowApp.length > 0 ? keysWindowApp : keycaps;
  }

  return (
    <div className='boar' ref={appRef}>
      {!showModalNewKeycap && <div className='btn-bar'>
        <button className='btn-sm' onClick={openModalNewKeycap}> + </button>
        <button className='btn-sm' onClick={toFullscreen}> 📺 </button>
        {PRESETS.map(preset => (
          <button key={preset.title} className='btn-sm' onClick={() => addPreset(preset)}>
            {preset.label}
          </button>
        ))}
        <button className='btn-sm' onClick={deleteButtonScreen}> 🧹 </button>
      </div>}
      <div className='btns'>
        { getSelectedKeycaps(keycaps).map((keycap, index) => <Keycap key={`${index}-${keycap.label}`} {...keycap} remove={removeKeycap} />)}
      </div>
      {showModalNewKeycap && <ModalNewKeycap onClose={closeModalNewKeycap} onSave={saveKeycap} />}
    </div>
  );
}


const root = createRoot( document.getElementById('root') as Element); 
root.render(<App />);