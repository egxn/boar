import emojis from './presets/emojis.json';
import Key, { KeyInterface } from './Key';
import ModalNewKey from './ModalNewKey';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const PRESETS = [emojis];

function App() {
  const [keys, setKeys] = useState<KeyInterface[]>([]);
  const [showModalNewKey, setShowModalNewKey] = useState(false);
  const [presets, setPresets] = useState<string[]>([]);

  const openModalNewKey = () => setShowModalNewKey(true);
  const closeModalNewKey = () => setShowModalNewKey(false);
  const saveKey = (newKey: KeyInterface) => {
    const newKeys: KeyInterface[] = [...keys, newKey];
    setKeys(newKeys);
    localStorage.setItem('keys', JSON.stringify(newKeys));
    setShowModalNewKey(false);
  };


  useEffect(() => {
    const storedKeys = JSON.parse(localStorage.getItem('keys') || '[]');
    setKeys([...storedKeys, ...keys]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  }

  return (
    <div className='boar'>
      <div className='btns'>
        {keys.map((key, index) => <Key key={`${index}-${key.label}`} {...key} />)}
      </div>
      {!showModalNewKey && <div className='btn-bar'>
        <div className='btn-sm' onClick={openModalNewKey}> + </div>
        {PRESETS.map(preset => (
          <div key={preset.title} className='btn-sm' onClick={() => addPreset(preset)}>
            {preset.label}
          </div>
        ))}
      </div>}
      {showModalNewKey && <ModalNewKey onClose={closeModalNewKey} onSave={saveKey} />}
    </div>
  );
}


const root = createRoot( document.getElementById('root') as Element); 
root.render(<App />);

