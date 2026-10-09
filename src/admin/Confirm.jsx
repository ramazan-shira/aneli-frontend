import Modal from './Modal.jsx';
import { Trash } from './Icons.jsx';
export default function Confirm({ a, text, name, onYes, onNo }) {
  return (
    <Modal title={a.confirmTitle} onClose={onNo}>
      <div className="confirm">
        <span className="confirm-ic"><Trash size={26} /></span>
        <p><b>{text}</b>{name && <><br /><span>{name}</span></>}<br /><span className="muted">{a.cannotUndo}</span></p>
      </div>
      <div className="row end"><button className="btn ghost" onClick={onNo} autoFocus>{a.cancel}</button><button className="btn danger" onClick={onYes}><Trash /> {a.del}</button></div>
    </Modal>
  );
}
