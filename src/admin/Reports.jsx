import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import { Bars, fillDays, day } from './Charts.jsx';
const ago = (n) => day(new Date(Date.now() - n * 864e5));

export default function Reports({ a }) {
  const [from, setFrom] = useState(ago(30)); const [to, setTo] = useState(day(new Date())); const [rows, setRows] = useState([]);
  useEffect(() => { api(`/reports?from=${from}&to=${to}`, { admin: true }).then(setRows); }, [from, to]);
  const days = fillDays(rows, from, to).slice(-120);
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0), n = sum('orders');
  const quick = (d) => { setFrom(ago(d)); setTo(day(new Date())); };
  return (<>
    <div className="row filters">
      {[[7, a.last7], [30, a.last30], [90, a.last90]].map(([d, l]) => <button key={d} className="btn sm ghost" onClick={() => quick(d)}>{l}</button>)}
      <label>{a.from} <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <label>{a.to} <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <button className="btn ghost" onClick={() => window.print()}>{a.print}</button>
    </div>
    <div className="stats">
      <div className="stat"><b>{n}</b><span>{a.ordersInPeriod}</span></div><div className="stat"><b>{money(sum('revenue'))}</b><span>{a.revenueInPeriod}</span></div>
      <div className="stat"><b>{money(n ? sum('revenue') / n : 0)}</b><span>{a.avgOrder}</span></div>
    </div>
    {n ? <><Bars data={days} k="orders" label={a.ordersPerDay} /><Bars data={days} k="revenue" label={a.revenuePerDay} fmt={(v) => Math.round(v)} /></> : <p className="muted">{a.noOrdersPeriod}</p>}
  </>);
}
