import emojis from './presets/emojis.json';
import cutCopyPaste from './presets/cut-copy-paste.json';

import Key, { KeyInterface } from './Key';
import ModalNewKey from './ModalNewKey';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRESETS = [cutCopyPaste, emojis];

function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [keys, setKeys] = useState<KeyInterface[]>([]);
  const [showModalNewKey, setShowModalNewKey] = useState(false);
  const [presets, setPresets] = useState<string[]>([]);
  const [windowApp, setWindowApp] = useState<string>('');

  const openModalNewKey = () => setShowModalNewKey(true);
  const closeModalNewKey = () => setShowModalNewKey(false);

  const saveKey = (newKey: KeyInterface) => {
    const newKeys: KeyInterface[] = [...keys, newKey];
    setKeys(newKeys);
    localStorage.setItem('keys', JSON.stringify(newKeys));
    setShowModalNewKey(false);
  };

  const removeKey = (command: string) => {
    const newKeys: KeyInterface[] = keys.filter(key => key.command !== command);
    setKeys(newKeys);
    localStorage.setItem('keys', JSON.stringify(newKeys));
  }

  const toFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (appRef?.current?.requestFullscreen) {
      appRef.current.requestFullscreen();
    } 
  }

  const deleteButtonScreen = () => setKeys([]);

  useEffect(() => {
    const storedKeys = JSON.parse(localStorage.getItem('keys') || '[]');
    setKeys([...storedKeys, ...keys]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = window.location.host;
    let socket: WebSocket = new WebSocket(`ws://${url}/`);
    socket.onopen = (e) => console.log("WS Connection established");
    socket.onmessage = (event) => setWindowApp(String(event.data).toLowerCase());
  }, []);

  const addPreset = (preset: {
    title: string;
    keys: KeyInterface[];
    label: string;
  }) => {
    const { title, keys: presetKeys } = preset;
    if (!presets.includes(title)) {
      const newKeys: KeyInterface[] = [...keys, ...presetKeys];
      setKeys(newKeys);
      setPresets(presets => [...presets, title]);
    } else {
      setKeys(currentKeys => currentKeys.filter(key => !presetKeys.includes(key)));
      setPresets(presets => presets.filter(preset => preset !== title));
    }
  }

  return (
    <div className='boar' ref={appRef}>
      {!showModalNewKey && <div className='btn-bar'>
        <button className='btn-sm' onClick={openModalNewKey}> + </button>
        <button className='btn-sm' onClick={toFullscreen}> 📺 </button>
        {PRESETS.map(preset => (
          <button key={preset.title} className='btn-sm' onClick={() => addPreset(preset)}>
            {preset.label}
          </button>
        ))}
        <button className='btn-sm' onClick={deleteButtonScreen}> 🧹 </button>
      </div>}
      <div className='btns'>
        {keys
          .filter(key => windowApp.includes(key.appTitle?.toLowerCase() || ''))
          .map((key, index) => <Key key={`${index}-${key.label}`} {...key} remove={removeKey} />)}
        {keys
          .filter(key => !windowApp.includes(key.appTitle?.toLowerCase() || ''))
          .map((key, index) => <Key key={`${index}-${key.label}`} {...key} remove={removeKey} />)}
      </div>
      {showModalNewKey && <ModalNewKey onClose={closeModalNewKey} onSave={saveKey} />}
    </div>
  );
}


const root = createRoot( document.getElementById('root') as Element); 
root.render(<App />);