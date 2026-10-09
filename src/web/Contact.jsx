import { useState } from 'react';
import { api } from '../api.js';
export default function Contact({ t }) {
  const [f, setF] = useState({ name: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const submit = async (e) => { e.preventDefault(); await api('/contact', { method: 'POST', body: f }); setF({ name: '', email: '', message: '' }); setDone(true); };
  return (
    <section id="contact" className="section contact">
      <div className="visit" data-reveal="left">
        <h2>{t.getInTouch}</h2>
        <p><b>{t.visit}</b><br />{t.address1}<br />{t.hours}</p>
        <p><b>{t.phone}</b><br />+355 69 000 0000</p><p><b>{t.email}</b><br />hello@aneli.al</p>
      </div>
      <form className="form" data-reveal="right" onSubmit={submit}>
        <h3>{t.contactTitle}</h3>
        <input required placeholder={t.name} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input required type="email" placeholder={t.email} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <textarea required rows="5" placeholder={t.message} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
        <button className="btn">{t.send}</button>
        {done && <p role="status" className="muted">{t.sent}</p>}
      </form>
    </section>
  );
}
