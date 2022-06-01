import React, { useState } from "react";
import { KeyInterface } from "./Key";
import './styles.css';

interface ModalNewKeyProps {
  onClose: () => void;
  onSave: (newKey: KeyInterface) => void;
};

function ModalNewKey({ onClose, onSave }: ModalNewKeyProps) {
  const [kind, setKind] = useState('keys');
  const [newKey, setNewKey] = useState<KeyInterface>({
    command: "",
    label: "",
    background: "#ffffff",
    border: "#00ffff",
    idApp: "",
    kind,
  });

  const saveKey = () => {
    const { command, label, background, border } = newKey;
    if (command && label && background && border) {
      onSave(newKey);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setNewKey({ ...newKey, [id]: value });
  }

  const toggleKind = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    if (checked) {
      setNewKey({ ...newKey, kind: id });
    }
  }

  return (
    <div className="modal-new-key">
      <div className="row">
        <h1>Add Key</h1>
      </div>
      <div className="row">
        <label htmlFor="command">Command</label>
        <input className="input-text" id="command" list="keys" onChange={handleChange} type="text" value={newKey.command} />
      </div>
      <div className="row">
        <label htmlFor="label">Label</label>
        <input className="input-text" id="label" maxLength={9} onChange={handleChange} type="text" value={newKey.label} />
      </div>
      <div className="row" >
        <label htmlFor="keys"> Kind</label>
        <label htmlFor="keys"> Keys</label>
        <input id="keys" onChange={() => setKind("keys")} name="kind" type="radio" value="keys" checked={kind === "keys"} />
        <label htmlFor="keys"> Type</label>
        <input id="type" onChange={() => setKind("kind")} name="kind" type="radio" value="type" checked={kind === "type"}/>
      </div>
      <div className="row">
        <label htmlFor="background">Background</label>
        <input className="input-color" id="background" onChange={handleChange} type="color" value={newKey.background} />
      </div>
      <div className="row">
        <label htmlFor="border">Border</label>
        <input className="input-text" id="border" onChange={handleChange} type="color" value={newKey.border} />
      </div>
      <div className="row save-n-close">
        <div className="key" onClick={onClose} role="button">❌</div>
        <div className="key" onClick={saveKey} role="button">💾</div>
      </div>
    </div>
  );
}

export default ModalNewKey;