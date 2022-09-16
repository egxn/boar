import { useState } from "react";
import { KeyInterface } from "./Key";
import keyCommands from "./keys";
import './styles.css';

interface ModalNewKeyProps {
  onClose: () => void;
  onSave: (newKey: KeyInterface) => void;
};

function ModalNewKey({ onClose, onSave }: ModalNewKeyProps) {
  const [kind, setKind] = useState('key');
  const [newKey, setNewKey] = useState<KeyInterface>({
    command: "",
    label: "",
    background: "#ffffff",
    idApp: "",
    kind,
  });

  const saveKey = () => {
    const { command, label, background } = newKey;
    if (command && label && background) {
      onSave(newKey);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => 
    setNewKey(k =>  ({ ...k, [event.target.id]: event.target.value }));
  const toggleKind = (event: React.ChangeEvent<HTMLInputElement>) => setKind(event.target.id);
  const pushCommand = (command: string) => 
    setNewKey(k => ({ ...k, command: k.command ? k.command + '+' + command : command }));

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
          <input className="input-text" id="label" maxLength={9} onChange={handleChange} type="text" value={newKey.label} />
        </div>

        <div className="row row-type" >
          <input id="keys" onChange={toggleKind} name="kind" type="radio" value="key" checked={kind === "keys"} />
          <label htmlFor="keys"> Keys </label>
          <input id="type" onChange={toggleKind} name="kind" type="radio" value="type" checked={kind === "type"}/>
          <label className="ml" htmlFor="type"> Text </label>
        </div>

        {kind === "keys" && (
          <div className="row key-commands">
            {keyCommands.map((keyCommand) => 
              <button 
                className="key-command" 
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
            value={newKey.command}
          />
        </div>

        <div className="row">
          <label htmlFor="background">Background</label>
          <input className="input-color" id="background" onChange={handleChange} type="color" value={newKey.background} />
        </div>
      </div>
    </div>
  );
}

export default ModalNewKey;