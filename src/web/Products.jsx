import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
export default function Products({ t }) {
  const [products, setProducts] = useState(null);
  const [cart, setCart] = useState({});
  const [f, setF] = useState({ customerName: '', phone: '', address: '' });
  const [msg, setMsg] = useState(''); const [toast, setToast] = useState('');
  useEffect(() => { api('/products').then(setProducts).catch(() => setProducts([])); }, []);
  const list = products || [];
  const lines = list.filter((p) => cart[p._id]);
  const count = lines.reduce((s, p) => s + cart[p._id], 0), total = lines.reduce((s, p) => s + p.price * cart[p._id], 0);
  const setQty = (id, d) => setCart((c) => { const q = Math.max(0, (c[id] || 0) + d); const n = { ...c, [id]: q }; if (!q) delete n[id]; return n; });
  const add = (p) => { setQty(p._id, 1); setToast(`${p.name} · ${t.added}`); clearTimeout(add.tm); add.tm = setTimeout(() => setToast(''), 1800); };
  const tilt = (e) => { const el = e.currentTarget, r = el.getBoundingClientRect(); el.style.setProperty('--ty', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`); el.style.setProperty('--tx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`); };
  const flat = (e) => { e.currentTarget.style.setProperty('--ty', '0deg'); e.currentTarget.style.setProperty('--tx', '0deg'); };
  const submit = async (e) => {
    e.preventDefault();
    try { await api('/orders', { method: 'POST', body: { ...f, items: lines.map((p) => ({ product: p._id, qty: cart[p._id] })) } }); setCart({}); setF({ customerName: '', phone: '', address: '' }); setMsg(t.placed); }
    catch (err) { setMsg(err.message); }
  };
  return (
    <section id="products" className="section band">
      <h2 className="center" data-reveal>{t.products}</h2>
      <div className="shop">
        <div className="grid">
          {products === null && Array.from({ length: 6 }, (_, i) => <div key={i} className="product skeleton" />)}
          {list.map((p, i) => (
            <article key={p._id} className="product" data-reveal style={{ '--d': `${(i % 3) * 0.08}s` }}>
              <div className="card" onMouseMove={tilt} onMouseLeave={flat}>
                {p.badge && <span className="badge">{p.badge}</span>}
                <div className="img"><img src={p.image} alt={p.name} loading="lazy" /></div>
                <h3>{p.name}</h3><p>{p.description}</p>
                <div className="row"><strong>{money(p.price)}</strong><button className="btn sm" onClick={() => add(p)}>{t.add} +</button></div>
              </div>
            </article>
          ))}
        </div>
        <form id="cart" className="cart" onSubmit={submit}>
          <h3>{t.cart}</h3>
          {!lines.length && <p className="muted">{t.empty}</p>}
          {lines.map((p) => (
            <div className="line" key={p._id}><span>{p.name}</span>
              <span className="qty"><button type="button" onClick={() => setQty(p._id, -1)}>−</button>{cart[p._id]}<button type="button" onClick={() => setQty(p._id, 1)}>+</button></span></div>
          ))}
          {!!lines.length && <>
            <input required placeholder={t.name} value={f.customerName} onChange={(e) => setF({ ...f, customerName: e.target.value })} />
            <input required placeholder={t.phone} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <input placeholder={t.address} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
            <div className="row"><span>{t.total}</span><strong>{money(total)}</strong></div>
            <button className="btn">{t.place}</button></>}
          {msg && <p role="status" className="muted">{msg}</p>}
        </form>
      </div>
      {count > 0 && <a href="#cart" className="fab" key={count}><b>{count}</b> {t.items} · {money(total)}</a>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
