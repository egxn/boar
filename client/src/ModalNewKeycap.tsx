import { useState } from "react";
import { KeycapProps } from "./Keycap";
import keyCommands from "./keys";
import './styles.css';

enum Kind {
  Keys = "keys",
  Type = "type",
}

interface ModalNewKeycapProps {
  onClose: () => void;
  onSave: (newKeycap: KeycapProps) => void;
};

function ModalNewKeycap({ onClose, onSave }: ModalNewKeycapProps) {
  const [kind, setKind] = useState(Kind.Keys);
  const [newKeycap, setNewKeycap] = useState<KeycapProps>({
    appTitle: '',
    background: '#ffffff',
    command: '',
    kind,
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
    setKind(event.target.value as Kind);
  const pushCommand = (command: string) => 
    setNewKeycap(k => ({ ...k, command: k.command ? k.command + '+' + command : command }));

  return (
    <div className="modal-overlay">
      <div className="modal-new-keycap">
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
            checked={kind === "keys"} 
          />
          <label htmlFor="keys"> Keys </label>
          <input 
            id="type" 
            onChange={toggleKind} 
            name="kind" 
            type="radio" 
            value={Kind.Type} 
            checked={kind === "type"}
          />
          <label className="ml" htmlFor="type"> Text </label>
        </div>

        {kind === Kind.Keys && (
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
            disabled={kind === "keys"}
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
        <div className="row">
          <label htmlFor="idApp">App title</label>
          <input 
            className="input-text" 
            id="appTitle" 
            onChange={handleChange} 
            type="text" 
            value={newKeycap.appTitle} 
          />
        </div>
      </div>
    </div>
  );
}

export default ModalNewKeycap;