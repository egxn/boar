import { useState } from "react";
import { KeyCapProps } from "./Keycap";
import keyCommands from "./keys";
import './styles.css';

enum Kind {
  Keys = "keys",
  Type = "type",
}

interface ModalNewKeycapProps {
  onClose: () => void;
  onSave: (newKeycap: KeyCapProps) => void;
};

function ModalNewKeycap({ onClose, onSave }: ModalNewKeycapProps) {
  const [newKeycap, setNewKeycap] = useState<KeyCapProps>({
    appTitle: 'boar',
    background: '#ffffff',
    command: '',
    kind: Kind.Keys,
    label: '',
  });

  const saveKey = () => {
    const { command, label, background } = newKeycap;
    if (command && label && background) {
      onSave(newKeycap);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewKeycap(k =>  ({ ...k, [event.target.id]: event.target.value }));
  const toggleKind = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewKeycap(k => ({ ...k, kind: (event.target.value as Kind), command: '' }));
  const pushCommand = (command: string) => 
    setNewKeycap(k => ({ ...k, command: k.command ? k.command + '+' + command : command }));

  return (
    <div className="modal">
      <div className="row modal-title">
        <div className="title-btn" onClick={onClose} role="button">Close ❌</div>
        Add a new key
        <div className="title-btn" onClick={saveKey} role="button">Save 💾</div>
      </div>

      <div className="row label">
        <label htmlFor="label"> Label </label>
        <input
          className="input-text" 
          id="label" 
          maxLength={9} 
          onChange={handleChange} 
          type="text" 
          value={newKeycap.label}
        />
      </div>

      <div className="row row-type" >
        <input
          id="keys"
          onChange={toggleKind} 
          name="kind" 
          type="radio"
          value={Kind.Keys} 
          checked={newKeycap.kind === "keys"}
        />
        <label htmlFor="keys"> Keys </label>
        <input 
          id="type" 
          onChange={toggleKind} 
          name="kind" 
          type="radio" 
          value={Kind.Type}
          checked={newKeycap.kind === "type"}
        />
        <label className="ml" htmlFor="type"> Text </label>
      </div>

      {newKeycap.kind === Kind.Keys && (
        <div className="row keycap-commands">
          {keyCommands.map((keyCommand) =>
            <button 
              className="keycap-command"
              key={keyCommand}
              onClick={() => pushCommand(keyCommand)}
            >
              {keyCommand}
            </button>)}
        </div>
      )}

      <div className="row">
        <label htmlFor="command">Command</label>
        <input
          disabled={newKeycap.kind === "keys"}
          className="input-text"
          id="command"
          list="keys"
          onChange={handleChange}
          type="text"
          value={newKeycap.command}
        />
      </div>

      <div className="row">
        <label htmlFor="background">Background</label>
        <input 
          className="input-color" 
          id="background" 
          onChange={handleChange} 
          type="color" 
          value={newKeycap.background}
        />
      </div>
      <div className="row label">
        <label htmlFor="idApp">App</label>
        <input 
          className="input-title"
          id="appTitle" 
          onChange={handleChange} 
          type="text" 
          value={newKeycap.appTitle} 
        />
      </div>
    </div>
  );
}

export default ModalNewKeycap;