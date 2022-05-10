import React, { useEffect, useState } from 'react';
import { KeyInterface } from './types';
import Key from './Key';
import ModalNewKey from './ModalNewKey';
import './styles.css';

function App() {
  const [keys, setKeys] = useState<KeyInterface[]>([]);
  const [showModalNewKey, setShowModalNewKey] = useState(false);

  const openModalNewKey = () => setShowModalNewKey(true);
  const closeModalNewKey = () => setShowModalNewKey(false);
  const saveKey = (newKey: KeyInterface) => {
    const newKeys: KeyInterface[] = [...keys, newKey];
    setKeys(newKeys);
    localStorage.setItem('keys', JSON.stringify(newKeys));
    setShowModalNewKey(false);
  };


  useEffect(() => {
    const keys = JSON.parse(localStorage.getItem('keys') || '[]');
    setKeys(keys);
  }, []);

  return (
    <div className='boar'>
      <div className='btns'>
        {keys.map((key, index) => <Key key={index} {...key} />)}
        <div onClick={openModalNewKey}>
          <Key
            background='#f0f0f0' 
            border='#ccc' 
            command='' 
            label='+'
            omitEvent
          />
        </div>
      </div>
      { showModalNewKey && <ModalNewKey onClose={closeModalNewKey} onSave={saveKey} />}
    </div>
  );
}

export default App;
